class FriendAdder
  @queue = :friend_queue

  def self.perform(id)
    user = User.find(id)
    response = JSON.parse HTTParty.get "https://graph.facebook.com/" + user.fb_id + "/friends?access_token=" + user.oauth_token
    response["data"].each do |friend_data|
      user.friends << User.new(name: friend_data["name"], fb_id: friend_data["id"])
    end
    Resque.enqueue(PicsAdder, user.id)
  end

end