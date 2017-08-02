require 'test_helper'

class WelcomeControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get '/'
    assert_response :success
  end

  test "should get about" do
    get '/about'
    assert_response :success
  end

end
