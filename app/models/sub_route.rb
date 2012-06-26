class SubRoute < ActiveRecord::Base
  belongs_to :src, :class_name => "Node"
  belongs_to :dest, :class_name => "Node"
  belongs_to :route
  accepts_nested_attributes_for :src
  accepts_nested_attributes_for :dest
  attr_accessor :duration_hours, :duration_minutes
  
  def sum_duration
    self.duration = self.duration_hours * 60 + self.duration_minutes
  end
end
