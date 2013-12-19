class User < ActiveRecord::Base
  validates :name, presence: true
  validates :fb_id, presence: true, uniqueness: true

  has_many :friends, through: :friendships
  has_many :friendships, foreign_key: "user_id", class_name: "Friendship"
  has_many :shares


  def self.exists? fb_id
    # User.where(fb_id: self.fb_id) ? true : false
    User.find_by(fb_id: fb_id) ? true : false
  end

  # def self.authenticated_exists? fb_id
  #   if User.exists? fb_id && User.authenticated?
  #     return true
  #   else
  #     return false
  #   end
  # end

  def authenticated? 
    self.type == "Authenticated"
  end

  def self.token_expired? fb_id, token
    stored_token = User.find_by(fb_id: fb_id, type: "Authenticated").short_term_token
    token != stored_token ? true : false
  end

end