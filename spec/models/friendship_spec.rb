require 'spec_helper'

describe Friendship do
  describe "validations" do
    it { should validate_presence_of(:user_id) }
    it { should validate_presence_of(:friend_id) }
    it { should belong_to(:user) }
    it { should belong_to(:friend).class_name(:User) }
  end
end