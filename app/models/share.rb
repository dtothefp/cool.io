class Share < ActiveRecord::Base
  # validates :user_id, :post_id, :author, :liker, :commenter, presence: true

  belongs_to :user
  belongs_to :post
end