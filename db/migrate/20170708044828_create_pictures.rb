class CreatePictures < ActiveRecord::Migration[5.1]
  def change
    create_table :pictures do |t|
      t.string :title
      t.string :author
      t.string :category
      t.text :description

      t.timestamps
    end
  end
end
