class User < ActiveRecord::Base

  has_many :friends, through: :friendships
  has_many :friendships, foreign_key: "user_id", class_name: "Friendship"
  has_many :shares

  def self.from_omniauth(auth)
    where(auth.slice(:provider, :uid)).first_or_initialize.tap do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.name = auth.info.name
      user.oauth_token = auth.credentials.token
      user.oauth_expires_at = Time.at(auth.credentials.expires_at)
      user.save!
    end
  end
end