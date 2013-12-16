class UsersController < ApplicationController
  def index
    
  end

  def create
    short_term_token = params[:ouath_token]
    long_term_token = HTTParty.get("https://graph.facebook.com/oauth/access_token?%20grant_type=fb_exchange_token&%20client_id=" + ENV["FACEBOOK_KEY_COOL_IO"] + "&%20client_secret=" + ENV["FACEBOOK_SECRET_COOL_IO"] + "&%20fb_exchange_token=" + params[:ouath_token] )
    long_term_token_exp = parse_token(long_term_token)[1][0]
    long_term_token = parse_token(long_term_token)[0][0]
    @user = User.new(user_params)
    @user.oauth_token = long_term_token
    @user.oauth_expires_at = long_term_token_exp
    if @user.save
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private

  def user_params
      params.require(:user).permit(:name, :email, :fb_id)
  end

  def parse_token(token)
    token.scan(/=([0-9a-zA-Z]+)/)
  end
end