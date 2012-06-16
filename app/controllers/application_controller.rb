class ApplicationController < ActionController::Base
  protect_from_forgery
  
  private
  def authenticate_admin!
    if !authenticate_user!.admin?
       redirect_to "/404.html"
    end
  end  
end
