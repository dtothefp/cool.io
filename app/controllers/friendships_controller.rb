class FriendshipsController < ApplicationController

  def index
    @user = User.find(params[:user_id])

    render json: @user.friends
  end

end