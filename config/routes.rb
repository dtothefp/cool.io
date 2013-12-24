CoolIo::Application.routes.draw do
 root 'app#index'

 resource :sessions
 resources :users do
  resources :friendships
  resources :posts
  resources :statuses
  resources :photos
 end
end
