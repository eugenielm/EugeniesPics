class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  include SessionsHelper

  # def authenticate_active_admin_user!
  #   current_user
  #   unless current_user.superadmin
  #     flash[:alert] = "Unauthorized Access!"
  #     redirect_to root_path
  #   end
  # end

end
