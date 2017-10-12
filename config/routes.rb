Rails.application.routes.draw do

  root to: 'welcome#index'
  get '/index', to: 'welcome#index'
  get '/about', to: 'welcome#about'

  get '/login', to: 'sessions#new'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  resources :users
  get '/signup', to: 'users#new'

  resources :languages
  
  resources :presentations

  resources :categories do
    resources :cat_descriptions
    resources :pictures do
      resources :pic_descriptions
    end
  end

end
