require 'test_helper'

class PicturesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @category = categories(:one)
    @categories = Category.all
    @cat_description = cat_descriptions(:one)
    @language = languages(:one)
    @picture = pictures(:Pict1)
    @user_non_admin = users(:one)
    @user_admin = users(:two)
  end

  test "any user should get the pictures index" do
    get category_pictures_url(@category)
    assert_response :success

    get category_pictures_url(@category) + ".json"
    @pictures = Array.new
    @category.pictures.each do |pic|
      all_descriptions = {}
      pic.pic_descriptions.each do |d|
        if d.language
          all_descriptions[d.language.abbreviation] = d.content
        end
      end  
      @pictures.push({
        id: pic.id,
        title: pic.title,
        author: pic.author,
        descriptions: all_descriptions, # {'EN': EN_content, 'FR': FR_content}
        category_name: pic.category.name,
        pic_url_small: pic.picfile.url(:small),
        pic_url_medium: pic.picfile.url(:medium),
      })
    end
    category_descriptions = {}
    @category.cat_descriptions.each do |d|
      category_descriptions[d.language.abbreviation] = d.content
    end
    @pictures.push(category_descriptions)
    @pictures.push(@category.name)
    @pictures.push(@categories)

    assert_equal @response.body, @pictures.to_json
  end

  test "should get picture detail page" do
    get category_picture_url(@category, @picture)
    assert_redirected_to category_pictures_url(@category)
  end

  # new picture
  test "unauthenticated user should be redirected to login url when new picture" do
    get new_category_picture_url(@category)
    assert_redirected_to login_url
    follow_redirect!
    assert_equal 'You need to be logged in for this action.', flash[:danger]
  end

  test "authenticated non-admin user should be redirected to root_url when new picture" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get new_category_picture_url(@category)
    assert_redirected_to root_url
    follow_redirect!
    assert_equal 'Unauthorized action.', flash[:danger]
  end

  test "authenticated admin user should get new picture" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get new_category_picture_url(@category)
    assert_response :success
  end

  # create
  test "authenticated admin user should be able to create a picture" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    assert_difference('Picture.count') do
      post category_pictures_url(@category),
        params: { picture: { id: 3, # the 2 fixtures already have id=1 and id=2
                              title: 'new picture',
                              author: 'EG',
                              category_id: @category.id,
                              picfile: fixture_file_upload('files/test_pict.jpg', 'image/jpg') }}
    end
    @picture = Picture.find(3)
    assert_redirected_to edit_category_picture_url(@category, @picture)
    follow_redirect!
    assert_equal 'Picture was successfully created.', flash[:success]
  end

  # edit
  test "unauthenticated user should be redirected to login when get edit picture" do
    get edit_category_picture_url(@category, @picture)
    assert_redirected_to login_url
    follow_redirect!
    assert_equal 'You need to be logged in for this action.', flash[:danger]
  end

  test "authenticated non-admin user should be redirected to root when get edit picture" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get edit_category_picture_url(@category, @picture)
    assert_redirected_to root_url
    follow_redirect!
    assert_equal 'Unauthorized action.', flash[:danger]
  end

  test "authenticated admin user should get edit picture" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get edit_category_picture_url(@category, @picture)
    assert_response :success
  end

  # update
  test "unauthenticated user should be redirected to login when patch update picture" do
    patch category_picture_url(@category, @picture), params: { picture: { title: 'new title', author: 'EG', category_id: @category.id } }
    assert_redirected_to login_url
    follow_redirect!
    assert_equal 'You need to be logged in for this action.', flash[:danger]
  end

  test "authenticated non-admin user should be redirected to root when patch update picture" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    patch category_picture_url(@category, @picture), params: { picture: { title: 'new title', author: 'EG', category_id: @category.id } }
    assert_redirected_to root_url
    follow_redirect!
    assert_equal 'Unauthorized action.', flash[:danger]
  end

  test "authenticated admin user should be able to update a picture" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    patch category_picture_url(@category, @picture), 
      params: { picture: { title: 'new title', author: 'EG', category_id: @category.id } }
    assert :found
    assert_redirected_to category_pictures_url(@category)
    assert_equal 'Picture was successfully updated.', flash[:success]
  end

  # destroy
  test "unauthenticated user should be redirected to login when destroy picture" do
    assert_no_difference('Picture.count') do
      delete category_picture_url(@category, @picture)
    end
    assert_redirected_to login_url
    follow_redirect!
    assert_equal 'You need to be logged in for this action.', flash[:danger]
  end

  test "authenticated non-admin user should be redirected to login when destroy picture" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    assert_no_difference('Picture.count') do
      delete category_picture_url(@category, @picture)
    end
    assert_redirected_to root_url
    follow_redirect!
    assert_equal 'Unauthorized action.', flash[:danger]
  end

  test "authenticated admin user should be able to destroy a picture" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    assert_difference('Picture.count', -1) do
      delete category_picture_url(@category, @picture)
    end
    assert :found
    assert_redirected_to category_pictures_url(@category)
    assert_equal 'Picture was destroyed.', flash[:danger]
  end

end
