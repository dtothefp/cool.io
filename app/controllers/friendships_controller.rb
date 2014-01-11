class FriendshipsController < ApplicationController

  def index
    @user = User.find(params[:user_id])
    post_count(@user)

    render json: @user.friends
  end

end