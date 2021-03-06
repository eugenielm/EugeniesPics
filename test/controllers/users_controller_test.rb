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
    assert_equal 'You need to be logged in for this action.', flash[:danger]
  end

  test "authenticated non-admin user should get redirected to its profile when get index" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get users_url
    assert_redirected_to user_url(@user_non_admin)
    follow_redirect!
    assert_equal "You were redirected because you don't have the required permissions for the requested page.", flash[:info]
  end

  test "authenticated admin user should get index" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get users_url
    assert_response :success

    get users_url + ".json"
    assert_equal @response.body, [
        {id: 1, 
        email: @user_non_admin.email, 
        password_digest: @user_non_admin.password_digest, 
        created_at: @user_non_admin.created_at, 
        updated_at: @user_non_admin.updated_at, 
        username: @user_non_admin.username,
        superadmin: false},
        {id: 2, 
        email: @user_admin.email, 
        password_digest: @user_admin.password_digest, 
        created_at: @user_admin.created_at, 
        updated_at: @user_admin.updated_at, 
        username: @user_admin.username,
        superadmin: true}
      ].to_json
  end


  # new

  test "any user should get new" do
    get new_user_url # there're already 2 users and it's not allowed to have more than 2
    assert_redirected_to root_path
    
    User.delete_all
    get new_user_url # there're now 0 user
    assert_response :success
  end


  # create

  test "It's not allowed to create more than 2 users" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    # there're already 2 users in the db
    post users_url, params: { user: { username: 'new user',
                                      email: 'new_user@example.com',
                                      password: 'passpass',
                                      password_confirmation: 'passpass' } }
    assert_redirected_to root_path
    assert_equal User.all.length, 2
  end

  test "the first user created should be a superadmin" do
    User.delete_all
    assert_difference('User.count') do
      post users_url, params: { user: { username: 'new user',
                                        email: 'new_user@example.com',
                                        password: 'passpass',
                                        password_confirmation: 'passpass' } }
    end

    assert_equal User.last.superadmin, true
    assert_redirected_to user_url(User.last)
    follow_redirect!
    assert_equal "You're now registered and logged in!", flash[:success]
  end

  test "the second user created should not be a superadmin" do
    User.delete_all
    # creating user #1
    assert_difference('User.count') do
      post users_url, params: { user: { username: 'new_user',
                                        email: 'new_user@example.com',
                                        password: 'passpass',
                                        password_confirmation: 'passpass' } }
    end

    # creating user #2
    post users_url, params: { user: { username: 'new_user2',
                                      email: 'new_user2@example.com',
                                      password: 'passpass',
                                      password_confirmation: 'passpass' } }

    assert_equal User.last.superadmin, false
    assert_redirected_to user_url(User.last)
    follow_redirect!
    assert_equal "You're now registered and logged in!", flash[:success]
  end


  # show

  test "unauthenticated user should be redirected to login_url when #show user" do
    get user_url(@user_admin)
    assert_redirected_to login_url
    follow_redirect!
    assert_equal 'You need to be logged in for this action.', flash[:danger]
  end

  test "authenticated non-admin user should be redirected to their profile when #show another user" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get user_url(@user_admin)
    assert_redirected_to user_url(@user_non_admin)
    follow_redirect!
    assert_equal "You were redirected because you don't have the required permissions.", flash[:danger]
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
    assert_equal 'You need to be logged in for this action.', flash[:danger]
  end

  test "authenticated non-admin user should be redirected to root_url when #edit another user" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get edit_user_url(@user_admin)
    assert_redirected_to user_url(@user_non_admin)
    follow_redirect!
    assert_equal "You were redirected because you don't have the required permissions.", flash[:danger]
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
    assert_equal 'You need to be logged in for this action.', flash[:danger]
  end

  test "authenticated non-admin user shouldn't be allowed to update another user" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    patch user_url(@user_admin), params: { user: { username: 'new name',
                                                   email: 'new@example.com',
                                                   password: 'passpass',
                                                   password_confirmation: 'passpass' } }
    assert_redirected_to user_url(@user_non_admin)
    follow_redirect!
    assert_equal "You were redirected because you don't have the required permissions.", flash[:danger]
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
    assert_no_difference('User.count') do
      delete user_url(@user_non_admin)
    end
    assert_redirected_to login_url
    follow_redirect!
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  test "authenticated non-admin user should be able to destroy their user profile (but will be prevented from doing so by React component)" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    assert_difference('User.count', -1) do
      delete user_url(@user_non_admin)
    end
    assert_redirected_to root_url
    follow_redirect!
    assert_equal "User was destroyed.", flash[:danger]
  end

  test "authenticated non-admin user should not be able to destroy another user profile" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    assert_no_difference('User.count') do
      delete user_url(@user_admin)
    end
    assert_redirected_to user_url(@user_non_admin)
    follow_redirect!
    assert_equal "You were redirected because you don't have the required permissions.", flash[:danger]
  end

  test "authenticated admin user should destroy any user" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    assert_difference('User.count', -1) do
      delete user_url(@user_non_admin)
    end
    assert_redirected_to users_url
    follow_redirect!
    assert_equal "User was destroyed.", flash[:danger]
  end
end
