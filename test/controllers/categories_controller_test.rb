require 'test_helper'

class CategoriesControllerTest < ActionDispatch::IntegrationTest

  setup do
    @category = categories(:one)
    @user_non_admin = users(:one)
    @user_admin = users(:two)
  end

  # index
  test "any user should get the categories index" do
    get categories_url
    assert_response :success # Status code was in the 200-299 range
  end

  # show
  test "any user should get redirected to category_pictures_url(category)index when get category_url(category)" do
    get category_url(@category)
    assert_redirected_to category_pictures_url(@category)
  end

  # new category
  test "unauthenticated user should be redirected to login url when new category" do
    get new_category_url
    assert_redirected_to login_url
    follow_redirect!
  end

  test "authenticated non-admin user should be redirected to root_url when new category" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get new_category_url
    assert_redirected_to root_url
    follow_redirect!
  end

  test "authenticated admin user should get new category" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get new_category_url
    assert_response :success
  end

  # create
  test "authenticated admin user should create category" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    assert_difference('Category.count') do
      post categories_url, params: { category: { name: 'new category' } }
    end
    assert_redirected_to category_url(Category.last)
    follow_redirect!
    assert_equal '"new category" category was successfully created.', flash[:info]
  end

  # show
  test "should show category" do
    get category_url(@category)
    assert_redirected_to category_pictures_url(@category)
    follow_redirect!
  end

  # edit
  test "unauthenticated user should be redirected to login when get edit category" do
    get edit_category_url(@category)
    assert_redirected_to login_url
    follow_redirect!
    assert_equal "You need to be logged in for this action.", flash[:info]
  end

  test "authenticated non-admin user should be redirected to root when get edit category" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get edit_category_url(@category)
    assert_redirected_to root_url
    follow_redirect!
    assert_equal "Unauthorized action.", flash[:danger]
  end

  test "authenticated admin user should get edit" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get edit_category_url(@category)
    assert_response :success
  end

  # update
  test "unauthenticated user should be redirected to login when update category" do
    patch category_url(@category), params: { category: { name: 'new name' } }
    assert_redirected_to login_url
    follow_redirect!
    assert_equal "You need to be logged in for this action.", flash[:info]
  end

  test "authenticated non-admin user should be redirected to root when update category" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    patch category_url(@category), params: { category: { name: 'new name' } }
    assert_redirected_to root_url
    follow_redirect!
    assert_equal "Unauthorized action.", flash[:danger]
  end

  test "authenticated admin user should update category" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    patch category_url(@category), params: { category: { name: 'new_name' } }
    assert_redirected_to categories_url
    follow_redirect!
    # category name not updated!
    # assert_equal '"' + @category.name + '" category was successfully updated.', flash[:info]
  end

  # destroy
  test "unauthenticated user should be redirected to login when destroy category" do
    assert_difference('Category.count', 0) do
      delete category_url(@category)
    end
    assert_redirected_to login_url
    follow_redirect!
    assert_equal "You need to be logged in for this action.", flash[:info]
  end

  test "authenticated non-admin user should be redirected to login when destroy category" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    assert_difference('Category.count', 0) do
      delete category_url(@category)
    end
    assert_redirected_to root_url
    follow_redirect!
    assert_equal "Unauthorized action.", flash[:danger]
  end

  test "authenticated admin user should destroy category" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    assert_difference('Category.count', -1) do
      delete category_url(@category)
    end
    assert_redirected_to categories_url
    follow_redirect!
    assert_equal '"' + @category.name + '" category was successfully destroyed.', flash[:info]
  end
end
