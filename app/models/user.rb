class User < ActiveRecord::Base
  validates :name, presence: true
  validates :fb_id, presence: true, uniqueness: true

  has_many :friends, through: :friendships
  has_many :friendships, foreign_key: "user_id", class_name: "Friendship"
  has_many :shares

  def self.new_authencticated_user(token, token_expires, id)
    response = JSON.parse HTTParty.get "https://graph.facebook.com/" + id + "?fields=id,name,picture,email&access_token=" + token
    new(name: response["name"], email: response["email"], fb_id: id, type: "Authenticated", image_url: response["picture"]["data"]["url"], oauth_token: token, oauth_expires_at: token_expires)
  end

  def self.update_access_token(facebook_id, token, token_expires)
    user = find_by(fb_id: facebook_id);
    user.attributes = { oauth_token: token, oauth_expires_at: token_expires }
    user.save
  end

   def self.add_friends
    response = JSON.parse HTTParty.get "https://graph.facebook.com/" + self.fb_id + "/friends?access_token=" + self.oauth_token
    response["data"].each do |friend_data|
      user.friends << User.new(name: friend_data["name"], fb_id: friend_data["id"])
    end
    self.add_pics
  end

  def self.add_pics
    response = JSON.parse (HTTParty.get "https://graph.facebook.com/" + self.fb_id + "?fields=friends.fields(picture)&access_token=" + self.oauth_token )
      response["friends"]["data"].each do |data|
        friend = User.find_by(fb_id: data["id"])   
        friend.image_url = data["picture"]["data"]["url"] 
        friend.save 
      end  
  end

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