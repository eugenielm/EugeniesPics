require 'test_helper'

class CategoryTest < ActiveSupport::TestCase
  setup do
    @cat2 = Category.new(name: "")
    @cat3 = Category.new(name: "c")
    @cat4 = Category.new(name: "a" * 31)
  end

  test "category should be valid" do
    assert categories(:one).valid?
  end

  test "name should be present" do
    assert_not @cat2.valid?
  end

  test "name shouldn't be at least 2 characters long" do
    assert_not @cat3.valid?
  end

  test "name shouldn't be more than 30 characters long" do
    assert_not @cat4.valid?
  end

end
