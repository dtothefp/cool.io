class FriendshipsController < ApplicationController

  def index
    @user = User.find(params[:user_id])
    if @user.friends.count == 0
      add_friends(@user)
      add_pics(@user)
    end

    render json: @user.friends
  end

  def create
    binding.pry
    
  end

  private

  def add_friends(user)
    response = JSON.parse HTTParty.get "https://graph.facebook.com/" + user.fb_id + "/friends?access_token=" + user.oauth_token
    response["data"].each do |friend_data|
      user.friends << User.new(name: friend_data["name"], fb_id: friend_data["id"])
    end
  end

  def add_pics(user)
    response = JSON.parse (HTTParty.get "https://graph.facebook.com/" + user.fb_id + "?fields=friends.fields(picture)&access_token=" + user.oauth_token )
      response["friends"]["data"].each do |data|
        friend = User.find_by(fb_id: data["id"])   
        friend.image_url = data["picture"]["data"]["url"] 
        friend.save 
      end  
  end

end