require 'test_helper'

class SessionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @non_admin_user = users(:one)
  end

  test "should get new" do
    get login_url
    assert_response :success
  end

  test "should create session" do
    post login_url, params: { session: { email: @non_admin_user.email, password: 'nonadminpassword' }}
    assert_redirected_to root_url
    assert_equal flash[:info], "You've been logged in."
  end

  test "shouldn't create session with wrong password" do
    post login_url, params: { session: { email: @non_admin_user.email, password: 'wrong_password' }}
    assert_template 'new'
    assert_equal flash[:danger], 'Invalid email/password combination'
  end

  test "should destroy session" do
    post login_url, params: { session: { email: @non_admin_user.email, password: 'nonadminpassword' }}
    delete logout_url
    # redirect_back doesn't work in tests??? so the fallback_location is used
    assert_redirected_to root_url
    follow_redirect!
    assert_equal flash[:info], "You've been logged out."
  end

end
