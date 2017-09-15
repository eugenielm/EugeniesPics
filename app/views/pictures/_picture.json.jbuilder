json.extract! picture, :id, :category_id, :title, :author, :created_at, :updated_at, :description, :picfile_file_name, :picfile_content_type, :picfile_file_size, :picfile_updated_at
json.url category_picture_url(picture, format: :json)
