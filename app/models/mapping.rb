class Mapping < ActiveRecord::Base
  belongs_to :route
  belongs_to :sub_route
  validates :route_id, :uniqueness => {:scope => :sub_route_id}
  after_destroy :check_sub_route
  
  def check_sub_route
    self.sub_route.destroy if (self.sub_route.mappings.length == 0)
  end
end
