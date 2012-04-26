class Route < ActiveRecord::Base
  belongs_to :transportation
  belongs_to :user
  has_many :sub_routes
  accepts_nested_attributes_for :transportation
  accepts_nested_attributes_for :sub_routes, :allow_destroy => true
  def order_sub_routes
      dest_hash = {}
      src_hash = {}
      ordered_routes = []
      parent = nil
      unordered_routes = self.sub_routes
      unordered_routes.each do |s|
        dest_hash[s.dest.id] = s.id
      end
      unordered_routes.each do |s|
        if !dest_hash[s.src.id]
          parent = s
        else
          src_hash[s.src.id] = s
        end
      end
      ordered_routes.push(parent)
      next_route = parent
      while(next_route = src_hash[next_route.dest.id])
          ordered_routes.push (next_route)
      end
      self.sub_routes.pop(self.sub_routes.length)
      ordered_routes.each do |r|
        self.sub_routes.push(r)
      end
  end
end
