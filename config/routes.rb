Rails.application.routes.draw do

  root to: 'welcome#index'
  get '/index', to: 'welcome#index'
  get '/about', to: 'messages#new', as: 'new_message'
  post '/about', to: 'messages#create', as: 'create_message'

  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  resources :users
  get '/signup', to: 'users#new'

  resources :settings
  resources :languages
  resources :presentations

  resources :categories do
    resources :cat_descriptions, as: 'catdescriptions'
    resources :pictures do
      resources :pic_descriptions, as: 'picdescriptions'
    end
  end

end
