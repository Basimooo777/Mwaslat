class CreateTransportations < ActiveRecord::Migration
  def self.up
    create_table :transportations do |t|
      t.string :category
      t.string :way

      t.timestamps
    end
  end

  def self.down
    drop_table :transportations
  end
end
