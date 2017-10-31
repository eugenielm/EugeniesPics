require 'test_helper'

class MessageTest < ActiveSupport::TestCase

  test "should be valid when all attributes are set" do
    attrs = { 
      name: 'mike',
      email: 'mike@example.com',
      body: 'this is a boring message'
    }
    msg = Message.new attrs
    assert msg.valid?, 'should be valid'
  end

  test "should be invalid when all attributes are set" do
    msg = Message.new
    refute msg.valid?, 'Blank Message should be invalid'
    
    assert_match /blank/, msg.errors[:name].to_s
    assert_match /blank/, msg.errors[:email].to_s
    assert_match /blank/, msg.errors[:body].to_s
  end

end