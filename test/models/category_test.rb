require 'test_helper'

class CategoryTest < ActiveSupport::TestCase

  test "category should be valid" do
    assert categories(:one).valid?
  end

  test "name should be present" do
    assert_not categories(:two).valid?
  end

  test "name shouldn't be at least 2 characters long" do
    assert_not categories(:three).valid?
  end

  test "name shouldn't be more than 30 characters long" do
    assert_not categories(:four).valid?
  end

end
