ENV["REDISTOGO_URL"] ||= "redis://redistogo:b8bf1e5f6b7b9f0a577e53ac4c4e8243@grideye.redistogo.com:9664/"

uri = URI.parse(ENV["REDISTOGO_URL"])
Resque.redis = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password, :thread_safe => true)