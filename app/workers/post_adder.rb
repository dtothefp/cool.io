class PostAdder
  @queue = :post_queue

  def self.perform(id)
    user = User.find(id)
    response = JSON.parse(HTTParty.get("https://graph.facebook.com/" + user.fb_id + "?fields=photos,posts,statuses,links&access_token=" + user.oauth_token))
    post_types = { "App" => "posts", "Photo" => "photos", "Status" => "statuses", "Link" => "links"}
    post_types.each do |type, fb_type|
      response[fb_type]["data"].each do |post|
        post_instance = Post.create_link(post, type)
        Share.create(post_id: post_instance.id, user_id: user.id, author: true)
        Resque.enqueue(LikeAdder, post, post_instance.id)
      end
    end
    Resque.enqueue(CountAdder, id)
  end

end