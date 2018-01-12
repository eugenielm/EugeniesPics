require 'test_helper'

class SettingsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @setting = settings(:Setting1)
    @user_non_admin = users(:one)
    @user_admin = users(:two)
  end

  
  #################### index ####################
  test "unauthenticated user should be redirected to login_url when requesting the settings index" do
    get settings_url
    assert_redirected_to login_path
    follow_redirect!
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  test "authenticated user should be properly redirected when requesting the settings index" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get settings_url
    assert_redirected_to edit_setting_url(@setting)

    delete setting_url(@setting)
    get settings_url
    assert_redirected_to new_setting_url
  end

  test "any user should be able to get json data from the settings index" do
    get settings_url + ".json"
    @settings = { id: @setting.id,
                  background_url: @setting.background.url,
                  background_name: @setting.background_file_name,
                  background_color: @setting.background_color,
                  maintitle: @setting.maintitle,
                  subtitle: @setting.subtitle,
                  navbarcolor: @setting.navbarcolor,
                  navbarfont: @setting.navbarfont,
                  id_picture_url: @setting.id_picture.url,
                  id_picture_name: @setting.id_picture_file_name,
                }
    assert_equal @response.body, @settings.to_json
  end


  #################### show ####################
  test "unauthenticated user should be redirected to the login page when requesting a setting instance page" do
    get setting_url(@setting)
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  test "authenticated user should be properly redirected when requesting a setting instance page" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    get settings_url
    assert_redirected_to edit_setting_url(@setting)

    delete setting_url(@setting)
    get settings_url
    assert_redirected_to new_setting_url
  end

  test "any authenticated user should be properly redirected when requesting a setting instance page" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get setting_url(@setting)
    assert_redirected_to edit_setting_url(@setting)
    
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    delete setting_url(@setting)
    assert_redirected_to new_setting_url
  end


  #################### new ####################
  test "unauthenticated user should be properly redirected when requesting the new setting page" do
    get new_setting_url
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  test "authenticated user should be redirected when requesting the new setting page while there's already one Setting instance" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get new_setting_url
    assert_redirected_to edit_setting_url(@setting)
  end

  test "authenticated user should be allowed to get the new setting page if there's no Setting instance in the db" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    delete setting_url(@setting)
    get new_setting_url
    assert :success
  end


  #################### create ####################
  test "unauthenticated user should be properly redirected when trying to create a new Setting instance" do
    assert_no_difference('Setting.count') do
      post settings_url,
        params: { setting: { maintitle: "maintitle2",
                             subtitle: "subtitle2",
                             navbarcolor: "#111111",
                             navbarfont: "#dddddd",
                             background_color: "#cccccc"}
                }
    end
    assert_redirected_to login_path
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  test "authenticated user should be properly redirected when trying to create a new Setting instance while there's already one in the db" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    assert_no_difference('Setting.count') do
      post settings_url,
        params: { setting: { maintitle: "maintitle2",
                  subtitle: "subtitle2",
                  navbarcolor: "#111111",
                  navbarfont: "#dddddd",
                   background_color: "#cccccc"}
                }
    end
    assert_redirected_to edit_setting_url(@setting)
  end

  test "authenticated user should be allowed to create a new Setting instance when there's none in the db" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    delete setting_url(@setting)
    assert_difference('Setting.count', 1) do
      post settings_url,
        params: { setting: { maintitle: "maintitle2",
                             subtitle: "subtitle2",
                             navbarcolor: "#111111",
                             navbarfont: "#dddddd",
                             background_color: "#cccccc"}
                }
    end
    assert_redirected_to edit_setting_url(Setting.last)
    assert_equal 'Your settings were successfully submitted.', flash[:success]
  end

  test "authenticated user should be properly redirected when submitting improper params" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    delete setting_url(@setting)
    assert_no_difference('Setting.count') do
      post settings_url,
        params: { setting: { maintitle: 2,
                             subtitle: "subtitle2",
                             navbarcolor: "#111111",
                             navbarfont: "#dddddd",
                             background_color: "#cccccc"}
                }
    end
    assert_template :new
    assert :unprocessable_entity
  end


  #################### edit ####################
  test "unauthenticated user should be properly redirected when requesting the edit setting page" do
    get edit_setting_url(@setting)
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  test "any authenticated user should be allowed to get the setting edit page" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    get edit_setting_url(@setting)
    assert :success
  end


  #################### update ####################
  test "unauthenticated user shouldn't be allowed to update a Setting instance" do
    patch setting_url(@setting), params: { setting: { maintitle: "maintitle2",
                                                      subtitle: "subtitle2",
                                                      navbarcolor: "#111111",
                                                      navbarfont: "#dddddd",
                                                      background_color: "#cccccc"}
                                         }
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  test "authenticated user should be allowed to update a Setting instance" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    patch setting_url(@setting), params: { setting: { maintitle: "maintitle2",
                                                      subtitle: "subtitle2",
                                                      navbarcolor: "#111111",
                                                      navbarfont: "#dddddd",
                                                      background_color: "#cccccc"}
                                         }
    assert :ok
    assert_equal 'Your settings were successfully updated.', flash[:success]
  end

  test "authenticated user should be properly redirected when updating a Setting instance with improper params" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    patch setting_url(@setting), params: { setting: { maintitle: 2,
                                                      subtitle: "subtitle2",
                                                      navbarcolor: "#111111",
                                                      navbarfont: "#dddddd",
                                                      background_color: "#cccccc"}
                                         }
    assert :unprocessable_entity
    assert_template :edit
  end


  #################### destroy ####################
  test "unauthenticated user shouldn't be allowed to destroy a Setting" do
    assert_no_difference('Setting.count') do
      delete setting_url(@setting)
    end
    assert_redirected_to login_url
    assert_equal "You need to be logged in for this action.", flash[:danger]
  end

  test "authenticated non admin user shouldn't be allowed to destroy a Setting" do
    post login_url, params: { session: { email: @user_non_admin.email, password: "nonadminpassword" }}
    assert_no_difference('Setting.count') do
      delete setting_url(@setting)
    end
    assert_redirected_to root_url
    assert_equal "You don't have the required permissions for this action.", flash[:danger]
  end

  test "authenticated admin user should be allowed to destroy a Setting" do
    post login_url, params: { session: { email: @user_admin.email, password: "adminpassword" }}
    assert_difference('Setting.count', -1) do
      delete setting_url(@setting)
    end
    assert_redirected_to new_setting_url
    assert_equal "Your settings were destroyed.", flash[:danger]
  end

end
