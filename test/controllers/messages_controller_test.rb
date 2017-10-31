require 'test_helper'

class MessageControllerTest < ActionDispatch::IntegrationTest

  test "GET new message page" do
    get new_message_url
    assert_response :success
    assert_select '#app-component'
  end

  test "POST create" do
    assert_difference 'ActionMailer::Base.deliveries.size', 1 do
      post create_message_url, params: {
      message: {
        name: 'mike',
        email: 'mike@example.com',
        body: 'coucou'
        }
      }
    end

    assert_redirected_to new_message_url
    follow_redirect!
    assert_match /Your message has been sent!/, response.body
  end

  test "invalid POST create" do
    assert_no_difference 'ActionMailer::Base.deliveries.size' do
      post create_message_url, params: {
        message: { name: '', email: '', body: '' }
      }
    end

    assert_response :reset_content
    assert_equal 'Oops, something went wrong...', flash[:danger]
  end

end
