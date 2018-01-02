class AddIdPictureToSettings < ActiveRecord::Migration[5.1]
  def change
    add_attachment :settings, :id_picture
  end
end
