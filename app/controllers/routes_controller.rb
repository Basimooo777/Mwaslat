class RoutesController < ApplicationController

  def new

    @route = Route.new
    @routes = Route.all

  end
  
  def create
    
    @route = Route.new(params[:route])
    @trans = Transportation.new(params[:trans])
    @src = Node.new(params[:src])
    @dest = Node.new(params[:dest])

    # For inserting the streets
    count_src = Integer(params[:count_src])
    count_dest = Integer(params[:count_dest])
    for i in 1..count_src do
      str = "street_src#{i}"
      @street = Street.new(:name => params[str])
      @street.node = @src
      @street.save
    end

    for i in 1..count_dest do
      str = "street_dest#{i}"
      @street = Street.new(:name => params[str])
      @street.node = @dest
      @street.save
    end

  # For the points and nodes
    src_lng = params[:src_lng].split(",");
    src_lat = params[:src_lat].split(",");
    dest_lng = params[:dest_lng].split(",");
    dest_lat = params[:dest_lat].split(",");

    # For source points  
    for i in 0...src_lng.length do
      @point = Point.new(:longitude => Float(src_lng[i]), :latitude => Float(src_lat[i]))
      @point.node = @src
      @point.save
    end

    # For destination points  
    for i in 0...dest_lng.length do
      @point = Point.new(:longitude => Float(dest_lng[i]), :latitude => Float(dest_lat[i]))
      @point.node = @dest
      @point.save
    end
    
    @src.save
    @dest.save
    @trans.save
    @route.transportation = @trans
    @route.src = @src
    @route.dest = @dest
    @route.save

    redirect_to(new_route_path, :notice => "Done")
  end
  
  def search
    if(params[:src] != nil)
        @routes = Route.find_by_sql("select * from routes where src_id in 
        (select id from nodes where district='#{params[:src]}') and dest_id in (select id from nodes where district='#{params[:dest]}')")
    end
  end

end