require 'test_helper'

class SettingTest < ActiveSupport::TestCase

  test "setting should be valid" do
    assert settings(:Setting1).valid?
  end

  test "maintitle length should be at least 2" do
    settings(:Setting1).maintitle = 'a'
    assert_not settings(:Setting1).valid?
  end

  test "maintitle length should be no more than 20" do
    settings(:Setting1).maintitle = 'a' * 21
    assert_not settings(:Setting1).valid?
  end

  test "subtitle length should be at least 2" do
    settings(:Setting1).subtitle = 'a'
    assert_not settings(:Setting1).valid?
  end

  test "subtitle length should be no more than 40" do
    settings(:Setting1).subtitle = 'a' * 41
    assert_not settings(:Setting1).valid?
  end

  test "navbarcolor should have the HEX format #000fff" do
    settings(:Setting1).navbarcolor = '#00000'
    assert_not settings(:Setting1).valid?
    settings(:Setting1).navbarcolor = '#00000g'
    assert_not settings(:Setting1).valid?
  end

  test "navbarfont should have the HEX format #000fff" do
    settings(:Setting1).navbarfont = '#00000'
    assert_not settings(:Setting1).valid?
    settings(:Setting1).navbarfont = '00#0000'
    assert_not settings(:Setting1).valid?
  end

  test "background_color should have the HEX format #000fff" do
    settings(:Setting1).background_color = '#00000'
    assert_not settings(:Setting1).valid?
    settings(:Setting1).background_color = '*000000'
    assert_not settings(:Setting1).valid?
  end

  test "background_file_size should be less than 2Mb (= 2048000 bytes) inclusive" do
    settings(:Setting1).background_file_size = 2048001
    assert_not settings(:Setting1).valid?
  end

  test "id_picture_file_size should be less than 3Mb (= 3072000 bytes) inclusive" do
    settings(:Setting1).id_picture_file_size = 3072001
    assert_not settings(:Setting1).valid?
  end

end
