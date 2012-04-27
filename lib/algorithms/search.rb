class Search
  def searches(src, dest)    # src , dest are arrays of nodes
    puts "I am in search"
    total_pathes=Array.new
    visited=Hash.new
    src.each do |sr|
      dest.each do |ds|
        pathes=Array.new
        pathes[0]=Array.new
        puts sr.class
        depth_ sr,ds,visited,pathes
        pathes.delete_at pathes.size - 1
        pathes.each do |p|
          total_pathes << p
        end
      end
    end
    return total_pathes
  end

  def depth_ node,dst,visited,pathes
    puts node.district
    puts dst.district
    pathes_size = pathes.size
    path = pathes[pathes_size - 1]
    path_size = path.size
    if node!=dst
      routes = get_dests_(node)
      routes.each do |r|
        if visited[node.id]!=true
          pathes_size = pathes.size
          path = pathes[pathes_size - 1]
          path_size = path.size
          visited[node.id]=true
          path[path_size]=r
          rout_dest=get_route_dest(r)
          r=rout_dest[0]
          puts "rout_dest returns #{r.class}"
          depth_ r,dst,visited,pathes
          pathes_size = pathes.size
          path = pathes[pathes_size - 1]
          path_size = path.size
          visited[node.id]=false
          path.delete_at(path_size-1)
        end
      end
    else
      pathes[pathes_size]=Array.new path
    end
  end

  def get_dests_(node)
    puts node.class
    return Route.find_by_sql("select * from routes where src_id = '#{node.id}'")
  end

  def get_route_dest(route)
    return Node.find_by_sql("select * from nodes where id in(select dest_id from routes where id = '#{route.id}')")
  end
end