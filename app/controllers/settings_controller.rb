class SettingsController < ApplicationController
  before_action :check_authentication, :except => :index
  before_action :get_setting

  def index
    if @setting.nil?
      @settings = { background_url: nil,
                    id_picture_url: nil,
                    background_color: "#eeeeee",
                    maintitle: "WEBSITE TITLE",
                    subtitle: "- Website subtitle -",
                    navbarcolor: "#000000",
                    navbarfont: "#ffffff" }

      if logged_in?
        respond_to do |format|
          format.html { redirect_to new_setting_url }
          format.json { render :json => @settings }
        end
      else
        respond_to do |format|
          format.html { redirect_to login_path }
          format.json { render :json => @settings }
        end
      end
    
    else
      @settings = { id: @setting.id,
                    # at first there was no 'small' style but only 'medium'
                    background_url_small: @setting.background_file_name ? (File.exist?(@setting.background.url(:small)) ? @setting.background.url(:small) : @setting.background.url(:medium)) : nil,
                    background_url_medium: @setting.background_file_name ? @setting.background.url(:medium) : nil,
                    background_name: @setting.background_file_name ? @setting.background_file_name : nil,
                    background_color: @setting.background_color,
                    maintitle: @setting.maintitle,
                    subtitle: @setting.subtitle,
                    navbarcolor: @setting.navbarcolor,
                    navbarfont: @setting.navbarfont,
                    id_picture_url_small: @setting.id_picture_file_name ? @setting.id_picture.url(:small) : nil,
                    # at first there was no 'medium' style but only 'small'
                    id_picture_url_medium: @setting.id_picture_file_name ? (File.exist?(@setting.id_picture.url(:medium)) ? @setting.id_picture.url(:medium) : @setting.id_picture.url(:small)) : nil,
                    id_picture_name: @setting.id_picture_file_name ? @setting.id_picture_file_name : nil,
                  }

      if logged_in?
        respond_to do |format|
          format.html { redirect_to edit_setting_url(@setting) }
          format.json { render :json => @settings }
        end
      else
        respond_to do |format|
          format.html { redirect_to login_path }
          format.json { render :json => @settings }
        end
      end
    end
  end

  def show
    if @setting.nil?
      redirect_to new_setting_url
    else
      redirect_to edit_setting_url(@setting)
    end
  end

  def new
    if @setting.nil?
      @setting = Setting.new
    else
      # there can be only one Setting instance
      redirect_to edit_setting_url(@setting)
    end
  end

  def create
    if @setting.nil?
      @setting = Setting.new(setting_params)
      respond_to do |format|
        if @setting.save
          flash[:success] = 'Your settings were successfully submitted.'
          format.html { redirect_to edit_setting_url(@setting) }
          format.json { render :show, status: :created, location: @setting }
        else
          format.html { render :new }
          format.json { render :show, status: :unprocessable_entity }
        end
      end
    else
      # there can be only one Setting instance
      redirect_to edit_setting_url(@setting)
    end
  end

  def edit
    respond_to do |format|
      format.html
      format.json {render :json => @setting}
    end
  end

  def update
    respond_to do |format|
      if @setting.update(setting_params)
        if params[:setting][:background] == nil && params[:deleteBackgroundPic]
          @setting.background = nil
          @setting.save
        end
        if params[:setting][:id_picture] == nil && params[:deleteIdPic]
          @setting.id_picture = nil
          @setting.save
        end
        flash[:success] = 'Your settings were successfully updated.'
        format.html { redirect_to edit_setting_url(@setting) }
        format.json { render :show, status: :ok, location: @setting }
      else
        format.html { render :edit }
        format.json { render :show, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    if is_superadmin?
      @setting.destroy
      respond_to do |format|
        flash[:danger] = "Your settings were destroyed."
        if logged_in?
          format.html { redirect_to new_setting_url }
        else
          format.html { redirect_to root_path }
        end
        format.json { head :no_content }
      end
    else
      session[:prev_url] = request.fullpath
      flash[:danger] = "You don't have the required permissions for this action."
      redirect_to root_path
    end
  end

  private
    def setting_params
      params.require(:setting).permit(
        :maintitle, :subtitle, :navbarcolor, :navbarfont, :background, :background_color, :id_picture)
    end

    def get_setting
      @setting = Setting.first rescue nil
    end

    def check_authentication
      if !logged_in?
        session[:prev_url] = request.fullpath
        flash[:danger] = "You need to be logged in for this action."
        redirect_to login_path
      end
    end

end