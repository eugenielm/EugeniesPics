class CreatePicDescriptions < ActiveRecord::Migration[5.1]
  def change
    create_table :pic_descriptions do |t|
      t.text :content
      t.references :language, index: true, foreign_key: true
      t.references :picture, index: true, foreign_key: true

      t.timestamps
    end
  end
end
