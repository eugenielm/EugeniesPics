class AddCategoryPhotoToCategories < ActiveRecord::Migration[5.1]
  def change
    add_attachment :categories, :catpic
    add_index :categories, :catpic_file_name, unique: true
  end
end
