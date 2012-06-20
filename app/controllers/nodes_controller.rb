class NodesController < ApplicationController
  # before_filter :authenticate_user!, :except => [:districts]
  def index
    @nodes = Node.page(params[:page]).per_page(10) #current_user.nodes
    respond_to do |format|
      format.html # show.html.erb
    end
  end

  def edit
    @node = Node.find(params[:id])
    if(!current_user.admin? && current_user != @node.user)
      redirect_to "/404.html"
    end
  end

  def create
    @node = Node.new(params[:node])
    @node.user = current_user
    
    #Setting node parent
    
    
    
    respond_to do |format|
      if @node.save
        format.html { redirect_to(nodes_path, :notice => "Successfully Created") }
      else
        format.html { render :action => "new" }
      end
    end
  end

  def new
    @node = Node.new
  end

  def update
    @node = Node.find(params[:id])
    new_node = Node.new(params[:node])
    @node.path=new_node.path
    @node.name=new_node.name
    @node.category=new_node.category
    @node.save
    respond_to do |format|
      format.html { redirect_to(nodes_path, :notice => "Successfully updated") }
    end
  end

  def destroy
    node = Node.find(params[:id])
    if(request.xhr?)
      if(current_user == node.user)
        node_src_routes = node.src_routes
        node_dest_routes = node.dest_routes
        if(node_src_routes.empty? && node_dest_routes.empty?)
          @id = node.id
          node.destroy
          @destroyed = true
        else
          @destroyed = false
        end
        render "destroy.js"
      end
    else
      if(current_user.admin?)
        node_src_routes = node.src_routes
        node_dest_routes = node.dest_routes
        if(node_src_routes.empty? && node_dest_routes.empty?)
          notify_node_deletion(node)
          node.destroy
          redirect_to (:back), :notice => "Node successfully deleted"
        else
          routes_ids = []
          node_src_routes.each do |sub_route|
            routes_ids.push(sub_route.route.id)
          end
          node_dest_routes.each do |sub_route|
            if(!routes_ids.include? sub_route.route.id)
              routes_ids.push(sub_route.route.id)
            end
          end
          redirect_to :action => "confirm_deletion", :node_id => node.id, :routes_ids => routes_ids, :escape => false
        end
      else
        redirect_to "/404.html"
      end
    end
  end
  
  def confirm_deletion    
    @routes = []
    @routes_ids = params[:routes_ids]
    @node_id = params[:node_id]
    @routes_ids.each do |id|
      @routes.push(Route.find(id))
    end
  end
  
  def deletion_confirmed
    routes_ids = params[:routes_ids]
    node_id = params[:node_id]
    routes_ids.each do |id|
      route = Route.find(id)
      notify_route_deletion(route)
      route.destroy
    end
    node = Node.find(node_id)
    notify_node_deletion(node)        # adds notification for deletion
    Node.destroy(node_id)
    redirect_to :action => "index"
  end
  
  #------------------------------------------------------------

  def districts
    @names = Node.where("name like ?", "%#{params[:term]}%").limit(5).map(&:name)
    respond_to do |format|
      format.json {render :json => @names}
    end
  end
end
