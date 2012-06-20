class ApplicationController < ActionController::Base
  protect_from_forgery
  #rescue_from ActiveRecord::RecordNotFound, :with => :error_page
  
protected
  def error_page
    redirect_to "/404.html"
  end
  
  def notify_node_deletion(node)
    notification_msg = "Admin has deleted your node #{node.name}";
    add_notification(notification_msg, node.user)
  end
  
  def notify_route_deletion(route)
    notification_msg = "Admin has deleted your route between #{route.src.name} and #{route.dest.name}";
    add_notification(notification_msg, route.user)
  end
  def notify_route_update(route)
    notification_msg = "Admin has updated your route between #{route.src.name} and #{route.dest.name}";
    add_notification(notification_msg, route.user)
  end
  
  def add_notification(notification_msg, user)
    notification = Notification.new(:msg => notification_msg, :user => node.user)
    notification.save
  end
private
  def authenticate_admin!
    if !authenticate_user!.admin?
       redirect_to "/404.html"
    end
  end
  
end
