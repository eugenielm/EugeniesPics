require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_non_admin = users(:one)
    @user_admin = users(:two)
  end

  # get index
  test "unauthenticated user should get redirected to login_url when get index" do
    get users_url
    assert_redirected_to login_url
    follow_redirect!
    assert_equal 'You need to be logged in for this action.', flash[:info]
  end

  test "authenticated non-admin user should get redirected to root_url when get index" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get users_url
    assert_redirected_to root_url
    follow_redirect!
    assert_equal 'Unauthorized action.', flash[:danger]
  end

  test "authenticated admin user should get index" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get users_url
    assert_response :success
  end

  # new
  test "any user should get new" do
    get new_user_url
    assert_response :success
  end

  # create
  test "any user should create user" do
    assert_difference('User.count') do
      post users_url, params: { user: { username: 'new user',
                                        email: 'new_user@example.com',
                                        password: 'passpass',
                                        password_confirmation: 'passpass' } }
    end
    assert_redirected_to user_url(User.last)
    follow_redirect!
    assert_equal "You're now registered and logged in!", flash[:success]
  end

  # show
  test "unauthenticated user should be redirected to login_url when #show user" do
    get user_url(@user_admin)
    assert_redirected_to login_url
    follow_redirect!
    assert_equal 'You need to be logged in for this action.', flash[:info]
  end

  test "authenticated non-admin user should be redirected to root_url when #show another user" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get user_url(@user_admin)
    assert_redirected_to root_url
    follow_redirect!
    assert_equal 'Unauthorized action.', flash[:danger]
  end

  test "authenticated non-admin user should be able to see their user profile" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get user_url(@user_non_admin)
    assert_response :success
  end

  test "authenticated admin user should be able to see any user profile" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get user_url(@user_non_admin)
    assert_response :success
  end

  # edit
  test "unauthenticated user should be redirected to login_url when #edit user" do
    get edit_user_url(@user_admin)
    assert_redirected_to login_url
    follow_redirect!
    assert_equal 'You need to be logged in for this action.', flash[:info]
  end

  test "authenticated non-admin user should be redirected to root_url when #edit another user" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get edit_user_url(@user_admin)
    assert_redirected_to root_url
    follow_redirect!
    assert_equal 'Unauthorized action.', flash[:danger]
  end

  test "authenticated non-admin user should be able to edit their user profile" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get edit_user_url(@user_non_admin)
    assert_response :success
  end

  test "authenticated admin user should be able to edit any user profile" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get edit_user_url(@user_admin)
    assert_response :success
  end

  # update
  test "unauthenticated user should be redirected to login_url when update a user" do
    patch user_url(@user_non_admin), params: { user: { username: 'new name',
                                                       email: 'new@example.com',
                                                       password: 'passpass',
                                                       password_confirmation: 'passpass' } }
    assert_redirected_to login_url
    follow_redirect!
    assert_equal 'You need to be logged in for this action.', flash[:info]
  end

  test "authenticated non-admin user should be redirected to root_url when update another user" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    patch user_url(@user_admin), params: { user: { username: 'new name',
                                                   email: 'new@example.com',
                                                   password: 'passpass',
                                                   password_confirmation: 'passpass' } }
    assert_redirected_to root_url
    follow_redirect!
    assert_equal 'Unauthorized action.', flash[:danger]
  end

  test "authenticated non-admin user should be able to update their user profile" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    patch user_url(@user_non_admin), params: { user: { username: 'new name',
                                                   email: 'new@example.com',
                                                   password: 'passpass',
                                                   password_confirmation: 'passpass' } }
    assert_redirected_to user_url(@user_non_admin)
    follow_redirect!
    assert_equal 'User was successfully updated.', flash[:info]
  end

  test "authenticated admin user should be able to update any user profile" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    patch user_url(@user_non_admin), params: { user: { username: 'new name',
                                                       email: 'new@example.com',
                                                       password: 'passpass',
                                                       password_confirmation: 'passpass' } }
    assert_redirected_to user_url(@user_non_admin)
    follow_redirect!
    assert_equal 'User was successfully updated.', flash[:info]
  end

  # destroy
  test "unauthenticated user should be redirected when destroy any user" do
    assert_difference('User.count', 0) do
      delete user_url(@user_non_admin)
    end
    assert_redirected_to login_url
    follow_redirect!
    assert_equal "You need to be logged in for this action.", flash[:info]
  end

  test "authenticated non-admin user should be redirected when destroy another user" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    assert_difference('User.count', 0) do
      delete user_url(@user_admin)
    end
    assert_redirected_to root_url
    follow_redirect!
    assert_equal "Unauthorized action.", flash[:danger]
  end

  test "authenticated non-admin user should be able to destroy their user profile" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    assert_difference('User.count', -1) do
      delete user_url(@user_non_admin)
    end
    assert_redirected_to root_url
    follow_redirect!
    assert_equal "User was successfully destroyed.", flash[:info]
  end

  test "authenticated admin user should destroy any user" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    assert_difference('User.count', -1) do
      delete user_url(@user_non_admin)
    end
    assert_redirected_to users_url
    follow_redirect!
    assert_equal "User was successfully destroyed.", flash[:info]
  end
end
