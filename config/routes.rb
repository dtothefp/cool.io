CoolIo::Application.routes.draw do
 root 'app#index'

 resources :sessions
 resources :users do
  resources :friendships
 end
end
