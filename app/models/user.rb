class User < ActiveRecord::Base
  has_many :nodes
  has_many :routes
  has_many :notifications
  has_many :likes, :dependent => :destroy
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :confirmable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me
  
  
  # returns -1 if disliked, 1 if liked, 0 if neutral
  def likedRoute(route)
    result = Like.search(:route_id_eq => route.id, :user_id_eq => self.id).all
    if(result.empty?)
      nil
    else
      result[0]
    end
  end
  def numOfUnread
    self.notifications.search(:read_eq => false).all.length
  end
end