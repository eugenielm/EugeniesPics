class AddCategoryRefToPictures < ActiveRecord::Migration[5.1]
  def change
    add_reference :pictures, :category, foreign_key: true
  end
end
