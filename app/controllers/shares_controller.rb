class SharesController < ApplicationController

  def index
    # @user = User.find(params[:user_id])
    # response = JSON.parse HTTParty.get "https://graph.facebook.com/" + @user.fb_id + "?fields=photos,posts,statuses,links&access_token=" + @user.oauth_token
    # binding.pry
    # add_links(response)
    # # must find each post that is associated with @user
    # # then find every user that commented/liked the post
    # # then tally the likes/comments
    # # potentially add a count to the DB shares
    # users = Share.where("user_id != #{@user.id}")
    # render json: @user.shares

    res = ActiveRecord::Base.connection.execute("SELECT post_id FROM shares WHERE user_id = 42939 AND author = true")
    res2 = res.map {|a| ActiveRecord::Base.connection.execute("SELECT user_id, COUNT(user_id) FROM shares WHERE post_id = #{a["post_id"]} AND (commenter = true OR liker = true) GROUP BY user_id;")}
    binding.pry
    res2.each do |a|
      a.each {|b| puts b}
    end
  end

end