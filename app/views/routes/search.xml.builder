if @routes != nil

	xml.search do
		@routes.each do |route|
			xml.routes do
				route.each do |r|
					xml.sub_route do
						xml.src do
							xml.name r.src.name
							xml.path r.src.path
						end
						xml.dest do
							xml.name r.dest.name
							xml.path r.dest.path
						end
						xml.duration r.duration
						xml.transportation r.route.transportation.category
						xml.cost r.route.cost
					end
				end
			end
		end
	end
	
end