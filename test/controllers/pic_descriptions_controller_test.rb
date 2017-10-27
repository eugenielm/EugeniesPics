require 'test_helper'

class PicDescriptionsControllerTest < ActionDispatch::IntegrationTest

  setup do
    @picture = pictures(:Pict1)
    @category = categories(:one)
    @pic_description = pic_descriptions(:one)
    @user_non_admin = users(:one)
    @user_admin = users(:two)
  end

  ####################### unauthenticated user ######################

  # index
  test "unauthenticated user shouldn't get the picture descriptions index" do
    get category_picture_picdescriptions_url(@category, @picture)
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:info]
  end

  # show
  test "unauthenticated user shouldn't get the show action" do
    get category_picture_picdescription_url(@category, @picture, @pic_description)
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:info]
  end

  # new
  test "unauthenticated user shouldn't get the new action" do
    get new_category_picture_picdescription_url(@category, @picture)
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:info]
  end

  # edit
  test "unauthenticated user shouldn't get the edit action" do
    get edit_category_picture_picdescription_url(@category, @picture, @pic_description)
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:info]
  end

  # create
  test "unauthenticated user shouldn't be allowed to create a picture description" do
    post category_picture_picdescriptions_url(@category, @picture), 
         params: { pic_description: { content: 'new picture description', language_id: 2, category_id: 1, picture_id: 1 } }
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:info]
  end

  # update
  test "unauthenticated user shouldn't be allowed to update a picture description" do
    patch category_picture_picdescription_url(@category, @picture, @pic_description), 
          params: { pic_description: { content: 'updated picture description' } }
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:info]
  end

  # destroy
  test "unauthenticated user shouldn't be allowed to destroy a picture description" do
    assert_no_difference('PicDescription.count') do
      delete category_picture_picdescription_url(@category, @picture, @pic_description)
    end
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:info]
  end


  ################ non superadmin authenticated user ################

  #index
  test "non superadmin user shouldn't get the picture descriptions index" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get category_picture_picdescriptions_url(@category, @picture)
    assert_response :found
    assert_redirected_to root_url
    assert_equal "Unauthorized action.", flash[:danger]
  end

  # show
  test "non superadmin user shouldn't get the show action" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get category_picture_picdescription_url(@category, @picture, @pic_description)
    assert_response :found
    assert_redirected_to root_url
    assert_equal "Unauthorized action.", flash[:danger]
  end

  # new
  test "non superadmin user shouldn't get the new action" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get new_category_picture_picdescription_url(@category, @picture)
    assert_response :found
    assert_redirected_to root_url
    assert_equal "Unauthorized action.", flash[:danger]
  end

  # edit
  test "non superadmin user shouldn't get the edit action" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get edit_category_picture_picdescription_url(@category, @picture, @pic_description)
    assert_response :found
    assert_redirected_to root_url
    assert_equal "Unauthorized action.", flash[:danger]
  end

  # create
  test "non superadmin user shouldn't be allowed to create a picture description" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    post category_picture_picdescriptions_url(@category, @picture), 
    params: { pic_description: { content: 'new picture description', language_id: 2, category_id: 1, picture_id: 1 } }
    assert_response :found
    assert_redirected_to root_url
    assert_equal "Unauthorized action.", flash[:danger]
  end

  # update
  test "non superadmin user shouldn't be allowed to update a picture description" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    patch category_picture_picdescription_url(@category, @picture, @pic_description), 
    params: { pic_description: { content: 'updated picture description' } }
    assert_response :found
    assert_redirected_to root_url
    assert_equal "Unauthorized action.", flash[:danger]
  end

  # destroy
  test "non superadmin user shouldn't be allowed to destroy a picture description" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    assert_no_difference('PicDescription.count') do
      delete category_picture_picdescription_url(@category, @picture, @pic_description)
    end
    assert_response :found
    assert_redirected_to root_url
    assert_equal "Unauthorized action.", flash[:danger]
  end
  

#   ######################### superadmin user #########################

  #index
  test "superadmin user should be redirected to the picture edit when requesting the picture descriptions index" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get category_picture_picdescriptions_url(@category, @picture)
    assert_response :found
    assert_redirected_to edit_category_picture_url(@category, @picture)
    
    get category_picture_picdescriptions_url(@category, @picture) + '.json'
    expected = '[{"id":1,"language":"MyLang1","language_id":1,"content":"this is a picture description"},"Picture1"]'
    assert_equal expected, @response.body
  end

  # show
  test "superadmin user should get redirected from the show action" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get category_picture_picdescription_url(@category, @picture, @pic_description)
    assert_response :found
    assert_redirected_to edit_category_picture_picdescription_url(@category, @picture, @pic_description)
  end

  # new
  test "superadmin user should get the new action" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get new_category_picture_picdescription_url(@category, @picture)
    assert_response :success
  end

  # edit
  test "superadmin user should get the edit action" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get edit_category_picture_picdescription_url(@category, @picture, @pic_description)
    assert_response :success
  end

  # create
  test "superadmin user should be allowed to create a picture description" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}    
    assert_difference('PicDescription.count') do
      post category_picture_picdescriptions_url(@category, @picture), 
           params: { pic_description: { content: 'new picture description', language_id: 2, category_id: 1, picture_id: 1 } }
    end
    assert_response :found
    assert_redirected_to edit_category_picture_url(@category, @picture)
    assert_equal 'MyLang2 description of "Picture1" was successfully added.', flash[:success]
  end

  # update
  test "superadmin user should be allowed to update a picture description" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    patch category_picture_picdescription_url(@category, @picture, @pic_description), 
          params: { pic_description: { content: 'updated picture description' } }
    assert_response :found
    assert_redirected_to edit_category_picture_url(@category, @picture)
    assert_equal 'MyLang1 description of "Picture1" was successfully updated.', flash[:success]
  end


  # destroy
  test "superadmin user should be allowed to destroy a picture description" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    assert_difference('PicDescription.count', -1) do
      delete category_picture_picdescription_url(@category, @picture, @pic_description)
    end
    assert_response :found
    assert_redirected_to edit_category_picture_url(@category, @picture)
    assert_equal 'MyLang1 description of "Picture1" was destroyed.', flash[:danger]
  end

end