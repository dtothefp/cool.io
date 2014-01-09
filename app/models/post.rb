class Post < ActiveRecord::Base

  has_many :shares
  has_many :users, through: :shares

  def self.create_link(post, type)
    create(title: post["name"], description: post["description"], link_url: post["link"], image_url: post["picture"] ? post["picture"] : nil, type: type)
  end


end