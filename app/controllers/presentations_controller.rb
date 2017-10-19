class PresentationsController < ApplicationController
    before_action :admin_power
    before_action :get_presentation, except: [:index, :new, :create]
    
    def index
        @presentations = {}
        Presentation.all.each do |p|
            @presentations[p.language.abbreviation] = [p.content, p.language.name, p.id]
            # @presentations = {'LANG1': [content1, language1, id1], 'LANG2': [content2, language2, id2]}
        end

        respond_to do |format|
            format.html
            format.json {render :json => @presentations}
        end
    end

    def show
        @pres = {content: @presentation.content, lang_id: @presentation.language_id, lang_name: @presentation.language.name}
        render :json => @pres
    end

    def new
        @presentation = Presentation.new
    end

    def edit
        respond_to do |format|
            format.html
            format.json {render :json => @presentation}
        end
    end

    def create
        @presentation = Presentation.new(presentation_params)
        respond_to do |format|
            if @presentation.save
                flash[:success] = @presentation.language.name + ' presentation was successfully created.'
                format.html { redirect_to presentations_url }
                format.json { render :show, status: :created, location: @presentation }
            else
                format.html { render :new }
            end
        end
    end

    def update
        respond_to do |format|
            if @presentation.update(presentation_params)
                flash[:success] = @presentation.language.name + ' presentation was successfully updated.'
                format.html { redirect_to presentations_url }
                format.json { render :show, status: :ok, location: @presentation }
            else
                format.html { render :edit }
            end
        end
    end

    def destroy
        @presentation.destroy
        flash[:danger] = @presentation.language.name + ' presentation was successfully destroyed.'
        respond_to do |format|
          format.html { redirect_to presentations_url }
          format.json { head :no_content }
        end
    end

    private

        def presentation_params
            params.require(:presentation).permit(:content, :language_id)
        end

        def admin_power
            if !logged_in?
                if request.format == :json
                    head :unauthorized
                    return
                end
                session[:prev_url] = request.fullpath
                flash[:danger] = "You need to be logged in for this action."
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

        def get_presentation
            @presentation = Presentation.find(params[:id]) rescue nil
            if @presentation.nil?
                flash[:danger] = "The required presentation doesn't exist."
                redirect_to presentations_path
            end
        end
end