class CategoriesController < ApplicationController
  before_action :get_category, except: [:index, :new, :create]
  before_action :admin_power, :except => [:index, :show]

  def index
    if Category.all.nil?
      @categories = nil
      redirect_to root_url
    end
    # @categories is used in CategoriesIndex.jsx
    @categories = Array.new
    Category.all.each do |c|
      @categories.push({id: c.id,
                        name: c.name,
                        catpic_url: c.catpic.url,})
    end
  end

  def show
    redirect_to category_pictures_url(@category)
  end

  def new
    @category = Category.new
  end

  def edit
  end

  def create
    @category = Category.new(category_params)

    respond_to do |format|
      if @category.save
        flash[:info] = "Category was successfully created."
        format.html { redirect_to @category }
        format.json { render :show, status: :created, location: @category }
      else
        format.html { render :new }
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @category.update(category_params)
        flash[:info] = '"' + @category.name + '" category was successfully updated.'
        format.html { redirect_to categories_url }
        format.json { render :show, status: :ok, location: @category }
      else
        format.html { render :edit }
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @category.destroy
    flash[:info] = '"' + @category.name + '" category was successfully destroyed.'
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

    def admin_power
      if !logged_in?
        session[:prev_url] = request.fullpath
        flash[:info] = "You need to be logged in for this action."
        redirect_to login_path
      elsif !is_superadmin?
        flash[:danger] = "Unauthorized action."
        redirect_to root_path
      end
    end
end
