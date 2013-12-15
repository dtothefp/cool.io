class AddCreateTimeToPhotosPostsStatuses < ActiveRecord::Migration
  def change
    add_column :posts, :created_time, :string
    add_column :photos, :created_time, :string
    add_column :statuses, :created_time, :string
  end
end
