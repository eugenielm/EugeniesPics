class PicturesController < ApplicationController
  before_action :require_category
  before_action :require_picture, :except => [:index, :new, :create]
  before_action :check_authentication, :except => [:index, :show]

  def index
    @fb_url = category_url(@category) + '/pictures'
    @fb_title = @category.name
    @fb_description = "A gallery of photographs by Eugénie Le Moulec"
    @fb_image = @category.catpic.url(:small)

    @pictures = Array.new
    @unsorted_pictures = @category.pictures
    # sort pictures by title for them to be displayed in order
    @sorted_pictures = @unsorted_pictures.sort { |a,b| a.title.downcase <=> b.title.downcase }
    @sorted_pictures.each do |pic|
      all_descriptions = {}
      @sorted_descriptions = pic.pic_descriptions.sort { |a,b| a.language.abbreviation.downcase <=> b.language.abbreviation.downcase }
      @sorted_descriptions.each do |d|
        if d.language # condition needeed for the pictures_controller_test to pass
          all_descriptions[d.language.abbreviation] = d.content
        end
      end 
      @pictures.push({
        id: pic.id,
        title: pic.title,
        author: pic.author,
        descriptions: all_descriptions, # {'EN': EN_content, 'FR': FR_content}
        category_name: pic.category.name,
        pic_url_small: pic.picfile.url(:small),
        pic_url_medium: pic.picfile.url(:medium),
      })
    end
    category_descriptions = {}
    @category.cat_descriptions.each do |d|
      category_descriptions[d.language.abbreviation] = d.content
    end
    @pictures.push(category_descriptions)
    @pictures.push(@category.name)
    @pictures.push(@categories)
    
    respond_to do |format|
      format.html
      format.json {render :json => @pictures}
      # @pictures = [{id, title, author, descriptions, category_name, pic_url_small, pic_url_medium}, 
      #              {PictN2},
      #              {PictN3},
      #              {category_lang_abbr1: category_content1, category_lang_abbrN: category_contentN},
      #              category_name,
      #              [all_categories]]
    end
  end

  def show
    @fb_url = category_picture_url(@category, @picture)
    @fb_title = @picture.title
    @fb_description = "A photograph by " + @picture.author
    @fb_image = @picture.picfile.url(:small)
    
    @pic_with_descriptions = []
    @sorted_descriptions = @picture.pic_descriptions.sort { |a,b| a.language.abbreviation.downcase <=> b.language.abbreviation.downcase }
    @sorted_descriptions.each do |d|
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
      format.html
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
        format.html { redirect_to edit_category_picture_url(@picture.category, @picture) }
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
        format.html { redirect_to category_pictures_url(@picture.category) }
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
      format.html { redirect_to category_pictures_url(@category) }
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
