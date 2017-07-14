Rails.application.routes.draw do
  resources :categories do
    resources :pictures, :except => [:destroy, :create, :edit, :new, :update]
  end
  resources :pictures, :only => [:destroy, :create, :edit, :new, :update]
  root 'welcome#index'
end
