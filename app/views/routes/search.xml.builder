if @routes != nil
flags = @routes.pop
i = 0
	xml.search do
		@routes.each do |route|
			j = 0
			xml.routes do
				route.each do |r|
					r.src.decode_path
                   	r.dest.decode_path
                   	
					xml.sub_route do
						xml.src do
							xml.name r.src.name
							r.src.node_points.each do |point|
                               xml.points do
                                       xml.latitude point.x
                                       xml.longitude point.y
                               end
                     	  	end
							xml.isStop flags[i][j][0]
						end
						xml.dest do
							
							xml.name r.dest.name
							r.dest.node_points.each do |point|
							   xml.points do
							           xml.latitude point.x
							           xml.longititude point.y
							   end
                           	end
							xml.isStop flags[i][j][1]
						end
						xml.duration r.duration
						xml.transportation r.route.transportation.category
						xml.cost r.route.cost
					end
					j += 1
				end
			end
			i += 1
		end
	end
	
end