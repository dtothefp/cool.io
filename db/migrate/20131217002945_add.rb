class Add < ActiveRecord::Migration
  def change
    add_column :users, :short_term_token, :string
  end
end
