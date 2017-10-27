require 'test_helper'

class CatDescriptionTest < ActiveSupport::TestCase
  test "category description should be valid" do
    assert cat_descriptions(:one).valid?
  end

  test "category description content length should be at least 2 characters" do
    assert_not cat_descriptions(:two).valid?
  end

  test "category description content length should be 1000 characters or less" do
    @catdesc = CatDescription.new({:id => 5, :category_id => 2, :language_id => 2, :content => "a"*1001})
    assert_not @catdesc.valid?
  end

  test "category description should belong to a language" do
    assert_not cat_descriptions(:three).valid?
  end

  test "category description should belong to a category" do
    assert_not cat_descriptions(:four).valid?
  end

  # test "a category shouldn't have more than one description in each language" do
  #   @catdesc = CatDescription.new({:id => 6, :category_id => 1, :language_id => 1, :content => "this is content"})
  #   assert_not @catdesc.valid?
  # end
end
