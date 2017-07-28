module SessionsHelper
  # Logs in the given user. https://www.railstutorial.org/book/basic_login#code-log_in_function
  def log_in(user)
    # temporary cookie created by the session method that expires when the browser is closed
    session[:user_id] = user.id
  end

  def current_user
    # instead of User.find(session[:user_id]) which would raise an exception if
    # the user id doesn't exist
    @current_user ||= User.find_by(id: session[:user_id])
  end

  def logged_in?
    !current_user.nil?
  end

  def is_superadmin?
    !current_user.nil? && current_user.superadmin
  end

  def log_out
    session.delete(:user_id)
    @current_user = nil
  end

end
