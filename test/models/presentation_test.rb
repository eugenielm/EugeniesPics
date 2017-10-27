require 'test_helper'

class PresentationTest < ActiveSupport::TestCase
  test "presentation should be valid" do
    assert presentations(:one).valid?
  end

  test "A presentation content shouldn't be less than 10 characters" do
    assert_not presentations(:two).valid?
  end

  test "A presentation content shouldn't be more than 1000 characters" do
    @pres = Presentation.new({:id => 3, :language_id => 3, :content => "a"*1001})
    assert_not @pres.valid?
  end

  test "There shouldn't be more than one presentation in each language" do
    @pres = Presentation.new({:id => 4, :language_id => 1, :content => "a"*10})
    assert_not @pres.valid?
  end
end
