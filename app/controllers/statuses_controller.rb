class StatusesController < ApplicationController

  def index
    @user = User.find(params[:user_id])
    #TODO ADD AN IF STATEMENT TO CHECK IF STATUSES ARE ALREADY LOADED
    add_statuses(@user)
    # https://graph.facebook.com/640435782/feed?access_token=CAACt3ZCPjUmoBAK9R8TjTrJFZAGQgTqEChZBBYPSJLbJVOZCBOqmQIrnQsWJbgAiyINtxPcqsLQXvqu3PpT11RnHLOaf3ZAgaZAepPmtUZAzdQ67uhCpXew3TWtxyZAzh4OPqUYfjByOdZBZBqQKZA0scE6npdCJtEcpI1yzi0qWT4e9zZCj7PaZCkyV9Lh3U9Qw3nDMZD
    render json: @user.shares
  end

  private

  def add_statuses(user)
    response = JSON.parse HTTParty.get "https://graph.facebook.com/" + user.fb_id + "/statuses?access_token=" + user.oauth_token
    binding.pry
    # response["data"].each do |friend_data|
    #   user.friends << User.new(name: friend_data["name"], fb_id: friend_data["id"])
    # end

    # response["data"][0]["message"] iterate through each message
    # inside the iteration
    #### response["data"][0]["likes"]["data"][0]["id"] iterate through each like
    #### response["data"][0]["comments"]["data"][0]["from"]["id"] iterate through each comment
  end

end