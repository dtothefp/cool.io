class UsersController < ApplicationController
  def index
    @user = User.all

    render json: @user
  end

  def create
    ## TODO expired method doesn't work because short term token is always changing
    @user = User.find_or_initialize_by(fb_id: user_params[:fb_id])
    if @user.persisted?
      if @user.authenticated?
        render json: @user
      else
        set_oauth(@user)
        # add_friends(@user)
        if @user.update
          render json: @user
        else
          #TODO if the user deletes app from their facebook settings they will still be stored in the DB but we need to reset their token
          render json: @user.errors, status: :unprocessable_entity
        end
      end

    else
      @user.attributes = user_params.merge({type: "Authenticated"})
      set_oauth(@user)
      # add_friends(@user)
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
    @user = User.find_by(fb_id: params[:id])

    render json: @user
  end

  def friends
    friends_response = JSON.parse HTTParty.get("https://graph.facebook.com/640435782/friends?access_token=" + current_user.oauth_token)

    render json: friends_response
  end

  private

  def user_params
      params.require(:user).permit(:name, :email, :fb_id, :oauth_expires_at, :image_url)
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