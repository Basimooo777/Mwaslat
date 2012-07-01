class RemoveDurationAndRouteIdFromSubRoutes < ActiveRecord::Migration
  def self.up
    remove_column :sub_routes, :route_id
    remove_column :sub_routes, :duration
  end

  def self.down
    change_table :sub_routes do |t|
      t.references :route
      t.integer :duration
    end
  end
end
