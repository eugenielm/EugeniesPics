Rails.application.routes.draw do
  root 'welcome#index'
  resources :users # only for the admin to signup/log in (no links displqyed in views)
  resources :categories do
    resources :pictures, :except => [:destroy, :create, :edit, :new, :update]
  end

  scope module: 'admin' do
    resources :pictures, :only => [:destroy, :create, :edit, :new, :update]
  end
  get
end
