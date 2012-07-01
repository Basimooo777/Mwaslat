class RemoveTranportationIdFromRoute < ActiveRecord::Migration
  def self.up
     remove_column :routes, :transportation_id
  end

  def self.down
    change_table :routes do |t|
      t.references :transportation
    end
  end
end
