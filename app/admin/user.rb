ActiveAdmin.register User do
# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
  permit_params :email, :username, :password, :password_confirmation, :superadmin

  index do
    column "User ID", :id
    column :username
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
    f.inputs "User Details" do
      f.input :username
      f.input :email
      f.input :password
      f.input :password_confirmation
      f.input :superadmin, :label => "Super Admin"
    end
    f.actions
  end

  # create_or_edit = Proc.new {
  #   @user            = User.find_or_create_by_id(params[:id])
  #   @user.superadmin = params[:user][:superadmin]
  #   @user.attributes = params[:user].delete_if do |k, v|
  #     (k == "superadmin") ||
  #     (["password", "password_confirmation"].include?(k) && v.empty? && !@user.new_record?)
  #   end
  #   if @user.save
  #     redirect_to :action => :show, :id => @user.id
  #   else
  #     render active_admin_template((@user.new_record? ? 'new' : 'edit') + '.html.erb')
  #   end
  # }
  # member_action :create, :method => :post, &create_or_edit
  # member_action :update, :method => :put, &create_or_edit
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if params[:action] == 'create' && current_user.admin?
#   permitted
# end
end
