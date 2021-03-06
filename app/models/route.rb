class Route < ActiveRecord::Base
  belongs_to :user
  belongs_to :transportation, :dependent => :destroy
  has_many :sub_routes, :dependent => :destroy
  has_many :likes, :dependent => :destroy
  has_many :srcs, :through => :sub_routes, :class_name => "Node", :foreign_key => "src_id"
  has_many :dests, :through => :sub_routes, :class_name => "Node", :foreign_key => "dest_id"
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
  
  def src
    dests_ids = []
    self.dests.each do |dest|
      dests_ids.push(dest.id)
    end
    self.srcs.each do |src|
      if(dests_ids.index(src.id) == nil)
        return src
      end
    end
  end
  
  def dest
    srcs_ids = []
    self.srcs.each do |src|
      srcs_ids.push(src.id)
    end
    self.dests.each do |dest|
      if(srcs_ids.index(dest.id) == nil)
        return dest
      end
    end
  end
  
  def numOfLikes
    counter = 0
    all_emotions = self.likes
    all_emotions.each do |emotion|
      if(emotion.status?)
        counter += 1
      end
    end
    counter
  end
  
  def numOfDislikes
    counter = 0
    all_emotions = self.likes
    all_emotions.each do |emotion|
      if(!emotion.status?)
        counter += 1
      end
    end
    counter
  end
  
  def cost=(cost)
    if(cost.class == "String")
      write_attribute(:cost, cost.split(" ")[0])
    else
      super
    end
  end
  
  def nodes
    self.srcs | self.dests
  end
end
