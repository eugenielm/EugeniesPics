require 'test_helper'

class UserTest < ActiveSupport::TestCase

  def setup
    @user = User.new(username: 'toto',
                     email: 'toto@toto.com',
                     password: 'password',
                     password_confirmation: 'password',
                     superadmin: false)
  end

  test "user should be valid" do
    assert @user.valid?
  end

  test "username should be present" do
    @user.username = "     "
    assert_not @user.valid?
  end

  test "email should be present" do
    @user.email = "     "
    assert_not @user.valid?
  end

  test "username should not be be more than 255 characters" do
    @user.username = "a" * 73
    assert_not @user.valid?
  end

  test "email should not be too long" do
    @user.email = "a" * 244 + "@example.com"
    assert_not @user.valid?
  end

  test "email validation should accept valid addresses" do
    valid_addresses = %w[user@example.com USER@foo.COM A_US-ER@foo.bar.org
                         first.last@foo.jp alice+bob@baz.cn]
    valid_addresses.each do |valid_address|
      @user.email = valid_address
      assert @user.valid?, "#{valid_address.inspect} should be valid"
    end
  end

  test "email validation should reject invalid addresses" do
    invalid_addresses = %w[user@example,com user_at_foo.org user.name@example.
                           foo@bar_baz.com foo@bar+baz.com]
    invalid_addresses.each do |invalid_address|
      @user.email = invalid_address
      assert_not @user.valid?, "#{invalid_address.inspect} should be invalid"
    end
  end

  test "password and password_confirmation should be identical" do
    @user.password = "a" * 6
    @user.password_confirmation = "b" * 6
    assert_not @user.valid?
  end

  test "password should have a minimum length of 6" do
    @user.password = @user.password_confirmation = "a" * 5
    assert_not @user.valid?
  end

  test "password should be present (nonblank)" do
    @user.password = @user.password_confirmation = " " * 6
    assert_not @user.valid?
  end

  test "email should be unique" do
    user2 = User.new(username: "toto",
                     email: "one@one.com", # = users(:one).email
                     password: "a" * 6,
                     password_confirmation: "a" * 6)
    assert_not user2.valid?
  end

  test "username should be unique" do
    user3 = User.new(username: "oneone", # = users(:one).username
                     email: "toto@toto.com",
                     password: "a" * 6,
                     password_confirmation: "a" * 6)
    assert_not user3.valid?
  end

end
