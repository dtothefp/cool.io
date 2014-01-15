require 'spec_helper'

describe Authenticated do
  describe "validations" do
    it { should validate_presence_of(:email) }
    it { should validate_presence_of(:type) }
    it { should validate_presence_of(:oauth_token) }
  end
end