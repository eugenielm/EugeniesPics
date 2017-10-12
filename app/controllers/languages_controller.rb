class LanguagesController < ApplicationController
    before_action :admin_power
    before_action :get_language, except: [:index, :new, :create]
    
    def index
        @languages = Language.all
        respond_to do |format|
            format.html
            format.json {render :json => @languages}
        end
    end

    def new
        @language = Language.new
    end

    def edit
        respond_to do |format|
            format.html
            format.json {render :json => @language}
        end
    end

    def create
        @language = Language.new(language_params)
        respond_to do |format|
            if @language.save
                flash[:info] = @language.name + ' language was successfully created.'
                format.html { redirect_to languages_url }
                format.json { render :show, status: :created, location: @language }
            else
                format.html { render :new }
            end
        end
    end

    def update
        respond_to do |format|
            if @language.update(language_params)
                flash[:info] = @language.name + ' language was successfully updated.'
                format.html { redirect_to languages_url }
                format.json { render :show, status: :ok, location: @language }
            else
                format.html { render :edit }
            end
        end
    end

    def destroy
        @language.destroy
        flash[:info] = @language.name + ' language was successfully destroyed.'
        respond_to do |format|
          format.html { redirect_to languages_url }
          format.json { head :no_content }
        end
    end

    private

        def language_params
            params.require(:language).permit(:name, :abbreviation,
                                             presentations_attributes: [:id, :content],
                                             cat_descriptions_attributes: [:id, :content, categories_attributes: [:id, :name, :catpic]],
                                             pic_descriptions_attributes: [:id, :content, pictures_attributes: [:id, :title, :author, :picfile]])
        end

        def admin_power
            if !logged_in?
                if request.format == :json
                    head :unauthorized
                    return
                end
                session[:prev_url] = request.fullpath
                flash[:info] = "You need to be logged in for this action."
                redirect_to login_path
            elsif !is_superadmin?
                if request.format == :json
                    head :unauthorized
                    return
                end
                flash[:danger] = "Unauthorized action."
                redirect_to root_path
            end
        end

        def get_language
            @language = Language.find(params[:id]) rescue nil
            if @language.nil?
                flash[:danger] = "The required language doesn't exist."
                redirect_to languages_path
            end
        end
end