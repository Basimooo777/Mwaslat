class Node < ActiveRecord::Base
  belongs_to :user
  has_many :src_routes, :class_name => "SubRoute", :foreign_key => "src_id"
  has_many :dest_routes, :class_name => "SubRoute", :foreign_key => "dest_id"
  has_many :as_district, :class_name => "Containing", :foreign_key => "poi_id"
  has_many :districts, :through => :as_district
  has_many :as_poi, :class_name => "Containing", :foreign_key => "district_id"
  has_many :pois, :through => :as_poi
  validates :name, :presence => true
  validates :path, :presence => true
  validates :category, :presence => true
  
  def self.all_categories
    ["District", "Automotive", "Business", "Education", "Emergency", "Entertainment", "Food & Drink",
      "Government", "Lodging", "Public Services", "Shops", "Tourist Attraction",
      "Travel", "Recreation", "Other"]
  end
end
