class ChangeImageUrlColumnTypeInPosts < ActiveRecord::Migration
  def change
    change_column :posts, :image_url, :text
  end
end
