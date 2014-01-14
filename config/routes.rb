CoolIo::Application.routes.draw do
 root 'app#index'

 resources :sessions
 resources :users do
  resources :friendships, shallow: true
  resources :shares, shallow: true
  resources :posts, shallow: true
 end

 mount Resque::Server, :at => "/resque"
end
