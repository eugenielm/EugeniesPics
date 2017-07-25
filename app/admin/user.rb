ActiveAdmin.register User do
# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
  permit_params :email, :password, :password_confirmation

  index do
    column "User ID", :id
    column :email
    column :created_at
    column :updated_at
    # actions defaults: true
    column :actions do |u|
      user = User.find(u.id)
      (link_to "View", admin_user_path(user)) + " " +
      (link_to "Delete", admin_user_path(user), method: :delete,
      data: { confirm: 'Are you sure?' })
    end
  end

  # customize the form to allow the admin/user to enter both password and password_confirmation
  form do |f|
    f.inputs do
      f.input :email
      f.input :password
      f.input :password_confirmation
    end
    f.actions
  end
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if params[:action] == 'create' && current_user.admin?
#   permitted
# end
end
