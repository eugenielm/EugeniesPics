Rails.application.routes.draw do

  root to: 'welcome#index'
  get '/about', to: 'welcome#about'

  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  resources :categories do
    resources :pictures
  end

  # a user can't see all the other users
  get '/users', to: 'welcome#index'
  resources :users, :except => [:index]
  get '/signup', to: 'users#new'

end
