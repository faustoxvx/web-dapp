FactoryBot.define do
  factory :admin_user, class: "User" do
    username { "Admin" }
    email { "admin@talentprotocol.com" }
    password { "password" }
    role { "admin" }
  end

  factory :user do
    username { "User" }
    email { "user@talentprotocol.com" }
    password { "password" }

    trait :external_log_in do
      external_id { "123" }
      password { nil }
      email { nil }
    end
  end

  factory :alert_configuration do
    page { "/talent" }
    alert_type { "primary" }
    text { "Connect your wallet to buy Career Coins" }
    href { "https://metamask.io/" }
    button_text { "MetaMask" }
    css_class { "w-100" }
  end
end
