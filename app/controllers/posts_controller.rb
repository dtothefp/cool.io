class PostsController < ApplicationController

  def create
    response = JSON.parse HTTParty.get "https://graph.facebook.com/" + user.fb_id + "/feed?access_token=" + user.oauth_token
    binding.pry
  end

end