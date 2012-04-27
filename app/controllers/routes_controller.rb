class RoutesController < ApplicationController
  def new
    @route = Route.new
    2.times do
      sub_route = @route.sub_routes.build
      sub_route.dest = Node.new
    end
  end
  # =================================================================
  
  def create
    @route = Route.new(params[:route])
    sub_routes = @route.sub_routes
    for i in 1..sub_routes.length-1
      sub_routes[i].src = sub_routes[i-1].dest
    end
    @route.sub_routes = sub_routes.drop(1)    # removes first sub-route
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
    if(params[:src] != nil and params[:dest] != nil)
        @src = Node.where(:name => params[:src])
        @dest = Node.where(:name => params[:dest])
        search = Search.new
        @routes = search.searches(@src, @dest)
        
        respond_to do |format|
          format.html
          format.json {render :json => @routes}
          format.xml {render :xml => @routes}
        end
    end
  end 
  # =====================================================================    
  
  def destroy
    Route.find(params[:id]).destroy
    redirect_to :action => "search"
  end
  
  def edit
    @route = Route.find(params[:id])
    @route.order_sub_routes
    @route.sub_routes = @route.sub_routes.unshift(SubRoute.new(:dest=> @route.sub_routes[0].src))
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