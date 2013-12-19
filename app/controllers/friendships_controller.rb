class FriendshipsController < ApplicationController

  def index
    @user = User.find(params[:user_id])
    if @user.friends.count == 0
      add_friends(@user)
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
      photo = HTTParty.get "https://graph.facebook.com/" + friend_data["id"] + "/picture?access_token=" + user.oauth_token
      binding.pry
      friend = User.create(name: friend_data["name"], fb_id: friend_data["id"], image_url: photo)
      user.friends << friend
    end
  end

end