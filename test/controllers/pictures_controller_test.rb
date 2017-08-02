require 'test_helper'

class PicturesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @category = categories(:one)
    @picture = pictures(:Pict1)
    @user_non_admin = users(:one)
    @user_admin = users(:two)
  end

  test "should get pictures index" do
    get category_pictures_url(@category)
    assert_response :success
  end

  test "should get picture detail page" do
    get category_picture_url(@category, @picture)
    assert_response :success
  end

  # new picture
  test "unauthenticated user should be redirected to login url when new picture" do
    get new_category_picture_url(@category)
    assert_redirected_to login_url
    follow_redirect!
    assert_equal 'You need to be logged in for this action.', flash[:info]
  end

  test "authenticated non-admin user should be redirected to root_url when new picture" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get new_category_picture_url(@category)
    assert_redirected_to root_url
    follow_redirect!
    assert_equal 'Unauthorized action.', flash[:danger]
  end

  test "authenticated admin user should get new picture" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get new_category_picture_url(@category)
    assert_response :success
  end

  # create
  test "authenticated admin user should create picture" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    assert_difference('Picture.count') do
      post category_pictures_url(@category), params: { picture: { title: 'new picture', author: 'EG', description: 'blah', category_id: @category.id } }
    end
    assert_redirected_to category_pictures_url(@category)
    follow_redirect!
    assert_equal 'Picture was successfully created.', flash[:info]
  end

  # edit
  test "unauthenticated user should be redirected to login when get edit picture" do
    get edit_category_picture_url(@category, @picture)
    assert_redirected_to login_url
    follow_redirect!
    assert_equal 'You need to be logged in for this action.', flash[:info]
  end

  test "authenticated non-admin user should be redirected to root when get edit picture" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get edit_category_picture_url(@category, @picture)
    assert_redirected_to root_url
    follow_redirect!
    assert_equal 'Unauthorized action.', flash[:danger]
  end

  test "authenticated admin user should get edit picture" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get edit_category_picture_url(@category, @picture)
    assert_response :success
  end

  # update
  test "unauthenticated user should be redirected to login when patch update picture" do
    patch category_picture_url(@category, @picture), params: { picture: { title: 'new title', author: 'EG', description: 'blah', category_id: @category.id } }
    assert_redirected_to login_url
    follow_redirect!
    assert_equal 'You need to be logged in for this action.', flash[:info]
  end

  test "authenticated non-admin user should be redirected to root when patch update picture" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    patch category_picture_url(@category, @picture), params: { picture: { title: 'new title', author: 'EG', description: 'blah', category_id: @category.id } }
    assert_redirected_to root_url
    follow_redirect!
    assert_equal 'Unauthorized action.', flash[:danger]
  end

  test "authenticated admin user should be able to update picture" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    patch category_picture_url(@category, @picture), params: { picture: { title: 'new title', author: 'EG', description: 'blah', category_id: @category.id } }
    assert_redirected_to category_picture_url(@category, @picture)
    follow_redirect!
    assert_equal 'Picture was successfully updated.', flash[:info]
  end

  # destroy
  test "unauthenticated user should be redirected to login when destroy picture" do
    assert_difference('Picture.count', 0) do
      delete category_picture_url(@category, @picture)
    end
    assert_redirected_to login_url
    follow_redirect!
    assert_equal 'You need to be logged in for this action.', flash[:info]
  end

  test "authenticated non-admin user should be redirected to login when destroy picture" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    assert_difference('Picture.count', 0) do
      delete category_picture_url(@category, @picture)
    end
    assert_redirected_to root_url
    follow_redirect!
    assert_equal 'Unauthorized action.', flash[:danger]
  end

  test "authenticated admin user should destroy picture" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    assert_difference('Picture.count', -1) do
      delete category_picture_url(@category, @picture)
    end
    assert_redirected_to category_pictures_url(@category)
    follow_redirect!
    assert_equal 'Picture was successfully destroyed.', flash[:info]
  end

end
