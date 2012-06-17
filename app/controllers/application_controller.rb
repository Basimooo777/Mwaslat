class ApplicationController < ActionController::Base
  protect_from_forgery
  #rescue_from ActiveRecord::RecordNotFound, :with => :error_page
  
protected
  def error_page
    redirect_to "/404.html"
  end
private
  def authenticate_admin!
    if !authenticate_user!.admin?
       redirect_to "/404.html"
    end
  end  
end
