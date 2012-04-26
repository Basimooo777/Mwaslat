module RoutesHelper
  def link_to_add_sub_route (builder)
    sub_route = SubRoute.new
    sub_route.dest = Node.new
    fields = builder.fields_for(:sub_routes, sub_route, :child_index => "sub_route_index") do |f_sub_route|
      render("sub_route_fields", :f => f_sub_route)
    end
    link_to_function "[+] Add New Stop", "enable_sub_route(\"#{escape_javascript(fields)}\")";
  end
end
