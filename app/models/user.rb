class User < ActiveRecord::Base
  validates :name, :fb_id, presence: true

  has_many :friends, through: :friendships
  has_many :friendships, foreign_key: "user_id", class_name: "Friendship"
  has_many :shares
  has_many :posts, through: :shares

  def self.exists?(fb_id)
    User.find_by(fb_id: fb_id) ? true : false
  end

  def authenticated? 
    self.type == "Authenticated"
  end

  def self.token_expired?(fb_id, token)
    stored_token = User.find_by(fb_id: fb_id, type: "Authenticated").short_term_token
    token != stored_token ? true : false
  end

  def self.update_access_token(facebook_id, token, token_expires)
    user = find_by(fb_id: facebook_id);
    user.attributes = { oauth_token: token, oauth_expires_at: token_expires }
    user.save
  end

end