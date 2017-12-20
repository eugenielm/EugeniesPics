class AddBackgroundColorToSettings < ActiveRecord::Migration[5.1]
  def change
    add_column :settings, :background_color, :string, default: "#eeeeee"
  end
end
