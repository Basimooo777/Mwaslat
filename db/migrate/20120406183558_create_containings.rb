class CreateContainings < ActiveRecord::Migration
  def self.up
    create_table :containings do |t|
      t.references :district
      t.references :poi

      t.timestamps
    end
  end

  def self.down
    drop_table :containings
  end
end
