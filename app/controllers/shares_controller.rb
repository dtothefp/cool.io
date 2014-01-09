class SharesController < ApplicationController

  def index
    @user = User.find(params[:user_id])
    response = JSON.parse HTTParty.get "https://graph.facebook.com/" + @user.fb_id + "?fields=photos,posts,statuses,links&access_token=" + @user.oauth_token
    binding.pry
    add_links(response)
    render json: @user.shares
  end

  private

   def add_links(response)
    post_types = { "App" => "posts", "Photo" => "photos", "Status" => "statuses", "Link" => "links"}
    post_types.each do |type, fb_type|
      binding.pry
      response[fb_type]["data"].each do |post|
        post_instance = Post.create_link(post, type)
        Share.create(post_id: post_instance.id, user_id: @user.id, author: true)
        add_likes(post, post_instance)
        add_comments(post, post_instance)
      end
    end
  end

  def add_likes(post_obj, post_instance)
    if post_obj["likes"]
      post_obj["likes"]["data"].each do |liker|
        user = User.find_by(fb_id: liker["id"])
        # TODO if the user does not already exist, use a method to add them to the database as an unauthenticated user
        if user
          Share.create(post_id: post_instance.id, user_id: user.id, liker: true)
        end
      end
    end
  end

  def add_comments(post_obj, post_instance)
    if post_obj["comments"]
      post_obj["comments"]["data"].each do |commenter|
        user = User.find_by(fb_id: commenter["from"]["id"])
        if user
          Share.create(post_id: post_instance.id, user_id: user.id, commenter: true)
        end
      end
    end
  end

end