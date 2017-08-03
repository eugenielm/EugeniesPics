class AddPicfileToPictures < ActiveRecord::Migration[5.1]
  def change
    add_attachment :pictures, :picfile
  end
end
