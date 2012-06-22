class ApplicationController < ActionController::Base
  protect_from_forgery
  #rescue_from ActiveRecord::RecordNotFound, :with => :error_page
  
protected
  def error_page
    redirect_to "/404.html"
  end
  
  def notify_node(node, action)
    if(current_user != node.user)
      notification_msg = "Admin has #{action} your node #{node.name}";
      add_notification(notification_msg, node.user)
    end
  end
  
  def notify_route(route, action)
    if(current_user != route.user)
      notification_msg = "Admin has #{action} your route between #{route.src.name} and #{route.dest.name}";
     add_notification(notification_msg, route.user)
    end
  end
  
  def add_notification(notification_msg, user)
    notification = Notification.new(:msg => notification_msg, :user => user)
    notification.save
  end

  # authorization methods
  
  def allow_guest!
    authenticate_user!
  end
  
  def prevent_guest!
    if(current_user.nil?)
      error_page
    end
  end

  def admin_only!
    if current_user.nil? || !current_user.admin?
      error_page
    end
  end
  
end
