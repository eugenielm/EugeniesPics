class PicDescriptionsController < ApplicationController
    before_action :check_authentication
    before_action :get_category
    before_action :get_picture
    before_action :get_pic_description, except: [:index, :new, :create]
    
    def index
        @pic_descriptions = []
        @picture.pic_descriptions.each do |desc|
            @pic_descriptions.push({:id => desc.id,
                                    :language => desc.language.name,
                                    :language_id => desc.language.id,
                                    :content => desc.content})
        end
        @pic_descriptions.push(@picture.title)
        respond_to do |format|
            format.html {redirect_to edit_category_picture_url(@category, @picture)}
            format.json {render :json => @pic_descriptions}
        end
    end

    def show
        redirect_to edit_category_picture_picdescription_url(@category, @picture, @pic_description)
    end

    def new
        @pic_description = PicDescription.new
    end

    def edit
        respond_to do |format|
            format.html
            format.json {render :json => @pic_description}
        end
    end

    def create
        @pic_description = PicDescription.new(pic_description_params)
        respond_to do |format|
            if @pic_description.save
                flash[:success] = @pic_description.language.name \
                                + ' description of "' + @picture.title + '" was successfully added.'
                
                format.html { redirect_to edit_category_picture_url(@category, @picture) }
                format.json { render :show, status: :ok, location: @pic_description }
            else
                format.html { render :new }
            end
        end
    end

    def update
        respond_to do |format|
            if @pic_description.update(pic_description_params)
                flash[:success] = @pic_description.language.name \
                                + ' description of "' + @picture.title + '" was successfully updated.'
                format.html { redirect_to edit_category_picture_url(@category, @picture) }
                format.json { render :show, status: :ok, location: @pic_description }
            
            else
                format.html { render :edit }
            end
        end
    end

    def destroy
        @pic_description.destroy
        flash[:danger] = @pic_description.language.name \
                       + ' description of "' + @picture.title + '" was destroyed.'
        respond_to do |format|
            format.html { redirect_to edit_category_picture_url(@category, @picture) }
            format.json { head :no_content }
        end
    end

    private

        def pic_description_params
            params.require(:pic_description).permit(:content, :language_id, :picture_id)
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

        def get_category
            @category = Category.find(params[:category_id])
        end

        def get_picture
            @picture = Picture.find(params[:picture_id])
        end

        def get_pic_description
            @pic_description = PicDescription.find(params[:id]) rescue nil
            if @pic_description.nil?
                flash[:danger] = "The required picture description doesn't exist."
                redirect_to edit_category_picture_picdescription_url(@category, @picture, @pic_description)
            end
        end

end