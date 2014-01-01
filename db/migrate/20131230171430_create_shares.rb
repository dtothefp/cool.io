class CreateShares < ActiveRecord::Migration
  def change
    create_table :shares do |t|
      t.references :post
      t.references :user
      t.boolean :author
      t.boolean :liker
      t.boolean :commenter

      t.timestamps
    end
  end
end
