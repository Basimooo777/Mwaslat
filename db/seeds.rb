# in the name of Allah

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)

require 'json'

categories = {
              203 => 'school' ,
              17 => 'shop' ,
              4979 => 'production' ,
              88 => 'district' ,
              74 => 'restaurant' ,
              50 => 'hotel' ,
              287 => 'hospital' ,
              1507 => 'marketplace' ,
              7977 => 'district' ,
              127 => 'museum' ,
              182 => 'office' ,
              1362 => 'mosque' ,
              670 => 'police station' ,
              84 => 'university' ,
              44607 => 'bridge' ,
              27 => 'stadium' ,
              787 => 'pharmacy' ,
              1548 => 'post office' ,
              76 => 'beach' ,
              6644 => 'gas station' ,
              1372 => 'street' ,
              314 => 'library' ,
              3363 => 'night club' ,
              122 => 'church' ,
              44997 => 'information technologies' ,
              613 => 'cinema' ,
              4621 => 'district' ,
              1200 => 'district' ,
              347 => 'college' ,
              5509 => 'tram stop' ,
              133 => 'theatre' ,
              733 => 'club' ,
              332 => 'lake' ,
              708 => 'factory' ,
              25 => 'airport' ,
              1934 => 'company' ,
              55 => 'tower' ,
              44751 => 'train station' ,
              293 => 'tennis court' ,
              427 => 'parking' ,
              926 => 'centre' ,
              108 => 'cafe' ,
              129 => 'square' ,
              217 => 'bank' ,
              1154 => 'supermarket' ,
              181 => 'road' ,
              73 => 'coffee' ,
              1511 => 'bakery' ,
              3053 => 'garage' ,
              261 => 'monument' ,
              1468 => 'embassy' ,
              44756 => 'bus stop' ,
              648 => 'culture center' ,
              107 => 'institute' ,
              3277 => 'consulate' ,
              3319 => 'nursery' ,
              44755 => 'bus station' ,
              3074 => 'college' ,
              11458 => 'amusement' ,
              75 => 'commercial' ,
              3392 => 'bookstore' ,
              2211 => 'pastry' ,
              45820 => 'internet company' ,
              737 => 'gym' ,
              45057 => 'residential_neighbourhood' ,
              1604 => 'gym' ,
              44795 => 'internet company' }
 
file = File.open("db/data.txt", "r")
counter = 1
while line = file.gets
  obj = JSON.parse line
  cat = ""
  obj['tags'].each do |tag|
    if categories[tag['title']]
       cat = categories[tag['title']]
    end
  end
  Node.create(:name => obj['title'], :path => obj['path'], 
      :center => "#{obj['location']['lon']} , #{obj['location']['lat']}", :category => cat)
  
  puts "#{counter}"
  counter += 1
end
file.close

puts "Thanks my god"
