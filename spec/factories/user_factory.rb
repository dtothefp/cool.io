FactoryGirl.define do
  factory :user do
    name { Faker::Name.name }
    fb_id { rand(100000..200000) }

    factory :authenticated, :class => Authenticated do
      email { Faker::Internet.email }
      oauth_expires_at { rand(1000000..2000000) }
      oauth_token { "1387155750" }
    end

  end
end