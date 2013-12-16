class ChangeUsersOauthExpToString < ActiveRecord::Migration
  def change
    change_column :users, :oauth_expires_at, :string
  end
end
