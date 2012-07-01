class CreateMappings < ActiveRecord::Migration
  def self.up
    create_table :mappings do |t|
      t.references :route
      t.references :sub_route
      t.integer :duration

      t.timestamps
    end
  end

  def self.down
    drop_table :mappings
  end
end
