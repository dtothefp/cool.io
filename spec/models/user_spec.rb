require 'spec_helper'

describe User do
  describe "validations" do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:fb_id) }
    it { should validate_uniqueness_of(:fb_id) }
  end
end