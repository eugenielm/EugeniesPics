class PicturesController < ApplicationController
  before_action :require_category, :except => [:destroy, :create, :edit, :new, :update]

  def index
    @pictures = @category.pictures
  end

  def show
    @picture = Picture.find(params[:id])
  end

  def new
    @picture = Picture.new
  end

  def edit
    @picture = Picture.find(params[:id])
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
    @picture = Picture.find(params[:id])

    respond_to do |format|
      if @picture.update(picture_params) # returns false if the params are invalid
        @category = Category.find(@picture.category_id)
        format.html { redirect_to :controller => 'pictures', :action => 'show',
                                  :category_id => @category.id , :id => params[:id],
                                  notice: 'Picture was successfully updated.' }
        format.json { render :show, status: :ok, location: @picture }
      else
        format.html { render :new }
        format.json { render json: @picture.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @picture = Picture.find(params[:id])
    @picture.destroy
    respond_to do |format|
      format.html { redirect_to categories_url, notice: 'Picture was successfully destroyed.' }
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
      @category = Category.find(params[:category_id])
    end

end
