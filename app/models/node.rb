class Node < ActiveRecord::Base
  has_many :points
  has_many :streets
  # has_many :srcs, :class_name => "Route", :foreign_key => :src_id
  # has_many :dests, :class_name => "Route", :foreign_key => :dest_id
   def get_lats
      lats = []
      self.points.each do |p|
        lats.push p.latitude
      end
      return lats.join(",")
   end
   def get_lngs
      lngs = []
      self.points.each do |p|
        lngs.push p.longitude
      end
      return lngs.join(",")
   end
end