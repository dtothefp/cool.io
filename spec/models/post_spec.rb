require 'spec_helper'

describe Post do
  # subject(:user) { FactoryGirl.build(:user) }
  describe "validations" do
    it { should have_many(:shares) }
    it { should have_many(:users).through(:shares) }
  end

  describe "::create_link" do
    context "it is a post from facebook API that is not a status type" do
      it "is persisted" do
        api_post = {"name" => "Post Title", "description" => "Post Description", "link" => "Link Url", "picture" => "Image Url" }
        expect(Post.create_link(api_post, "Link").persisted?).to be_true
      end
    end

    context "it is a post from facebook API that is of the type status" do
      it "is persisted" do
        api_status = {"name" => "Post Title", "message" => "Message", "link" => "Link Url", "picture" => "Image Url"} 
        expect(Post.create_link(api_status, "Status").persisted?).to be_true
      end
    end
    
  end

end