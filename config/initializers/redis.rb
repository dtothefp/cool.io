ENV["REDISCLOUD_URL"] ||= "rediscloud:xjE3f065XyROspQo@pub-redis-14746.us-east-1-3.1.ec2.garantiadata.com:14746"

uri = URI.parse(ENV["REDISCLOUD_URL"])
Resque.redis = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password, :thread_safe => true)