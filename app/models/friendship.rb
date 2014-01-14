class Friendship < ActiveRecord::Base
  # validates :user_id, :friend_id, presence: true

  belongs_to :friend, class_name: "User"
  belongs_to :user
end