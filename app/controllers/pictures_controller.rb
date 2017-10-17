class PicturesController < ApplicationController
  before_action :require_category
  before_action :require_picture, :except => [:index, :new, :create]
  before_action :admin_power, :except => [:index, :show]

  def index
    @pictures = Array.new
    @category.pictures.all.each do |pic|
      all_descriptions = {}
      pic.pic_descriptions.each do |d|
        all_descriptions[d.language.abbreviation] = d.content
      end  
      @pictures.push({
        id: pic.id,
        title: pic.title,
        author: pic.author,
        descriptions: all_descriptions,
        category_name: pic.category.name,
        pic_url_small: pic.picfile.url(:small),
        pic_url_medium: pic.picfile.url(:medium),
      })
    end
    @pictures.push(@category.name)
    @pictures.push(@categories)
    respond_to do |format|
      format.html
      format.json {render :json => @pictures}
    end
    
  end

  def show
    @pic_with_descriptions = []
    @picture.pic_descriptions.each do |d|
      @pic_with_descriptions.push({:description_id => d.id,
                                   :language_name => d.language.name,
                                   :language_abbr => d.language.abbreviation,
                                   :language_id => d.language.id,
                                   :content => d.content})
    end
    @pic_with_descriptions.push({ picture_title: @picture.title,
                                  picfile_url: @picture.picfile.url(:small),
                                  picfile_name: @picture.picfile_file_name })

    respond_to do |format|
      format.html { redirect_to category_pictures_url(@category) }
      format.json { render :json => @pic_with_descriptions }
    end
  end

  def new
    @picture = Picture.new
  end

  def edit
  end

  def create
    @picture = Picture.new(picture_params)

    respond_to do |format|
      if @picture.save
        flash[:success] = 'Picture was successfully created.'
        format.html { redirect_to edit_category_picture_url(@category, @picture) }
        format.json { render :index, status: :created }
      else
        format.html { render :new }
      end
    end
  end

  def update
    respond_to do |format|
      if @picture.update(picture_params)
        flash[:success] = 'Picture was successfully updated.'
        format.html { redirect_to :controller => 'pictures', :action => 'index',
                                  :category_id => @picture.category.id }
        format.json { render :index, status: :ok }
      else
        format.html { render :edit }
      end
    end
  end

  def destroy
    @picture.destroy
    respond_to do |format|
      flash[:danger] = 'Picture was destroyed.'
      format.html { redirect_to :controller => 'pictures', :action => 'index',
                                :category_id => @category.id }
      format.json { head :no_content }
    end
  end

  private
    # whitelist our controller parameters to prevent wrongful mass assignment
    # see strong parameters: http://weblog.rubyonrails.org/2012/3/21/strong-parameters/
    def picture_params
      # :category_id needs to be allowed to get the association with the category model
      params.require(:picture).permit(:title, :author, :category_id, :picfile)
    end

    def require_category
      @categories = Category.all rescue nil
      @category = Category.find(params[:category_id]) rescue nil
      if @category.nil?
        flash[:danger] = "The required category doesn't exist."
        redirect_to categories_path
      end
    end

    def require_picture
      @picture = Picture.find(params[:id]) rescue nil
      if @picture.nil?
        flash[:danger] = "The required picture doesn't exist."
        redirect_to category_pictures_path(@category)
      end
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

end
