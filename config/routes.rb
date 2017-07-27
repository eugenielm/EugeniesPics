Rails.application.routes.draw do
  ActiveAdmin.routes(self)

  resources :users

  namespace :admin do
    resources :categories do
      resources :pictures
    end
  end

  resources :categories do
    resources :pictures, :only => [:index, :show]
  end

  root to: 'welcome#index'
end
