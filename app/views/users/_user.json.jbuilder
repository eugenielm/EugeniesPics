json.extract! user, :id, :email, :password_digest, :created_at, :updated_at, :username, :superadmin
json.url user_url(user, format: :json)
