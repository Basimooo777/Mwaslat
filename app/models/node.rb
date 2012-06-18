require 'geo_ruby'

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
  attr_accessor :node_points
  
  def out_bounds?(point)
    pol = GeoRuby::SimpleFeatures::Polygon.from_points([@node_points], 4326, false, false)
    point1, point2 = pol.bounding_box
    max_x = [point1.x, point2.x].max
    max_y = [point1.y, point2.y].max
    min_x = [point1.x, point2.x].min
    min_y = [point1.y, point2.y].min
    return (point.x < min_x || point.x > max_x || point.y < min_y || point.y > max_y)
  end

  def check_ys?(point, start_point, end_point)
    bool1 = start_point.y <= point.y
    bool2 = point.y < end_point.y
    bool3 = end_point.y <= point.y
    bool4 = point.y < start_point.y
    bool5  = bool1 && bool2
    bool6  = bool3 && bool4
    return bool5 || bool6
  end

  def check_ray?(point, start_point, end_point)
    temp1 = (end_point.x - start_point.x) * (point.y - start_point.y)
    temp2 = end_point.y - start_point.y
    point_new_x = ( temp1 / temp2 ) + start_point.x
    point.x <= point_new_x
  end

  def include_point? (point)
    return false if out_bounds?point
    i = -1
    j = @node_points.length - 1
    counter = 0
    len = @node_points.length
    while (i += 1) < len
      start_point = @node_points[i]
      end_point = @node_points[j]
      if check_ys?(point, start_point, end_point)
        if check_ray?(point, start_point, end_point)
          counter += 1
        end
      end
      j = i
    end

    return true if counter % 2 == 1     # check if counter ODD
    return false
  end

  
  def include_node?(node)
    arr = node.node_points
    c = true
    for i in 0..arr.length - 1
      if(!self.include_point?arr[i])
        c = false
        break
      end
    end
    return c
  end

  def decode_path
    node_array = Polylines::Decoder.decode_polyline(self.path)
    self.node_points = Array.new
    for i in 0..node_array.length-1
      @node_points[i] = GeoRuby::SimpleFeatures::Point.from_x_y(node_array[i][0], node_array[i][1])
    end
  end
  
  def self.all_categories
    ["District", "Automotive", "Business", "Education", "Emergency", "Entertainment", "Food & Drink",
      "Government", "Lodging", "Public Services", "Shops", "Tourist Attraction",
      "Travel", "Recreation", "Other"]
  end
  
  def self.getAllPios
    Node.search(:category_ne => "District").all
  end
  
  def self.getAllDistricts
    Node.search(:category_eq => "District").all
  end
end
