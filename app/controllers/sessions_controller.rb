class SessionsController < ApplicationController

  def new
  end

  def create
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      # SessionsHelper is included in application_controller
      log_in user
      flash[:success] = "You've been logged in."
      !session[:prev_url].nil? && session[:prev_url] != "/settings.json" ? redirect_path = session[:prev_url] : redirect_path = root_path
      session.delete(:prev_url) unless session[:prev_url].nil?
      redirect_to redirect_path
    else
      flash[:danger] = 'Invalid email/password combination'
      render 'new'
    end
  end

  def destroy
    log_out
    flash[:success] = "You've been logged out."
    redirect_back(fallback_location: root_path)
  end

end
