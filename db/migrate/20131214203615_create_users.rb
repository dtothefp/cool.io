class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :fb_id
      t.string :access_token
      t.string :access_token_expires_at
      t.string :type

      t.timestamps
    end
  end
end
