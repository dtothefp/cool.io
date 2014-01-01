class Post < ActiveRecord::Base

  has_many :shares
  has_many :users, through: :shares

end