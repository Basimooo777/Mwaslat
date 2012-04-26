class CreateNodes < ActiveRecord::Migration
  def self.up
    create_table :nodes do |t|
      t.string :name
      t.string :path
      t.string :category
      t.integer :zoom
      t.string :center
      t.references :user

      t.timestamps
    end
  end

  def self.down
    drop_table :nodes
  end
end
