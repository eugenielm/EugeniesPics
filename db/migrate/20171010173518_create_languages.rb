class CreateLanguages < ActiveRecord::Migration[5.1]
  def change
    create_table :languages do |t|
      t.string :name
      t.string :abbreviation

      t.timestamps
    end
    add_index :languages, :name, unique: true
    add_index :languages, :abbreviation, unique: true
  end
end
