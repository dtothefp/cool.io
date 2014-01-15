require 'spec_helper'

describe Share do
  describe "validations" do
    it { should validate_presence_of(:user_id) }
    it { should validate_presence_of(:post_id) }
    it { should validate_presence_of(:author) }
    it { should validate_presence_of(:liker) }
    it { should validate_presence_of(:commenter) }
    it { should belong_to(:user) }
    it { should belong_to(:post) }
  end
end