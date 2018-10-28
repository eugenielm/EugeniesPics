class CategoriesController < ApplicationController
  before_action :get_category, except: [:index, :new, :create]
  before_action :check_authentication, :except => [:index, :show]

  def index
    if Category.all.nil?
      @categories = nil
      redirect_to root_url
    end

    @fb_url = categories_url

    @categories = Array.new
    @sorted_categories = Category.all.sort { |a,b| a.name <=> b.name }
    @sorted_categories.each do |c|
      @categories.push({id: c.id,
                        name: c.name,
                        catpic_url_small: c.catpic.url(:small),
                        catpic_url_medium: c.catpic.url(:medium),
                        catpic_url_large: File.exist?(c.catpic.url(:large)) ? c.catpic.url(:large) : c.catpic.url(:medium),})
    end
    respond_to do |format|
      format.html
      format.json {render :json => @categories}
    end
  end

  def show
    @cat_with_descriptions = []
    @category.cat_descriptions.each do |d|
      @cat_with_descriptions.push({:description_id => d.id,
                                   :language_name => d.language.name,
                                   :language_abbr => d.language.abbreviation,
                                   :language_id => d.language.id,
                                   :content => d.content})
    end
    @cat_with_descriptions.push({ category_name: @category.name,
                                  catpic_url: @category.catpic.url(:small),
                                  catpic_name: @category.catpic_file_name })

    respond_to do |format|
      format.html { redirect_to category_pictures_url(@category) }
      format.json { render :json => @cat_with_descriptions }
    end
  end

  def new
    @category = Category.new
  end

  def edit
    respond_to do |format|
      format.html
      format.json {render :json => @category}
    end
  end

  def create
    @category = Category.new(category_params)
    respond_to do |format|
      if @category.save
        flash[:success] = '"' + @category.name + '" category was successfully created.'
        format.html { redirect_to edit_category_url(@category) }
        format.json { render :show, status: :created, location: @category }
      else
        format.html { render :new }
      end
    end
  end

  def update
    respond_to do |format|
      if @category.update(category_params)
        flash[:success] = '"' + @category.name + '" category was successfully updated.'
        format.html { redirect_to category_url(@category) }
        format.json { render :show, status: :ok, location: @category }
      else
        format.html { render :edit }
      end
    end
  end

  def destroy
    @category.destroy
    flash[:danger] = '"' + @category.name + '" category was destroyed.'
    respond_to do |format|
      format.html { redirect_to categories_url }
      format.json { head :no_content }
    end
  end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def category_params
      params.require(:category).permit(:name, :catpic,
                                       pictures_attributes: [:title, :author, :description, :picfile])
    end

    def get_category
      @category = Category.find(params[:id]) rescue nil
      if @category.nil?
        flash[:danger] = "The required category doesn't exist."
        redirect_to categories_path
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
