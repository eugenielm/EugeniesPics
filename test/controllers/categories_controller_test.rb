require 'test_helper'
require 'json'

class CategoriesControllerTest < ActionDispatch::IntegrationTest

  setup do
    @category = categories(:one)
    @user_non_admin = users(:one)
    @user_admin = users(:two)
  end

  # index
  test "any user should get the categories index" do
    get categories_url
    assert_response :success # Status code is in the 200-299 range

    @categories = Array.new
    Category.all.each do |c|
      @categories.push({id: c.id,
                        name: c.name,
                        catpic_url: c.catpic.url,})
    end
    get categories_url + ".json"
    assert_equal @response.body, @categories.to_json
  end

  # show
  test "any user should get redirected to pictures index when get category#show" do
    get category_url(@category)
    assert_redirected_to category_pictures_url(@category)

    @cat_with_descriptions = []
    @category.cat_descriptions.each do |d|
      @cat_with_descriptions.push({:description_id => d.id,
                                   :language_name => d.language.name,
                                   :language_abbr => d.language.abbreviation,
                                   :language_id => d.language.id,
                                   :content => d.content})
    end
    @cat_with_descriptions.push({ category_name: @category.name,
                                  catpic_url: @category.catpic.url(:small),
                                  catpic_name: @category.catpic_file_name })
    get "/categories/" + @category.id.to_s + ".json"
    assert_equal @response.body, @cat_with_descriptions.to_json
  end

  # new category
  test "unauthenticated user should be redirected to login_url when getting new category" do
    get new_category_url
    assert_redirected_to login_url
    follow_redirect!
  end

  test "authenticated non-admin user should get the new category form" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get new_category_url
    assert_response :success
  end

  test "authenticated admin user should get new category" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get new_category_url
    assert_response :success
  end

  # create
  test "authenticated admin user should be able to create a category" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    assert_difference('Category.count') do
      post categories_url, params: { category: { name: 'new category' } }
    end
    assert_redirected_to edit_category_url(Category.last)
    follow_redirect!
    assert_equal '"new category" category was successfully created.', flash[:success]
  end

  # edit
  test "unauthenticated user should be redirected to login when getting edit category" do
    get edit_category_url(@category)
    assert_redirected_to login_url
    follow_redirect!
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  test "authenticated non-admin user should should get the edit category page" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get edit_category_url(@category)
    assert_response :success
  end

  test "authenticated admin user should get the edit category page" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get edit_category_url(@category)
    assert_response :success
  end

  # update
  test "unauthenticated user should be redirected to login when updating category" do
    patch category_url(@category), params: { category: { name: 'new name' } }
    assert_redirected_to login_url
    follow_redirect!
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  test "authenticated non-admin user is allowed to update a category (but will be prevented from doing so by the corresponding React component)" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    patch category_url(@category), params: { category: { name: 'new name' } }
    assert_redirected_to category_url(@category)
    follow_redirect!
    assert_equal '"new name" category was successfully updated.', flash[:success]
  end

  test "authenticated admin user should be able to update a category" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    patch category_url(@category), params: { category: { name: 'new_name' } }
    assert_redirected_to category_url(@category)
    follow_redirect!
    assert_equal '"new_name" category was successfully updated.', flash[:success]
  end

  # destroy
  test "unauthenticated user should be redirected to login when destroying a category" do
    assert_no_difference('Category.count') do
      delete category_url(@category)
    end
    assert_redirected_to login_url
    follow_redirect!
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  test "authenticated non-admin user should be allowed to destroy a category (but will be prevented from doing so in React component)" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    assert_difference('Category.count', -1) do
      delete category_url(@category)
    end
    assert_redirected_to categories_url
  end

  test "authenticated admin user should be able to destroy category" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    assert_difference('Category.count', -1) do
      delete category_url(@category)
    end
    assert_redirected_to categories_url
    follow_redirect!
    assert_equal '"' + @category.name + '" category was destroyed.', flash[:danger]
  end
end
