require 'test_helper'

class MessageMailerTest < ActionMailer::TestCase

  test "contact_me" do
    message = Message.new name: 'mike',
                          email: 'mike@example.com',
                          body: 'Hello there!'

    email = MessageMailer.contact_me(message)

    assert_emails 1 do
      email.deliver_now
    end

    assert_equal "Message from 'Eugenie's pics' website", email.subject
    assert_equal ['eugeniespics@gmail.com'], email.to
    assert_equal ['mike@example.com'], email.from
    assert_match /Hello there!/, email.body.encoded
  end
end