require 'test_helper'

class PictureTest < ActiveSupport::TestCase

  test "picture should be valid" do
    assert pictures(:Pict1).valid?
  end

  test "picture title shouldn't be blank" do
    pictures(:Pict1).title = ''
    assert_not pictures(:Pict1).valid?
  end

  test "picture title shouldn't be more than 30 characters" do
    pictures(:Pict1).title = 'a' * 31
    assert_not pictures(:Pict1).valid?
  end

  test "picture title should be unique" do
    pictures(:Pict1).title = 'Picture2'
    assert_not pictures(:Pict1).valid?
  end

  test "picture author shouldn't be blank" do
    pictures(:Pict1).author = ''
    assert_not pictures(:Pict1).valid?
  end

  test "picture author shouldn't be more than 30 characters" do
    pictures(:Pict1).author = 'a' * 31
    assert_not pictures(:Pict1).valid?
  end

  test "picture category shouldn't be blank" do
    pictures(:Pict1).category_id = nil
    assert_not pictures(:Pict1).valid?
  end

  test "picture must have a image file attached" do
    pictures(:Pict1).picfile_file_name = nil
    assert_not pictures(:Pict1).valid?
  end

  test "picfile_file_name should be unique" do
    pictures(:Pict1).picfile_file_name = 'test_file2.jpg'
    assert_not pictures(:Pict1).valid?
  end

  test "picfile_file_size should be less than 1.5Mb (= 1572864 bytes) inclusive" do
    pictures(:Pict1).picfile_file_size = 1572865
    assert_not pictures(:Pict1).valid?
  end

  test "picture should be deleted if its category is destroyed" do
    categories(:one).destroy
    pict = pictures(:Pict1) rescue nil
    assert_nil(pict)
  end

end
