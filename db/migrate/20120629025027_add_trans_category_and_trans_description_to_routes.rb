class AddTransCategoryAndTransDescriptionToRoutes < ActiveRecord::Migration
  def self.up
    add_column :routes, :trans_category, :string
    add_column :routes, :trans_description, :string
  end

  def self.down
    remove_column :routes, :trans_description
    remove_column :routes, :trans_category
  end
end
