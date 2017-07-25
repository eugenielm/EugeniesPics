Rails.application.routes.draw do
  ActiveAdmin.routes(self) # users resources and pictures/categories 'CUD' methods

  namespace :admin do
    resources :users
    resources :categories do
      resources :pictures
    end
  end

  resources :categories do
    resources :pictures, :only => [:index, :show]
  end

  root 'welcome#index'
end
