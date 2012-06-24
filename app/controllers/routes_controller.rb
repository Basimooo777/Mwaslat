require 'geo_ruby'

class RoutesController < ApplicationController
  #before_filter :authenticate_user!, :except => [:search]
  
  
  def index
   if current_user.admin?
     @search = Route.search(params[:search])
     @routes = @search.group("id").page(params[:page]).per_page(15)
   else
     @routes = current_user.routes
   end
  end
  
  def show
    @route = Route.find(params[:id])
    if current_user.admin? || @route.user == current_user
      @route.order_sub_routes
      @route.sub_routes = @route.sub_routes.unshift(SubRoute.new(:dest=> @route.sub_routes[0].src))
    else
      error_page
    end
  end
  
  def new
    @route = Route.new
    2.times do
      sub_route = @route.sub_routes.build
      sub_route.dest = Node.new
    end
  end
  
  def create
    children = []
    children_params = params[:route]["sub_routes_attributes"]
    keys = children_params.keys
    keys.collect! {|i| i.to_f}
    keys.sort!
    keys.collect! do |i|
       if i == i.to_i
         i.to_i.to_s
       else
         i.to_s 
       end
    end
    puts keys.to_s
    for i in 0..keys.length-1
      child_params = children_params[keys[i]]
      dest_params = child_params["dest_attributes"]
      dest_id = dest_params["id"]
      if child_params["_destroy"] != "1"
        child = SubRoute.new
        dest = Node.find_or_initialize_by_id(dest_id, dest_params)
        child.dest = dest
        child.duration = child_params["duration"].to_f
        children.push(child)
      end
    end
    params[:route].delete("sub_routes_attributes")
    @route = Route.new(params[:route])
    for i in 1..children.length-1
      children[i].src = children[i-1].dest
      children[i].save
    end
    children = children.drop(1)    # removes first sub-route
    @route.sub_routes = children
    @route.user = current_user
    respond_to do |format|
      if @route.save
        format.html { redirect_to(new_route_path, :notice => "Successfully Added") }
      else
        format.html { render :action => "new" }
      end
    end
  end

  # =================================================================
  
   def search
    if(params[:src] != nil or params[:dest] != nil)
      n = Node.new
      if(params[:p_src] != nil)
        x = params[:p_src].split(',')[0]
        y = params[:p_src].split(',')[1]
        p = GeoRuby::SimpleFeatures::Point.new
        p.x = x.to_f
        p.y = y.to_f
        @src = n.contained_districts p
        @dest = Node.where(:name => params[:dest])
      elsif(params[:p_dest] != nil)
        x = params[:p_dest].split(',')[0]
        y = params[:p_dest].split(',')[1]
        p = GeoRuby::SimpleFeatures::Point.new
        p.x = x.to_f
        p.y = y.to_f
        @src = Node.where(:name => params[:src])
        @dest = n.contained_districts p
      elsif(params[:src] != nil and params[:dest] != nil)
          @src = Node.where(:name => params[:src])
          @dest = Node.where(:name => params[:dest])
      end
    @routes = search_helper @src, @dest
    respond_to do |format|
        format.html
        if params[:key] == "1234"
          format.xml       # search.xml
        end
      end
    end
  end
  
  def search_helper src, dest
        search = Search.new
        routes = search.searches(src, dest)
        
        array = []        
        routes.each do |r|
          arr = []
          arr[0] = [true, true]
          for j in 1..(r.length-1)
            if r[j].route == r[j - 1].route
              arr[j - 1][1] = false
            end
            arr[j] = [false, true]
          end
          array.push arr
        end
        routes.push array
        return routes
  end
   
  # =====================================================================    
  
  def destroy
    route = Route.find(params[:id])
    if(current_user.admin?)
      notify_route(route, "deleted")
      route.destroy
    elsif(current_user == route.user)
      route.destroy
      redirect_to (:back)
    else
      error_page
    end
  end
  
  def edit
    @route = Route.find(params[:id])
    if(current_user == @route.user || current_user.admin?)
      @route.order_sub_routes
      @route.sub_routes = @route.sub_routes.unshift(SubRoute.new(:dest=> @route.sub_routes[0].src))
    else
      redirect_to "/404.html"
    end
  end
  
  def update
    @route = Route.find(params[:id])
    children = []
    children_params = params[:route]["sub_routes_attributes"]
    keys = children_params.keys
    keys.collect! {|i| i.to_f}
    keys.sort!
    keys.collect! do |i|
       if i == i.to_i 
         i.to_i.to_s
       else
         i.to_s 
       end
    end
    for i in 0..keys.length-1
      child_params = children_params[keys[i]]
      child_id = child_params["id"]
      dest_params = child_params["dest_attributes"]
      dest_id = dest_params["id"]
      if child_params["_destroy"] == "1"
        SubRoute.destroy(child_id.to_i) if child_id != ""
      else
        child = SubRoute.find_or_initialize_by_id(child_id)
        dest = Node.find_or_initialize_by_id(dest_id)
        dest.update_attributes(dest_params)
        child.dest = dest
        child.duration = child_params["duration"].to_f
        puts child_params["duration"]
        children.push(child)
      end
    end
    params[:route].delete("sub_routes_attributes")
    @route.update_attributes(params[:route])
    for i in 1..children.length-1
      children[i].src = children[i-1].dest
      children[i].save
    end
    children[0].destroy
    children = children.drop(1)    # removes first sub-route
    @route.sub_routes = children
    respond_to do |format|
      if @route.save
        if(current_user.admin? && current_user != @route.user)
          notify_route_update(@route)
        end
        format.html { redirect_to(new_route_path, :notice => "Successfully Updated") }
      else
        format.html { render :action => "new" }
      end
    end
  end
  
  # --------------------------------------------------
  def data
    if params[:commit]
      if params[:commit] == ">"
        @nodes = Node.offset(params[:next].to_i).first(10)
        if @nodes.length == 0
          @nodes = Node.offset(params[:next].to_i - 10).first(10)
          @next = params[:next].to_i - 10
        else
          @next = params[:next].to_i + 10
        end
      else
        if params[:next].to_i - 20 <= 0
          @nodes = Node.first 10
          @next = 10
        else
          @nodes = Node.offset(params[:next].to_i - 20).first(10)
          @next = params[:next].to_i - 10
        end
      end
    else
      @nodes = Node.first 10
      @next = 10
    end
  end
end
  
