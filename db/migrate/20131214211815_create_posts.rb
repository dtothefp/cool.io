class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :fb_id
      t.string :title
      t.string :description
      t.string :link_url

      t.timestamps
    end
  end
end
