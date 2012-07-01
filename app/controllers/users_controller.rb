class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    @routes = @user.routes
    @nodes = @user.nodes
  end
  def index
    @users = User.page(params[:page]).per_page(10)
  end
  def promote
    user = User.find(params[:id])
    user.admin = true
    user.save
    redirect_to (:back)
  end
end
