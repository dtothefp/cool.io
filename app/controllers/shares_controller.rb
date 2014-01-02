class SharesController < ApplicationController

  def index
    @user = User.find(params[:user_id])
    response = JSON.parse HTTParty.get "https://graph.facebook.com/" + @user.fb_id + "?fields=photos,posts,statuses,links&access_token=" + @user.oauth_token

    photo_data = response["photos"]
    link_data = response["links"]["data"]
    status_data = response["statuses"]
    post_data = response["posts"]
    link_data.each do |link|
      link_instance = Link.create(title: link["name"], description: link["description"], link_url: link["link"], image_url: link["picture"] ? link["picture"] : nil)

      link["likes"]["data"].each do |liker|
        user = User.find_by(fb_id: liker["id"])
  
      end
    end
    render json: @user.shares
  end

  def create
    @user = User.find_by(fb_id: params[:fb_id])
    response = JSON.parse HTTParty.get "https://graph.facebook.com/" + @user.fb_id + "/feed?access_token=" + @user.oauth_token
  end

  private

  def add_statuses(user)
    
    # response["data"].each do |friend_data|
    #   user.friends << User.new(name: friend_data["name"], fb_id: friend_data["id"])
    # end

    # response["data"][0]["message"] iterate through each message
    # inside the iteration
    #### response["data"][0]["likes"]["data"][0]["id"] iterate through each like
    #### response["data"][0]["comments"]["data"][0]["from"]["id"] iterate through each comment
  end

end