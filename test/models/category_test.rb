require 'test_helper'

class CategoryTest < ActiveSupport::TestCase

  test "category should be valid" do
    assert categories(:one).valid?
  end

  test "pictureless-category should be valid" do
    pic = Category.new(name: 'PictureLessCat')
    assert pic.valid?
  end

  test "name should be present" do
    categories(:one).name = ''
    assert_not categories(:one).valid?
  end

  test "name should be at least 2 characters long" do
    categories(:one).name = 'a'
    assert_not categories(:one).valid?
  end

  test "name shouldn't be more than 30 characters long" do
    categories(:one).name = 'a' * 31
    assert_not categories(:one).valid?
  end

  test "name should be unique (case insensitive)" do
    categories(:one).name = 'MYCAT2'
    assert_not categories(:one).valid?
  end
  
  test "catpic_file_size should be less than 4Mb (= 4096000 bytes) inclusive" do
    categories(:one).catpic_file_size = 4096001
    assert_not categories(:one).valid?
  end

end
