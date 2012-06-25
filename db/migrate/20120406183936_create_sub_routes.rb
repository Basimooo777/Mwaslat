class CreateSubRoutes < ActiveRecord::Migration
  def self.up
    create_table :sub_routes do |t|
      t.references :src
      t.references :dest
      t.integer :duration
      t.references :route

      t.timestamps
    end
  end

  def self.down
    drop_table :sub_routes
  end
end
