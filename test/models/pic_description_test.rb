require 'test_helper'

class PicDescriptionTest < ActiveSupport::TestCase
  test "picture description should be valid" do
    assert pic_descriptions(:one).valid?
  end

  test "picture description content length should at least 2 characters" do
    assert_not pic_descriptions(:two).valid?
  end

  test "picture description content length should be 1000 characters or less" do
    @picdesc = PicDescription.new({:id => 5, :picture_id => 2, :language_id => 2, :content => "a"*1001})
    assert_not @picdesc.valid?
  end

  test "picture description should belong to a language" do
    assert_not pic_descriptions(:three).valid?
  end

  test "picture description should belong to a category" do
    assert_not pic_descriptions(:four).valid?
  end

  # test "a picture shouldn't have more than one description in each language" do
  #   @picdesc = PicDescription.new({:id => 5, :picture_id => 1, :language_id => 1, :content => "this is content"})
  #   assert_not @picdesc.valid?
  # end
end