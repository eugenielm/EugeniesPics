Rails.application.routes.draw do

  root to: 'welcome#index'

  ActiveAdmin.routes(self)

  resources :users
  get '/users', to: 'welcome#index'
  get '/signup', to: 'users#new'

  namespace :admin do
    resources :categories do
      resources :pictures
    end
  end

  resources :categories do
    resources :pictures, :only => [:index, :show]
  end

end
