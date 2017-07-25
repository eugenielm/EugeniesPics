ActiveAdmin.register Category do
# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
  permit_params :name, pictures_attributes: [:title, :author, :description, :category_id]

  show do
    attributes_table(*category.attributes.keys) do
      row :pictures do
        nb = Picture.where(params[:id]).length.to_s
        link_to "Pictures (" + nb + ")", admin_category_pictures_path(Category.find(params[:id]))
      end
    end
  end

  action_item :view, only: :index do
    link_to 'View website page', categories_path
  end

  controller do
    before_action :get_category, only: [:edit, :destroy, :show, :update]

    def edit
      super do
        @page_title = "EDIT: '" + @category.name + "' category"
      end
    end

    private
      def get_category
        @category = Category.find(params[:id])
      end
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
