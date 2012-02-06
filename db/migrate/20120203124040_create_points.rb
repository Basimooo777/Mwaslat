class CreatePoints < ActiveRecord::Migration
  def self.up
    create_table :points do |t|
      t.float :longitude
      t.float :latitude
      t.references :node

      t.timestamps
    end
  end

  def self.down
    drop_table :points
  end
end
