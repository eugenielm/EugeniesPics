class WelcomeController < ApplicationController
  def index
    @picsSelection = []
    
    Category.all.each do |cat|
      randomPicId = cat.pictures.ids.sample(1)[0] # sample() returns a list
      selectionPicUrl = randomPicId ? Picture.find(randomPicId).picfile.url(:medium) : cat.catpic.url(:medium)
      @picsSelection.push({selectionPicUrl: selectionPicUrl,
                           selectionPicCatId: cat.id,
                           selectionPicCatName: cat.name})
    end

    if @picsSelection.empty?
      @picsSelection.push({selectionPicUrl: "/missing.jpg", selectionPicCatId: nil})
    end

    respond_to do |format|
      format.html
      format.json {render :json => @picsSelection}
    end
  end

end
