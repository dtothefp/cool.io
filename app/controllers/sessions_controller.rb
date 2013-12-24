class SessionsController < ApplicationController
  # # def create
  # #   response = request.env["omniauth.auth"]
  # #   #https://graph.facebook.com/640435782/statuses?access_token=CAAJKj4uOF0ABAFePMy3PxT7YLfUaGRgVSZCaDY9Na9JaSIdvPmHZAySlPMZCf6wVFsSmgzgVUy3xgvj5ZAHiXL194i31YOQP61IUduWKLrA22hQmlH30xEfymRaUDc4gbVP7CCmfGvKUS56zz5hNFJFsAZBuaQNtgfYKM967ZBFYk57pLZCX9MS
  # #   render json: response


  # #   #https://graph.facebook.com/oauth/access_token?%20grant_type=fb_exchange_token&%20client_id=644930335545152&%20client_secret=92750792f0caac0188345dfecd2786a0&%20fb_exchange_token=CAAJKj4uOF0ABAFePMy3PxT7YLfUaGRgVSZCaDY9Na9JaSIdvPmHZAySlPMZCf6wVFsSmgzgVUy3xgvj5ZAHiXL194i31YOQP61IUduWKLrA22hQmlH30xEfymRaUDc4gbVP7CCmfGvKUS56zz5hNFJFsAZBuaQNtgfYKM967ZBFYk57pLZCX9MS
  # # end

 def create
  # session exists
  # session doesn't exist but user does
  # session and user don't exist
  @user = User.find_by(fb_id: params[:fb_id])
  # unless session[:fb_id]
  #   if !@user
  #     @user = User.new_authencticated_user(params[:ouath_token], params[:oauth_expires_at], params[:fb_id])
  #   elsif @user.type.nil?
  #     binding.pry
  #   else
  #     #update token
  #     @user.oauth_token = params[:ouath_token]
  #     @user.oauth_expires_at = params[:oauth_expires_at]
  #     binding.pry
  #   end
  #   session[:fb_id] = params[:fb_id]
  # end

  # if @user.save
  #   render json: {id: @user.id}
  # else
  #   render json: @user.errors, status: :unprocessable_entity
  # end
  session[:fb_id] = params[:fb_id]

  if session[:fb_id]
    render json: params[:session]
  end

 end

 def destroy
  session[:fb_id] = nil

  render json: {}
 end

end
