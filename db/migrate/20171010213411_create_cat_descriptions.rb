class CreateCatDescriptions < ActiveRecord::Migration[5.1]
  def change
    create_table :cat_descriptions do |t|
      t.text :content
      t.references :language, index: true, foreign_key: true
      t.references :category, index: true, foreign_key: true

      t.timestamps
    end
  end
end
