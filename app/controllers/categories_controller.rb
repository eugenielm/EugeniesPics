class CategoriesController < ApplicationController
  before_action :get_category, except: [:index, :new, :create]
  before_action :admin_power, :except => [:index, :show]

  # GET /categories
  # GET /categories.json
  def index
    if Category.all.nil?
      @categories = nil
      redirect_to root_url
    else
      @categories = Category.all
    end
  end

  # GET /categories/1 redirected to get /categories/1/pictures/ in routes.rb
  # GET /categories/1.json
  def show
    redirect_to category_pictures_url(@category)
  end

  # GET /categories/new
  def new
    @category = Category.new
  end

  # GET /categories/1/edit
  def edit
  end

  # POST /categories
  # POST /categories.json
  def create
    @category = Category.new(category_params)

    respond_to do |format|
      if @category.save
        format.html { redirect_to @category, notice: 'Category was successfully created.' }
        format.json { render :show, status: :created, location: @category }
      else
        format.html { render :new }
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /categories/1
  # PATCH/PUT /categories/1.json
  def update
    respond_to do |format|
      if @category.update(category_params)
        format.html { redirect_to categories_url,
                      notice: '"' + @category.name + '" category was successfully updated.' }
        format.json { render :show, status: :ok, location: @category }
      else
        format.html { render :edit }
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /categories/1
  # DELETE /categories/1.json
  def destroy
    @category.destroy
    respond_to do |format|
      format.html { redirect_to categories_url, notice: '"' + @category.name + '" category was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    # Never trust parameters from the scary internet, only allow the white list through.
    def category_params
      params.require(:category).permit(:name, pictures_attributes: [
                                              :title, :author, :description
                                              ])
    end

    def get_category
      @category = Category.find(params[:id]) rescue @category = nil
      if @category.nil?
        redirect_to categories_path
      end
    end

    def admin_power
      if !is_superadmin?
        session[:prev_url] = request.fullpath
        redirect_to login_path
      end
    end
end
