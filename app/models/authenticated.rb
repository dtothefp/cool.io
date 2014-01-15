class Authenticated < User
  validates :email, :type, :oauth_token, presence: true
  
end