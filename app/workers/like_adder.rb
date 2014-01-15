class LikeAdder
  @queue = :like_queue

  # TODO Refactor likes and comments adding
  def self.perform(post_obj, post_id)
    if post_obj["likes"]
      post_obj["likes"]["data"].each do |liker|
        user = User.find_by(fb_id: liker["id"])
        # TODO if the user does not already exist, use a method to add them to the database as an unauthenticated user
        if user
          Share.create(post_id: post_id, user_id: user.id, liker: true)
        end
      end
    end
    if post_obj["comments"]
      post_obj["comments"]["data"].each do |commenter|
        user = User.find_by(fb_id: commenter["from"]["id"])
        if user
          Share.create(post_id: post_id, user_id: user.id, commenter: true)
        end
      end
    end
  end

end