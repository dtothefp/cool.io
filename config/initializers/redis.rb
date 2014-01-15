if Rails.env.production?
  uri = URI.parse(redis://redistogo:b8bf1e5f6b7b9f0a577e53ac4c4e8243@grideye.redistogo.com:9664/)
  REDIS = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)

  Resque.redis = REDIS
end