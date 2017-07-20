Rails.application.routes.draw do
  resources :users # only for the admin to signup/log in (no links displqyed in views)
  resources :categories do
    resources :pictures, :except => [:destroy, :create, :edit, :new, :update]
  end
  resources :pictures, :only => [:destroy, :create, :edit, :new, :update]
  root 'welcome#index'
end
