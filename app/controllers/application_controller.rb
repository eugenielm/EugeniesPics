class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  # before_action :require_login, :only => [:destroy, :create, :edit, :new, :update]

  def hello
    render html: "hello, world!"
  end
  #
  # private
  #
  #   def require_login
      # this filter method is inherited by all the controllers of the app for
      # all the above-mentionned actions
    #   unless logged_in && session[:user.name] == "adminEG"?
    #     flash[:error] = "You must be logged in as the admin to modify data."
    #     redirect_to new_login_url
    #   end
    # end

end
