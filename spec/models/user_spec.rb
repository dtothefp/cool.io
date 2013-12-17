require 'spec_helper'

describe User do
  subject(:user) { FactoryGirl.build(:user) }
  describe "validations" do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:fb_id) }
    it { should validate_uniqueness_of(:fb_id) }
  end

  describe "#user_exists?" do
    context "the user already exists in the database" do
      before do
        FactoryGirl.create(:user, name: "David", fb_id: "1")
      end
      it "returns true" do
        expect(User.exists? "1").to be_true
      end
    end

    context "the user is not in the database" do
      it "returns false" do
        expect(User.exists? "1").to be_false
      end
    end

  end

  describe "#authenticated?" do
    context "the user has previously been authenticated" do
      before do
        FactoryGirl.create(:authenticated, name: "David", fb_id: "1")
        user.name = "David"
        user.fb_id = "1"
      end
      it "the user authentication was previously persisted" do
        expect(User.authenticated? "1").to be_true
      end
    end
  end

  describe "#token_expired?" do
    context "the user has previously been authenticated" do
      before do
        FactoryGirl.create(:authenticated, name: "David", fb_id: "1", short_term_token: "token")
        user.name = "David"
        user.fb_id = "1"
        user.short_term_token = "newer_token"
      end
      it "the user long term token has expired" do
        expect(User.token_expired? "1","newer_token" ).to be_true
      end
    end
  end
end