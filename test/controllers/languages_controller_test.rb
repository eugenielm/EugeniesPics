require 'test_helper'

class LanguagesControllerTest < ActionDispatch::IntegrationTest

  setup do
    @language = languages(:one)
    @user_non_admin = users(:one)
    @user_admin = users(:two)
  end

  ####################### unauthenticated user ######################

  # index
  test "unauthenticated user shouldn't get the languages index" do
    get languages_url
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  # show
  test "unauthenticated user shouldn't get the show action" do
    get language_url(@language)
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  # new
  test "unauthenticated user shouldn't get the new action" do
    get new_language_url
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  # create
  test "unauthenticated user shouldn't be able to create a language" do
    post languages_url, params: { language: { name: 'new language name', abbreviation: 'NL' } }
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  # edit
  test "unauthenticated user shouldn't get the edit action" do
    get edit_language_url(@language)
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  # update
  test "unauthenticated user shouldn't be able to update a language" do
    patch language_url(@language), params: { language: { name: 'updated language name' } }
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  # destroy
  test "unauthenticated user shouldn't be able to destroy a language" do
    assert_no_difference('Language.count') do
      delete language_url(@language)
    end
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end


  ################ non superadmin authenticated user ################

  #index
  test "non superadmin user shouldn't get the languages index" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get languages_url
    assert_response :found
    assert_redirected_to root_url
    assert_equal "Unauthorized action.", flash[:danger]
  end

  # new
  test "non superadmin user shouldn't get the new action" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get new_language_url
    assert_response :found
    assert_redirected_to root_url
    assert_equal "Unauthorized action.", flash[:danger]
  end

  # edit
  test "non superadmin user shouldn't get the edit action" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get edit_language_url(@language)
    assert_response :found
    assert_redirected_to root_url
    assert_equal "Unauthorized action.", flash[:danger]
  end

  # create
  test "non superadmin user shouldn't be able to create a language" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    post languages_url, params: { language: { name: 'new language name', abbreviation: 'NL' } }
    assert_response :found
    assert_redirected_to root_url
    assert_equal "Unauthorized action.", flash[:danger]
  end

  # update
  test "non superadmin user shouldn't be able to update a language" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    patch language_url(@language), params: { language: { name: 'updated language name' } }
    assert_response :found
    assert_redirected_to root_url
    assert_equal "Unauthorized action.", flash[:danger]
  end

  # destroy
  test "non superadmin user shouldn't be able to destroy a language" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    assert_no_difference('Language.count') do
      delete language_url(@language)
    end
    assert_response :found
    assert_redirected_to root_url
    assert_equal "Unauthorized action.", flash[:danger]
  end
  

  ######################### superadmin user #########################

  #index
  test "superadmin user should be allowed to get the languages index" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get languages_url
    assert_response :success
    
    get languages_url + ".json"
    assert_equal @response.body, [
        {id: 1, name: "MyLang1", abbreviation: "EN", 
        created_at: languages(:one).created_at, updated_at: languages(:one).updated_at},
        {id: 2, name: "MyLang2", abbreviation: "FR", 
        created_at: languages(:two).created_at, updated_at: languages(:two).updated_at},
        {id: 3, name: "MyLang3", abbreviation: "ES", 
        created_at: languages(:three).created_at, updated_at: languages(:three).updated_at}
    ].to_json
  end

  # new
  test "superadmin user should get the new action" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get new_language_url
    assert_response :success
  end

  # edit
  test "superadmin user should get the edit action" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get edit_language_url(@language)
    assert_response :success
  end

  # create
  test "superadmin user should be allowed to create a language" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}    
    assert_difference('Language.count') do
      post languages_url, params: { language: { name: 'MyLang4', abbreviation: 'NL4' } }
    end
    assert_response :found
    assert_redirected_to languages_url
    assert_equal 'MyLang4 language was successfully created.', flash[:success]
  end

  # create with errors and redirection to category description edit
  test "superadmin user should be properly redirected after failing to create a language" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}    
    assert_no_difference('Language.count') do
      post "/languages?redirect_to_cat_desc_edit=%2Fcategories%2F1%2Fedit", 
           params: { language: { name: 'MyLang3', abbreviation: 'ES2' } }
    end
    assert_response :found
    assert_redirected_to new_language_url + "?redirect_to_cat_desc_edit=%2Fcategories%2F1%2Fedit"
  end

  # update
  test "superadmin user should be allowed to update a language" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    assert_no_difference('Language.count') do
      patch language_url(@language), params: { language: { name: 'NewLang' } }
    end
    assert_response :found
    assert_redirected_to languages_url
    assert_equal 'NewLang language was successfully updated.', flash[:success]
  end

  # update with errors and redirection to category description edit
  test "superadmin user should be properly redirected after failing to update a language" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    # patch language_url(@language), params: { language: { name: 'NewLang' } }
    patch "/languages/" + @language.id.to_s + "?redirect_to_cat_desc_edit=%2Fcategories%2F1%2Fedit", 
          params: { language: { name: 'MyLang2' } }
    assert_response :found
    assert_redirected_to "/languages/" + @language.id.to_s + "/edit?redirect_to_cat_desc_edit=%2Fcategories%2F1%2Fedit"
  end

  # destroy
  test "superadmin user should be allowed to destroy a language" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    assert_difference('Language.count', -1) do
        delete language_url(@language)
    end
    assert_response :found
    assert_redirected_to languages_url
    assert_equal 'MyLang1 language was destroyed.', flash[:danger]
  end

end