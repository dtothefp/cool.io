class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.string :fb_id
      t.string :title
      t.string :description
      t.string :image_url

      t.timestamps
    end
  end
end
