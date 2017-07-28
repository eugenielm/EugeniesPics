class SessionsController < ApplicationController

  def new
  end

  def create
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      # SessionsHelper is included in application_controller
      log_in user
      !session[:prev_url].nil? ? prev_url = session[:prev_url] : prev_url = root_path
      session.delete(:prev_url) unless session[:prev_url].nil?
      redirect_to prev_url, notice: 'You were successfully logged in'
    else
      flash.now[:danger] = 'Invalid email/password combination'
      render 'new'
    end
  end

  def destroy
    log_out
    redirect_back(fallback_location: root_path)
  end

end
