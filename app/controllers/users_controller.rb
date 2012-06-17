class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    @routes = @user.routes
    @nodes = @user.nodes
  end
  def index
    @users = User.page(params[:page]).per_page(10)
  end
end
