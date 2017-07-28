Rails.application.routes.draw do

  root to: 'welcome#index'
  get '/about', to: 'welcome#about'

  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  # a user can't see all the other users
  get '/users', to: 'welcome#index'

  resources :users
  get '/signup', to: 'users#new'

  # access to admin dashboard -when logged in as admin- to CUD categories and pictures
  ActiveAdmin.routes(self)
  namespace :admin do
    resources :categories do
      resources :pictures
    end
  end

  # when visiting the website
  resources :categories do
    resources :pictures, :only => [:index, :show]
  end

end
