class AddReturningUserColumnToUsers < ActiveRecord::Migration
  def change
    add_column :users, :returning_user, :boolean, default: false
  end
end
