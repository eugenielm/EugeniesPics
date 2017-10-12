class CreatePresentations < ActiveRecord::Migration[5.1]
  def change
    create_table :presentations do |t|
      t.text :content
      t.belongs_to :language, index: { unique: true }, foreign_key: true

      t.timestamps
    end
  end
end
