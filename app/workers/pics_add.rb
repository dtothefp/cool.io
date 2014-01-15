class PicsAdder
  @queue = :pic_queue

  def self.perform(id)
    user = User.find(id)
    response = JSON.parse ( HTTParty.get "https://graph.facebook.com/" + user.fb_id + "?fields=friends.fields(picture)&access_token=" + user.oauth_token )
      response["friends"]["data"].each do |data|
        friend = User.find_by(fb_id: data["id"])   
        friend.image_url = data["picture"]["data"]["url"] 
        friend.save 
      end  
  end
  
end