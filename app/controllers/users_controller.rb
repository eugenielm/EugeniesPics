class UsersController < ApplicationController
  before_action :check_authentication, :only => [:show, :edit, :update, :destroy]
  # if bcrypt and has_secure_password are used
  protect_from_forgery

  def index
    if !logged_in?
      session[:prev_url] = request.fullpath
      flash[:info] = 'You need to be logged in for this action.'
      redirect_to login_path
    elsif !is_superadmin?
      flash[:danger] = "Unauthorized action."
      redirect_to root_path
    else
      @users = User.all
    end
  end

  def show
  end

  def new
    @user = User.new
  end

  def edit
  end

  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        flash[:success] = "You're now registered and logged in!"
        log_in @user # log_in method implemented in SessionsHelper which is included in ApplicationController
        format.html { redirect_to @user }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @user.update(user_params)
        flash[:info] = 'User was successfully updated.'
        format.html { redirect_to @user }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @user.destroy
    respond_to do |format|
      flash[:info] = "User was successfully destroyed."
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

    def check_authentication
      @user = User.find(params[:id]) rescue nil

      if @user.nil?
        redirect_to root_path
      elsif !logged_in?
        session[:prev_url] = request.fullpath
        flash[:info] = "You need to be logged in for this action."
        redirect_to login_path
      elsif !is_superadmin? && !(current_user.id == params[:id].to_i)
        flash[:danger] = "Unauthorized action."
        redirect_to root_path
      end
    end
end
