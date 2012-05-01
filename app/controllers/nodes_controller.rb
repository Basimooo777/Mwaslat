class NodesController < ApplicationController
  before_filter :authenticate_user!

  def index
    @nodes =current_user.nodes
    respond_to do |format|
      format.html # show.html.erb
    end
  end
  
  def edit
    puts "helllo"
    @node = Node.find(params[:id])
  end
  
  def create
    puts "noooooooooooooooooo"
    new_node = Node.new(params[:node])
    new_node.user_id=current_user.id
    #setting node parent 
    
    
    
    
    respond_to do |format|
      if new_node.save
        puts "shehataaaaaaaa"
        format.html { redirect_to(nodes_path, :notice => "Successfully Created") }
      else
        format.html { render :action => "new" }
      end
    end
  end

  def new
    @node =Node.new
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
    puts "heelllo ahmed"
    #puts params[:id]
    found=SubRoute.where(:src_id => params[:id]).exists?
    if(!found)
      found=SubRoute.where(:dest_id => params[:id]).exists?
    end
    if(!found)
        #can be deleted
        my_node = Node.find(params[:id])
        my_node.destroy
        render :text => "1" 
    else
      #cannot be deleted
        render :text => "0" 
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
