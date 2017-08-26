class AddIndexOnPicfileFileNameToPictures < ActiveRecord::Migration[5.1]
  def change
    add_index :pictures, :picfile_file_name, unique: true
  end
end
