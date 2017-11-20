class WelcomeController < ApplicationController
  def index
    @fb_url = root_url
    @fb_title = "Eugenie's pics"
    @fb_description = "Photographs by Eugénie Le Moulec"
    @fb_image = "<%= image_tag EUGENIESPICS.JPG %>"

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
