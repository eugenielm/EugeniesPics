class CreateSettings < ActiveRecord::Migration[5.1]
  def change
    create_table :settings do |t|
      t.string :maintitle
      t.string :subtitle
      t.string :navbarcolor
      t.string :navbarfont
      t.string :background_file_name
      t.string :background_content_type
      t.integer :background_file_size
      t.datetime :background_updated_at
    end
  end
end
