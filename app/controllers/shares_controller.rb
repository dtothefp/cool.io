class SharesController < ApplicationController

  def index
    res = ActiveRecord::Base.connection.execute("SELECT post_id FROM shares WHERE user_id = 42939 AND author = true")
    res2 = res.map {|a| ActiveRecord::Base.connection.execute("SELECT user_id, COUNT(user_id) FROM shares WHERE post_id = #{a["post_id"]} AND (commenter = true OR liker = true) GROUP BY user_id;")}
    res2.each do |a|
      a.each {|b| puts b}
    end
  end

end