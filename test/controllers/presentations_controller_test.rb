require 'test_helper'

class PresentationsControllerTest < ActionDispatch::IntegrationTest

  setup do
    @presentation = presentations(:one)
    @user_non_admin = users(:one)
    @user_admin = users(:two)
  end

  ####################### unauthenticated user ######################

  # index
  test "unauthenticated user shouldn't get the presentations index" do
    get presentations_url
    assert_response :found
    assert_redirected_to '/about'

    get presentations_url + ".json"
    assert_equal @response.body, {'EN':["aaaaaaaaaa","MyLang1",1],'FR':["bbbbbbbbb","MyLang2",2]}.to_json
  end

  # show
  test "no user should get the show action" do
    get presentation_url(@presentation)
    assert_response :found
    assert_redirected_to "/about"
  end

  # new
  test "unauthenticated user shouldn't get the new action" do
    get new_presentation_url
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  # edit
  test "unauthenticated user shouldn't get the edit action" do
    get edit_presentation_url(@presentation)
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  # create
  test "unauthenticated user shouldn't get the create action" do
    post presentations_url, params: { presentation: { content: 'new presentation', language_id: 3 } }
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  # update
  test "unauthenticated user shouldn't get the update action" do
    patch presentation_url(@presentation), params: { presentation: { content: 'updated presentation' } }
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  # destroy
  test "unauthenticated user shouldn't get the destroy action" do
    assert_no_difference('Presentation.count') do
      delete presentation_url(@presentation)
    end
    assert_response :found
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end


  ################ non superadmin authenticated user ################

  #index
  test "non superadmin user shouldn't get the presentations index" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get presentations_url
    assert_response :found
    assert_redirected_to '/about'
    
    get presentations_url + ".json"
    assert_equal @response.body, {'EN':["aaaaaaaaaa","MyLang1",1],'FR':["bbbbbbbbb","MyLang2",2]}.to_json
  end

  # new
  test "non superadmin user shouldn't get the new action" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get new_presentation_url
    assert_response :found
    assert_redirected_to root_url
  end

  # edit
  test "non superadmin user shouldn't get the edit action" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get edit_presentation_url(@presentation)
    assert_response :found
    assert_redirected_to root_url
    assert_equal "Unauthorized action.", flash[:danger]
  end

  # create
  test "non superadmin user shouldn't get the create action" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    post presentations_url, params: { presentation: { content: 'new presentation', language_id: 3 } }
    assert_response :found
    assert_redirected_to root_url
    assert_equal "Unauthorized action.", flash[:danger]
  end

  # update
  test "non superadmin user shouldn't get the update action" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    patch presentation_url(@presentation), params: { presentation: { content: 'updated presentation' } }
    assert_response :found
    assert_redirected_to root_url
    assert_equal "Unauthorized action.", flash[:danger]
  end

  # destroy
  test "non superadmin user shouldn't get the destroy action" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    assert_no_difference('Presentation.count') do
      delete presentation_url(@presentation)
    end
    assert_response :found
    assert_redirected_to root_url
    assert_equal "Unauthorized action.", flash[:danger]
  end
  

  ######################### superadmin user #########################

  #index
  test "superadmin user should be allowed to get the presentations index" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get presentations_url
    assert_response :success
    
    get presentations_url + ".json"
    assert_equal @response.body, {'EN':["aaaaaaaaaa","MyLang1",1],'FR':["bbbbbbbbb","MyLang2",2]}.to_json
  end

  # new
  test "superadmin user should get the new action" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get new_presentation_url
    assert_response :success
  end

  # edit
  test "superadmin user should get the edit action" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get edit_presentation_url(@presentation)
    assert_response :success
  end

  # create
  test "superadmin user should be allowed to create a presentation" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}    
    assert_difference('Presentation.count') do
      post presentations_url, params: { presentation: { content: 'new presentation', language_id: 3 } }
    end
    assert_response :found
    assert_redirected_to presentations_url
    assert_equal 'MyLang3 presentation was successfully created.', flash[:success]
  end

  # update
  test "superadmin user should be allowed to update a presentation" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    patch presentation_url(@presentation), params: { presentation: { content: 'updated presentation' } }
    assert_response :found
    assert_redirected_to presentations_url
    assert_equal 'MyLang1 presentation was successfully updated.', flash[:success]
  end

  # destroy
  test "superadmin user should be allowed to destroy a presentation" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    assert_difference('Presentation.count', -1) do
      delete presentation_url(@presentation)
    end
    assert_response :found
    assert_redirected_to presentations_url
    assert_equal 'MyLang1 presentation was successfully destroyed.', flash[:danger]
  end

end