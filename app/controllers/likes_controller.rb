class LikesController < ApplicationController
  def create    
    status = params[:status]
    @like = Like.new(params[:like])
    @like.status = status
    @like.save
    @route = @like.route
    @div_id = params[:div_id]
    render :toggle
  end
  
  def destroy
    like = Like.find(params[:id]).destroy
    @route = like.route
    @div_id = params[:div_id]
    render :toggle
  end
  
  def update
    like = Like.find(params[:id])
    like.update_attributes(:status => params[:status])
    @route = like.route
    @div_id = params[:div_id]
    render :toggle
  end
  
end
