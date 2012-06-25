class CreateRoutes < ActiveRecord::Migration
  def self.up
    create_table :routes do |t|
      t.float :cost
      t.references :transportation
      t.references :user

      t.timestamps
    end
  end

  def self.down
    drop_table :routes
  end
end
