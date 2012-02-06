class Route < ActiveRecord::Base
  belongs_to :src, :class_name => "Node"
  belongs_to :dest, :class_name => "Node"
  belongs_to :transportation
end
