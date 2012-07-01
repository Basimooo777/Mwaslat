class SubRoute < ActiveRecord::Base
  belongs_to :src, :class_name => "Node"
  belongs_to :dest, :class_name => "Node"
  has_many :mappings
  has_many :routes, :through => :mappings
  accepts_nested_attributes_for :src
  accepts_nested_attributes_for :dest
  attr_accessor :duration_hours, :duration_minutes, :duration
  validates :src_id, :uniqueness => {:scope => :dest_id}  
  
  def sum_duration
    self.duration = self.duration_hours * 60 + self.duration_minutes
  end
end
