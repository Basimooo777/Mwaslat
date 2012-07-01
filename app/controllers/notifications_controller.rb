class NotificationsController < ApplicationController
  
  def index
    @notifications = current_user.notifications.order("created_at desc")
  end
  
  def destroy
    notification = Notification.find(params[:id])
    @id = notification.id
    notification.destroy
  end
  
  def mark_as_read
    notification = Notification.find(params[:id])
    notification.read = 1
    notification.save
    @id = notification.id
  end
end
