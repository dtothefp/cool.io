class ChangeAccessTokenAndExpires < ActiveRecord::Migration
  def change
    remove_column :users, :access_token
    remove_column :users, :access_token_expires_at
    add_column :users, :oauth_token, :string
    add_column :users, :oauth_expires_at, :datetime
  end
end
