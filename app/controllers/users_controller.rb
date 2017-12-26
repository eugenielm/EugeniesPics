class UsersController < ApplicationController
  before_action :check_authentication, :except => [:new, :create]
  before_action :get_user, :only => [:show, :edit, :update, :destroy]
  # because bcrypt and has_secure_password are used
  protect_from_forgery

  def index
    if !logged_in?
      session[:prev_url] = request.fullpath
      flash[:danger] = "You need to be logged to access the required page."
      redirect_to login_path
    elsif logged_in? && !is_superadmin?
      flash[:info] = "You were redirected because you don't have the required permissions for the requested page."
      redirect_to user_url(@current_user)
    else
      respond_to do |format|
        format.html
        format.json { render json: User.all }
      end
    end
  end

  def show
  end

  def new
    # prevent from creating a 3rd user (1st user is admin, and 2nd one is the demo user with no admin permissions)
    if User.all.length > 1
      flash[:danger] = "Sorry, you can't create a new user."
      redirect_to root_path
    end
    @user = User.new
  end

  def edit
  end

  def create
    if User.all.length > 1
      flash[:danger] = "Sorry, you can't create a new user."
      redirect_to root_path
    
    else
      @user = User.new(user_params)
      if User.all.length == 0
        @user[:superadmin] = true
      else
        @user[:superadmin] = false
      end

      respond_to do |format|
        if @user.save
          flash[:success] = "You're now registered and logged in!"
          log_in @user # log_in method implemented in SessionsHelper which is imported in ApplicationController
          format.html { redirect_to @user }
          format.json { render :show, status: :created, location: @user }
        else
          format.html { render :new }
        end
      end
    end
  end

  def update
    respond_to do |format|
      if params["user"]["password"]
        if @user.update(user_params)
          flash[:info] = 'User was successfully updated.'
          format.html { redirect_to @user }
          format.json { render :show, status: :ok, location: @user }
        else
          format.html { render :edit }
        end
      else
        if @user.update(edit_user_params)
          flash[:info] = 'User was successfully updated.'
          format.html { redirect_to @user }
          format.json { render :show, status: :ok, location: @user }
        else
          format.html { render :edit }
        end
      end
    end
  end

  def destroy
    @user.destroy
    respond_to do |format|
      flash[:danger] = "User was destroyed."
      if is_superadmin?
        format.html { redirect_to users_path }
      else
        format.html { redirect_to root_path }
      end
      format.json { head :no_content }
    end
  end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(:username, :email, :password, :password_confirmation, :superadmin)
    end

    # if the user doesn't want to update their password, remove password and password_confirmation from strong params
    def edit_user_params
      params.require(:user).permit(:username, :email, :superadmin)
    end

    def get_user
      @user = User.find(params[:id]) rescue nil
      if @user.nil?
        redirect_to root_path
      end
      if !is_superadmin? && current_user.id != @user.id
        flash[:danger] = "You were redirected because you don't have the required permissions."
        redirect_to user_url(@current_user)
      end
    end

    def check_authentication
      if !logged_in?
        if request.format == :json
          head :unauthorized
          return
        end
        session[:prev_url] = request.fullpath
        flash[:danger] = "You need to be logged in for this action."
        redirect_to login_path
      end
    end
end
