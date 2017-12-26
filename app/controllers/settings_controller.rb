class SettingsController < ApplicationController
    before_action :check_authentication, :except => :index
    before_action :get_setting

  def index
    if @setting.nil?
      @settings = { background_url: nil,
                    background_color: "#eeeeee",
                    maintitle: "WEBSITE TITLE",
                    subtitle: "- Website subtitle -",
                    navbarcolor: "#000000",
                    navbarfont: "#ffffff" }
      respond_to do |format|
        format.html { redirect_to new_setting_url }
        format.json { render :json => @settings }
      end
    else
      @settings = { id: @setting.id,
                    background_url: @setting.background_file_name ? @setting.background.url : nil,
                    background_name: @setting.background_file_name ? @setting.background_file_name : nil,
                    background_color: @setting.background_color,
                    maintitle: @setting.maintitle,
                    subtitle: @setting.subtitle,
                    navbarcolor: @setting.navbarcolor,
                    navbarfont: @setting.navbarfont }
      respond_to do |format|
        format.html { redirect_to edit_setting_url(@setting) }
        format.json { render :json => @settings }
      end
    end
  end

  def show
    redirect_to settings_url
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
    @setting = Setting.new(setting_params)
    respond_to do |format|
      if @setting.save
        flash[:success] = 'Your settings were successfully submitted.'
        format.html { redirect_to edit_setting_url(@setting) }
        format.json { render :show, status: :created, location: @setting }
      else
        format.html { render :new }
      end
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
        if params[:setting][:background] == nil
          @setting.background = nil
          @setting.save
        end
        flash[:success] = 'Your settings were successfully updated.'
        format.html { redirect_to setting_url(@setting) }
        format.json { render :show, status: :ok, location: @setting }
      else
        format.html { render :edit }
      end
    end
  end

  private
    def setting_params
        params.require(:setting).permit(:maintitle, :subtitle, :navbarcolor, :navbarfont, :background, :background_color)
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