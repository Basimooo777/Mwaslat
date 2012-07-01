class AddReadToNotifications < ActiveRecord::Migration
  def self.up
    add_column :notifications, :read, :boolean
  end

  def self.down
    remove_column :notifications, :read
  end
end
