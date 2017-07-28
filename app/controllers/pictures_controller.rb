class PicturesController < ApplicationController
  before_action :require_category
  before_action :require_picture, :except => [:index, :new, :create]
  before_action :admin_power, :except => [:index, :show]

  def index
    @pictures = @category.pictures
  end

  def show
  end

  def new
    @picture = Picture.new
  end

  def edit
  end

  def create
    @picture = Picture.new(picture_params)

    respond_to do |format|
      if @picture.save # returns false if the params are invalid
        format.html { redirect_to categories_url, notice: 'Picture was successfully created.' }
        format.json { render :show, status: :created, location: @picture }
      else
        format.html { render :new }
        format.json { render json: @picture.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @picture.update(picture_params) # returns false if the params are invalid
        format.html { redirect_to :controller => 'pictures', :action => 'show',
                                  :category_id => @picture.category.id , :id => @picture.id,
                                  notice: 'Picture was successfully updated.' }
        format.json { render :show, status: :ok, location: @picture }
      else
        format.html { render :edit }
        format.json { render json: @picture.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @picture.destroy
    respond_to do |format|
      format.html { redirect_to :controller => 'pictures', :action => 'index',
                                :category_id => @category.id,
                                notice: 'Picture was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # whitelist our controller parameters to prevent wrongful mass assignment
    # see strong parameters: http://weblog.rubyonrails.org/2012/3/21/strong-parameters/
    def picture_params
      # :category_id needs to be allowed to get the association with the category model
      params.require(:picture).permit(:title, :author, :description, :category_id)
    end

    def require_category
      @category = Category.find(params[:category_id]) rescue @category = nil
      if @category.nil?
        flash[:danger] = "The required category doesn't exist"
        redirect_to categories_path
      end
    end

    def require_picture
      @picture = Picture.find(params[:id]) rescue @picture = nil
      if @picture.nil?
        flash[:danger] = "The required picture doesn't exist"
        redirect_to category_pictures_path(@category)
      end
    end

    def admin_power
      if !is_superadmin?
        session[:prev_url] = request.fullpath
        flash[:danger] = "You need to be logged in as an admin for this action"
        redirect_to login_path
      end
    end
end
