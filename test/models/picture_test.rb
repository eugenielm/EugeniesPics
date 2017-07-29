require 'test_helper'

class PictureTest < ActiveSupport::TestCase

  test "picture should be valid" do
    assert pictures(:Pict1).valid?
  end

  test "picture title shouldn't be blank" do
    pict = Picture.new(title: '',
                       author: 'EG',
                       description: 'blah',
                       category_id: 1)
    assert_not pict.valid?
  end

  test "picture title shouldn't be more than 30 characters" do
    pict = Picture.new(title: 'a' * 31,
                       author: 'EG',
                       description: 'blah',
                       category_id: 1)
    assert_not pict.valid?
  end

  test "picture author shouldn't be blank" do
    pict = Picture.new(title: 'MyPict',
                       author: '',
                       description: 'blah',
                       category_id: 1)
    assert_not pict.valid?
  end

  test "picture author shouldn't be more than 30 characters" do
    pict = Picture.new(title: 'MyPict',
                       author: 'a' * 31,
                       description: 'blah',
                       category_id: 1)
    assert_not pict.valid?
  end

  test "picture description should be at least 4 characters" do
    pict = Picture.new(title: 'MyPict',
                       author: 'EG',
                       description: 'bla',
                       category_id: 1)
    assert_not pict.valid?
  end

  test "picture description shouldn't be more than 500 characters" do
    pict = Picture.new(title: 'MyPict',
                       author: 'EG',
                       description: 'a' * 501,
                       category_id: 1)
    assert_not pict.valid?
  end

  test "picture category shouldn't be blank" do
    pict = Picture.new(title: 'MyPict',
                       author: 'EG',
                       description: 'Blah')
    assert_not pict.valid?
  end

  test "picture should be deleted if its category is destroyed" do
    categories(:one).destroy
    pict = pictures(:Pict1) rescue nil
    assert_nil(pict)
  end

end
