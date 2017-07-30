class AddIndexOnTitleToPictures < ActiveRecord::Migration[5.1]
  def change
    add_index :pictures, :title, unique: true
  end
end
