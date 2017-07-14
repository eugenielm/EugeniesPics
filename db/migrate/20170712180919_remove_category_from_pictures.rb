class RemoveCategoryFromPictures < ActiveRecord::Migration[5.1]
  def change
    remove_column :pictures, :category, :string
  end
end
