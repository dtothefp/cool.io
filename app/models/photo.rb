class Photo < ActiveRecord::Base

  has_many :shares, :as => :shareable
end