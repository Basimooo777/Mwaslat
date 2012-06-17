class NodesController < ApplicationController
  # before_filter :authenticate_user!, :except => [:districts]
  def index
    @nodes = Node.limit(100) #current_user.nodes
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

  def show_deleted
    @ids = params[:ids]
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
    if(current_user.admin? || current_user == node.user)
      node_src_routes = node.src_routes
      node_dest_routes = node.dest_routes
      if(node_src_routes.empty? && node_dest_routes.empty?)
        node.destroy
        redirect_to(:back)
      else
        if(current_user.admin?)
          
        else
          redirect_to (:back), :notice => "Can't be deleted"
        end
      end
    else
      redirect_to "/404.html"      
    end
  end

  #------------------------------------------------------------

  def districts
    @names = Node.where("name like ?", "%#{params[:term]}%").limit(5).map(&:name)
    respond_to do |format|
      format.json {render :json => @names}
    end
  end

end
