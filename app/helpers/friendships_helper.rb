module FriendshipsHelper

  def add_friends(user)
    response = JSON.parse HTTParty.get "https://graph.facebook.com/" + user.fb_id + "/friends?access_token=" + user.oauth_token
    binding.pry
    response["data"].each do |friend_data|
      user.friends << User.new(name: friend_data["name"], fb_id: friend_data["id"])
    end
  end

  def add_pics(user)
    response = JSON.parse ( HTTParty.get "https://graph.facebook.com/" + user.fb_id + "?fields=friends.fields(picture)&access_token=" + user.oauth_token )
    binding.pry
      response["friends"]["data"].each do |data|
        friend = User.find_by(fb_id: data["id"])   
        friend.image_url = data["picture"]["data"]["url"] 
        friend.save 
      end  
  end

  def post_count(user)
    result = ActiveRecord::Base.connection.execute("SELECT post_id FROM shares WHERE user_id = #{user.id} AND author = true")
    processed_result = result.map do |post|
      ActiveRecord::Base.connection.execute("SELECT user_id, COUNT(user_id) FROM shares WHERE post_id = #{post["post_id"]} AND (commenter = true OR liker = true) AND (user_id != #{user.id}) GROUP BY user_id;")
    end
    binding.pry
    processed_result.each do |first_obj|
      first_obj.each do |count_obj|
        if count_obj["user_id"] != user.id
          friend = user.friends.find(count_obj["user_id"])
          if friend
            friend.update(count: count_obj["count"])
            binding.pry
          end
        end
      end
    end
  end
  
end