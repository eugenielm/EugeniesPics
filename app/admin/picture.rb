ActiveAdmin.register Picture do
  config.per_page = [20, 50, 100]
  config.sort_order = 'title_asc'
  belongs_to :category
# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters

# if current_user.admin?
  permit_params :title, :author, :description, :category_id
# end

  action_item :view, only: :index do
    link_to 'View website page', category_pictures_path(Category.find(params[:category_id]))
  end

  controller do
    before_action :require_category
    before_action :require_picture, :except => [:index, :new, :create]

    def index
      super do
        @page_title = "Pictures in '" + @category.name + "' category"
      end
    end

    def show
      super do
        @page_title = @picture.title + " ('" + @category.name + "' category)"
      end
    end

    def edit
      super do
        @page_title = "EDIT: " + @picture.title + " ('" + @category.name + "' category)"
      end
    end

    private
      def require_category
        @category = Category.find(params[:category_id])
      end

      def require_picture
        @picture = Picture.find(params[:id])
      end

  end

# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if params[:action] == 'create' && current_user.admin?
#   permitted
# end
end
