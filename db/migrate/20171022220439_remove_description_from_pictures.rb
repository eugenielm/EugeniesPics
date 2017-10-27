class RemoveDescriptionFromPictures < ActiveRecord::Migration[5.1]
  def change
    remove_column :pictures, :description, :text
  end
end
