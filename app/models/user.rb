class User < ActiveRecord::Base
  validates :name, presence: true
  validates :fb_id, presence: true, uniqueness: true

  has_many :friends, through: :friendships
  has_many :friendships, foreign_key: "user_id", class_name: "Friendship"
  has_many :shares

end