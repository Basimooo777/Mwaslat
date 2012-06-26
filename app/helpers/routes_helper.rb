module RoutesHelper
  def get_stop (builder)
    sub_route = SubRoute.new
    sub_route.dest = Node.new
    fields = builder.fields_for(:sub_routes, sub_route, :child_index => "sub_route_index") do |f_sub_route|
      render("sub_route_fields", :f => f_sub_route)
    end
  end
  
  def get_hours(duration)
    if(!duration.nil?)
      "#{duration/60} hours"
    else
      "0 hours"
    end
  end
  
  def get_minutes(duration)
    if(!duration.nil?)
      "#{duration%60} minutes"
    else
      "0 minutes"
    end
  end
end
