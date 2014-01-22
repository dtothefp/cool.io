class SessionsController < ApplicationController
  # # def create
  # #   response = request.env["omniauth.auth"]
  # #   #https://graph.facebook.com/640435782/statuses?access_token=CAAJKj4uOF0ABAFePMy3PxT7YLfUaGRgVSZCaDY9Na9JaSIdvPmHZAySlPMZCf6wVFsSmgzgVUy3xgvj5ZAHiXL194i31YOQP61IUduWKLrA22hQmlH30xEfymRaUDc4gbVP7CCmfGvKUS56zz5hNFJFsAZBuaQNtgfYKM967ZBFYk57pLZCX9MS
  # #   render json: response


  # #   #https://graph.facebook.com/oauth/access_token?%20grant_type=fb_exchange_token&%20client_id=644930335545152&%20client_secret=92750792f0caac0188345dfecd2786a0&%20fb_exchange_token=CAAJKj4uOF0ABAFePMy3PxT7YLfUaGRgVSZCaDY9Na9JaSIdvPmHZAySlPMZCf6wVFsSmgzgVUy3xgvj5ZAHiXL194i31YOQP61IUduWKLrA22hQmlH30xEfymRaUDc4gbVP7CCmfGvKUS56zz5hNFJFsAZBuaQNtgfYKM967ZBFYk57pLZCX9MS
  # # end

 def create
  @user = User.find_by(fb_id: params[:fb_id])
    if !session[:user_id]
      session[:user_id] = @user.id
      #TODO update access token
      User.update_access_token(params[:fb_id], params[:oauth_token], params[:oauth_expires_at])
    end
  
  render json: {id: @user.id, returning_user: @user.returning_user}

 end

 def destroy
  session[:user_id] = nil

  render json: {}
 end

end
