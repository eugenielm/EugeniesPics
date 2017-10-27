class UsersController < ApplicationController
  before_action :check_authentication, :except => [:index, :new, :create]
  before_action :get_user, :only => [:show, :edit, :update, :destroy]
  # because bcrypt and has_secure_password are used
  protect_from_forgery

  def index
    if request.format == :json
      if !logged_in? || !is_superadmin?
        head :unauthorized
        return
      end
    else
      if !logged_in?
        session[:prev_url] = request.fullpath
        flash[:danger] = 'You need to be logged in for this action.'
        redirect_to login_path
      elsif !is_superadmin?
        flash[:danger] = "Unauthorized action."
        redirect_to root_path
      end
    end

    respond_to do |format|
      format.html
      format.json { render json: User.all }
    end
    
  end

  def show
  end

  def new
    @user = User.new
    # @first_user is used to set superadmin to 'true' only if it's the first user to register
    @first_user = User.all.length == 0
    respond_to do |format|
      format.html
      format.json { render json: @first_user }
    end
  end

  def edit
  end

  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        flash[:success] = "You're now registered and logged in!"
        log_in @user # log_in method implemented in SessionsHelper which is imported in ApplicationController
        format.html { redirect_to @user }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new }
        # format.json { render json: @user.errors, status: :unprocessable_entity }
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
        # format.json { render json: @user.errors, status: :unprocessable_entity }
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

    def get_user
      @user = User.find(params[:id]) rescue nil
      if @user.nil?
        redirect_to root_path
      end
    end

    def check_authentication
      if request.format == :json
        if !logged_in? || !(is_superadmin? || current_user.id == params[:id].to_i)
          head :unauthorized
          return
        end
      else
        if !logged_in?
          session[:prev_url] = request.fullpath
          flash[:danger] = "You need to be logged in for this action."
          redirect_to login_path
        elsif !(is_superadmin? || current_user.id == params[:id].to_i)
          flash[:danger] = "Unauthorized action."
          redirect_to root_path
        end
      end
    end
end
