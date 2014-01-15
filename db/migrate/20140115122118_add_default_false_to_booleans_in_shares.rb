class AddDefaultFalseToBooleansInShares < ActiveRecord::Migration
  def change
    change_column :shares, :author, :boolean, default: false
    change_column :shares, :liker, :boolean, default: false
    change_column :shares, :commenter, :boolean, default: false
  end
end
