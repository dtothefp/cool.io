class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :title
      t.string :description
      t.string :image_url
      t.string :link_url
      t.string :created_time

      t.timestamps
    end
  end
end
