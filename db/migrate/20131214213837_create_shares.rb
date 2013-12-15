class CreateShares < ActiveRecord::Migration
  def change
    create_table :shares do |t|
      t.references :shareable, polymorphic: true
      t.boolean :on_wall, default: false
      t.boolean :poster, default: false
      t.boolean :commenter, default: false
      t.boolean :tagger, default: false
      t.boolean :tagged, default: false
      t.references :user

      t.timestamps
    end
  end
end
