class WelcomeController < ApplicationController
  def index
    @picsSelection = []
    
    Category.all.each do |cat|
      randomPicId = cat.pictures.ids.sample(1)[0] # sample() returns a list
      randomPic = Picture.find(randomPicId)
      @picsSelection.push({selectionPicUrl: randomPic.picfile.url(:medium),
                           selectionPicCatId: randomPic.category_id,
                           selectionPicCatName: randomPic.category.name})
    end

    if @picsSelection.empty?
      @picsSelection.push({selectionPicUrl: "/missing.jpg", selectionPicCatId: nil})
    end

    respond_to do |format|
      format.html
      format.json {render :json => @picsSelection}
    end
  end

  def about
  end
end
