class FriendshipsController < ApplicationController

  def index
    @user = User.find(params[:user_id])
    # Adds friends, associates them with the current user, and adds pics
    Resque.enqueue(FriendAdder, @user.id)
    # Adds Posts, associates them with users as author, liker, or commenter, and counts likes/comments
    Resque.enqueue(PostAdder, @user.id)

    render json: @user.friends
  end

end