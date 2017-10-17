class CatDescriptionsController < ApplicationController
    before_action :admin_power
    before_action :get_category
    before_action :get_cat_description, except: [:index, :new, :create]
    before_action :get_back_link, only: [:new, :edit, :destroy]
    
    def index
        @cat_descriptions = []
        @category.cat_descriptions.each do |desc|
            @cat_descriptions.push({:id => desc.id,
                                    :language => desc.language.name,
                                    :language_id => desc.language.id,
                                    :content => desc.content})
        end
        @cat_descriptions.push(@category.name)
        respond_to do |format|
            format.html
            format.json {render :json => @cat_descriptions}
        end
    end

    def new
        @cat_description = CatDescription.new
    end

    def edit
        respond_to do |format|
            format.html
            format.json {render :json => @cat_description}
        end
    end

    def create
        @cat_description = CatDescription.new(cat_description_params)
        respond_to do |format|
            if @cat_description.save
                flash[:success] = @cat_description.language.name + ' description of ' + @category.name + ' was successfully added.'
                if session[:redirect_to_cat_edit].nil?
                    format.html { redirect_to controller: "categories", action: "show", id: @category.id }
                else
                    redirect_link = session[:redirect_to_cat_edit]
                    session.delete(:redirect_to_cat_edit)
                    format.html { redirect_to redirect_link}
                end
                format.json { render :show, status: :ok, location: @cat_description }
            else
                format.html { render :new }
            end
        end
    end

    def update
        respond_to do |format|
            if @cat_description.update(cat_description_params)
                flash[:success] = @cat_description.language.name + ' description of ' + @category.name + ' was successfully updated.'
                if session[:redirect_to_cat_edit].nil?
                    format.html { redirect_to controller: "categories", action: "show", id: @category.id }
                else
                    redirect_link = session[:redirect_to_cat_edit]
                    session.delete(:redirect_to_cat_edit)
                    format.html { redirect_to redirect_link}
                end
                format.json { render :show, status: :ok, location: @cat_description }
            else
                format.html { render :edit }
            end
        end
    end

    def destroy
        @cat_description.destroy
        flash[:danger] = @cat_description.language.name + ' description of ' + @category.name + ' category was destroyed.'
        respond_to do |format|
            if session[:redirect_to_cat_edit].nil?
                format.html { redirect_to controller: "categories", action: "edit", id: @category.id }
            else
                redirect_link = session[:redirect_to_cat_edit]
                session.delete(:redirect_to_cat_edit)
                format.html { redirect_to redirect_link }
            end
            format.json { head :no_content }
        end
    end

    private

        def cat_description_params
            params.require(:cat_description).permit(:content, :language_id, :category_id)
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

        def get_category
            @category = Category.find(params[:category_id])
        end

        def get_cat_description
            @cat_description = CatDescription.find(params[:id]) rescue nil
            if @cat_description.nil?
                flash[:danger] = "The required category description doesn't exist."
                redirect_to action: "index"
            end
        end

        def get_back_link
            if params[:redirect_to_cat_edit]
                session[:redirect_to_cat_edit] = params[:redirect_to_cat_edit]
            end
        end
end