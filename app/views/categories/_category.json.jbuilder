json.extract! category, :id, :name, :created_at, :updated_at, :catpic_file_name, :catpic_content_type, :catpic_file_size, :catpic_updated_at
json.url category_url(category, format: :json)