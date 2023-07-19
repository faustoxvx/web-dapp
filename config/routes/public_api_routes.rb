module PublicAPIRoutes
  def self.extended(router)
    router.instance_exec do
      namespace :api, defaults: {format: :json} do
        namespace :v1 do
          # API authenticated endpoints
          scope module: :public_api, as: "public" do
            resources :talents, only: [:show, :index] do
              get "recommended", on: :collection
            end
            resources :supporters, only: [:index]
            resources :activities, only: [:index]
            resources :connections, only: [:index]
            resources :career_updates, only: [:index, :create, :destroy, :update]
            resources :sponsorships, only: [:create]
            get "sponsorships", to: "sponsorships#index"
            get "sponsors", to: "sponsorships#sponsors"
            resources :sessions, only: [] do
              get :logged_in_user, on: :collection
            end
            resources :subscriptions, only: [:create] do
              put "accept", on: :collection
            end
            delete "subscriptions", to: "subscriptions#destroy"
            get "subscribers", to: "subscriptions#subscribers"
            get "pending_subscribers", to: "subscriptions#pending_subscribers"
            get "subscribing", to: "subscriptions#subscribing"
            resources :product_announcements, only: [:update] do
              get "latest_unread", on: :collection
            end
            resources :leaderboards, only: [:index]
            resources :quests, only: [:index], param: :type do
              put "complete"
            end
            resources :invited_talents, only: [:index]
            resources :experience_points_leaderboards, only: [:index]

            resource :validations, only: [] do
              get :username, on: :collection
              get :email, on: :collection
            end
          end

          # API non authenticated endpoints
          resources :portfolio_supporters, only: [:index]
          resources :talent, only: [:show, :index]
          get "/public_talent" => "talent#public_index"

          resources :users, only: [:show] do
            get :domain_owner, on: :collection

            namespace :profile do
              resources :community, only: [:index]
              resources :perks, only: [:index]

              scope :web3 do
                get :tokens, to: "web3#tokens"
                get :nfts, to: "web3#nfts"
                get :poaps, to: "web3#poaps"
              end
            end
          end
        end
      end
    end
  end
end
