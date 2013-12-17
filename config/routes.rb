CoolIo::Application.routes.draw do
 root 'app#index'

 resources :sessions
 resources :users do
  collection do
    post 'friends'
  end
 end
end
