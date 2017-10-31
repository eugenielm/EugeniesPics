require 'test_helper'

class WelcomeControllerTest < ActionDispatch::IntegrationTest
  test "GET index" do
    get '/'
    assert_response :success
  end

end
