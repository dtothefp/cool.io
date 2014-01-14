class Post < ActiveRecord::Base
  validates 

  has_many :shares
  has_many :users, through: :shares

  def self.create_link(post, type)
    if type == "Status"
      create(title: post["name"] ? post["name"] : nil, description: post["message"], link_url: post["link"] ? post["link"] : nil, image_url: post["picture"] ? post["picture"] : nil, type: type)
    end
    create(title: post["name"], description: post["description"], link_url: post["link"], image_url: post["picture"] ? post["picture"] : nil, type: type)
  end


end