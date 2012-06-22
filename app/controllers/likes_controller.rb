class LikesController < ApplicationController
  def create    
    if(params[:commit] == "Like")
      status = true
    else
      status = false
    end
    @like = Like.new(params[:like])
    @like.status = status
    @like.save
    @route = @like.route
    @div_id = params[:div_id]
    render :toggle
  end
  
  def update
    action = params[:commit]
    like = Like.find(params[:id])
    if(action == "Unlike" || action == "Undislike")
      like.destroy
    elsif(action == "Like")
      like = Like.find(params[:id])
      like.update_attributes(:status => true)
    else
      like = Like.find(params[:id])
      like.update_attributes(:status => false)
    end
    @route = like.route
    @div_id = params[:div_id]
    render :toggle
  end
  
end
