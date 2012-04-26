class SubRoute < ActiveRecord::Base
  belongs_to :src, :class_name => "Node"
  belongs_to :dest, :class_name => "Node"
  belongs_to :route
  accepts_nested_attributes_for :src
  accepts_nested_attributes_for :dest
end
