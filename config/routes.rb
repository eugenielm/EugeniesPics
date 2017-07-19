Rails.application.routes.draw do

  root 'welcome#index'

  resources :categories do
    resources :pictures, :except => [:destroy, :create, :edit, :new, :update]
  end

  scope module: 'admin' do
    resources :pictures, :only => [:destroy, :create, :edit, :new, :update]
  end

end
