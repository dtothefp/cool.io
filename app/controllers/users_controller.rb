class UsersController < ApplicationController
  def index
    @user = User.all

    render json: @user
  end

  def create
    @user = User.find_or_initialize_by(fb_id: user_params[:fb_id])
    if @user.persisted?
      if !@user.authenticated?
        # USER PREVIOUSLY STORED AS AN AUTHENTICATE USER'S FRIEND -- MUST PERSIST EMAIL, OAUTH, AND AUTHENTICATE
        response = JSON.parse HTTParty.get "https://graph.facebook.com/" + user_params[:fb_id] + "?access_token=" + user_params[:oauth_token]
        @user.email = response.email
        @user.type = "Authenticated"
      end
      #UPDATE THE RETURNING AUTHENTICATED USER'S OAUTH TOKEN
      @user.oauth_token = user_params[:oauth_token]
      @user.oauth_expires_at = user_params[:oauth_expires_at]

      binding.pry
      if @user.save
        render json: @user
      else
        render json: @user.errors, status: :unprocessable_entity
      end

    else
      response = JSON.parse HTTParty.get "https://graph.facebook.com/" + user_params[:fb_id] + "?fields=id,name,picture,email&access_token=" + user_params[:oauth_token]
      @user.attributes = user_params.merge({name: response["name"], email: response["email"], type: "Authenticated", image_url: response["picture"]["data"]["url"]})
      binding.pry

      if @user.save
        render json: @user
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end

    #TODO Dry that SHIT up!!!!! DAwwwwgggg!!!
    # OPTIMIZE make sure to only check and update as necessary in the future
  end

  def show
    @user = User.find(params[:id])

    render json: @user
  end

  private

  def user_params
      params.require(:user).permit(:fb_id, :oauth_expires_at, :oauth_token)
  end

  def parse_token(token)
    response_token = HTTParty.get("https://graph.facebook.com/oauth/access_token?%20grant_type=fb_exchange_token&%20client_id=" + ENV["FACEBOOK_KEY_COOL_IO"] + "&%20client_secret=" + ENV["FACEBOOK_SECRET_COOL_IO"] + "&%20fb_exchange_token=" + token )
    response_token.scan(/=([0-9a-zA-Z]+)/)
  end

  def set_oauth(user)
    token_arr = parse_token(params[:ouath_token])
    user.short_term_token = params[:ouath_token]
    user.oauth_expires_at = token_arr[1][0]
    user.oauth_token = token_arr[0][0]
  end

  def add_pic(user)
    response = JSON.parse (HTTParty.get "https://graph.facebook.com/" + user.fb_id + "?fields=friends.fields(picture)&access_token=" + user.oauth_token )
      response["friends"]["data"].each do |data|
        friend = User.find_by(fb_id: data["id"])   
        friend.image_url = data["picture"]["data"]["url"] 
        friend.save 
      end  
  end


end