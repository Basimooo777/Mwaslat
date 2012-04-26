class Containing < ActiveRecord::Base
  belongs_to :district, :class_name => "Node"
  belongs_to :poi, :class_name => "Node"
end
