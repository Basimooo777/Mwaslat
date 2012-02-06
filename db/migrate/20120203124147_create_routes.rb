class CreateRoutes < ActiveRecord::Migration
  def self.up
    create_table :routes do |t|
      t.references :src
      t.references :dest
      t.float :time
      t.float :cost
      t.references :transportation

      t.timestamps
    end
  end

  def self.down
    drop_table :routes
  end
end
