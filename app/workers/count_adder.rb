class CountAdder
  @queue = :post_queue

  def self.perform(id)
    user = User.find(id)
    result = ActiveRecord::Base.connection.execute("SELECT post_id FROM shares WHERE user_id = #{user.id} AND author = true")
    processed_result = result.map do |post|
      ActiveRecord::Base.connection.execute("SELECT user_id, COUNT(user_id) FROM shares WHERE post_id = #{post["post_id"]} AND (commenter = true OR liker = true) AND (user_id != #{user.id}) GROUP BY user_id;")
    end
    user_counts = {}
    processed_result.each do |first_obj|
      first_obj.each do |count_obj|
        if user_counts.has_key?(count_obj["user_id"])
          user_counts[count_obj["user_id"]] += count_obj["count"].to_i
        else
          user_counts[count_obj["user_id"]] = count_obj["count"].to_i
        end
      end
    end
    user_counts.each do |user_id, count|
      friend = user.friends.find(user_id)
      friend.update(count: count)
    end

    # completed.call
  end
end