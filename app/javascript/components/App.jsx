import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navibar from './Navibar';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import CategoriesIndex from './CategoriesIndex';
import CategoryForm from './CategoryForm';
import PicturesIndex from './PicturesIndex';
import PictureForm from './PictureForm';
import LoginForm from './LoginForm';
import UsersIndex from './UsersIndex';
import UserForm from './UserForm';
import UserDetails from './UserDetails';
import NoticeInfo from './NoticeInfo';
import NoticeDanger from './NoticeDanger';
import NoticeSuccess from './NoticeSuccess';
import Footer from './Footer';
import Languages from './Languages';
import LanguageForm from './LanguageForm';
import Presentations from './Presentations';
import PresentationForm from './PresentationForm';
import CatDescriptionForm from './CatDescriptionForm';
import PicDescriptionForm from './PicDescriptionForm';
import SettingForm from './SettingForm';
import createBrowserHistory from 'history/createBrowserHistory';


class App extends React.Component {
  
      componentWillMount() {
            this.mainTheme = this.mainTheme.bind(this);
            var initialSettings = this.mainTheme(this.props, null);
            var initialSettingsCopy = Object.assign({}, initialSettings);
            this.setState({
                  mainSettings: initialSettings,
                  previewSettings: initialSettingsCopy,
                  previewing: false,
                  });
            this.updatePreviewSettings = this.updatePreviewSettings.bind(this);
            this.updatePreviewMode = this.updatePreviewMode.bind(this);
            this.updateLangPref = this.updateLangPref.bind(this);
            this.reinitializePreviewSettings = this.reinitializePreviewSettings.bind(this);
      }

      mainTheme(props, settings) {
            if (settings) {
                  return {
                        backgroundImage: screen.width < 600 || screen.height < 600 ? settings.background_url_small 
                                                                                   : settings.background_url_medium,
                        backgroundImageName: settings.background_name,
                        backgroundColor: this.props.settingData ? this.props.settingData.background_color 
                                                            : settings.background_color,
                        maintitle: this.props.settingData ? this.props.settingData.maintitle 
                                                      : settings.maintitle,
                        subtitle: this.props.settingData ? this.props.settingData.subtitle 
                                                      : settings.subtitle, 
                        navbarcolor: this.props.settingData ? this.props.settingData.navbarcolor 
                                                            : settings.navbarcolor,
                        navbarfont: this.props.settingData ? this.props.settingData.navbarfont 
                                                                  : settings.navbarfont,
                        settingId: settings.id,
                        idPicture: screen.width < 600 || screen.height < 600 ? settings.id_picture_url_small
                                                                              : settings.id_picture_url_medium,
                        idPictureName: settings.id_picture_name,
                        langPref: (typeof(Storage) !== "undefined") && (window.localStorage.getItem("langPref")) ? 
                                    window.localStorage.getItem("langPref") : '',
                  }
            } else {
                  return {
                        backgroundImage: null,
                        backgroundImageName: null,
                        backgroundColor: "",
                        maintitle: "",
                        subtitle: "",
                        navbarcolor: "",
                        navbarfont: "",
                        settingId: undefined,
                        idPicture: undefined,
                        idPictureName: undefined,
                        langPref: (typeof(Storage) !== "undefined") && (window.localStorage.getItem("langPref")) ? 
                                    window.localStorage.getItem("langPref") : '',
                  }
            }
      }

      componentDidMount() {
            fetch('/settings.json', {credentials: 'same-origin'})
            .then(function(resp) {
            return resp.json();
            })
            .then(function(settings) {
                  var mountedSettings = this.mainTheme(this.props, settings);
                  var mountedSettingsPreview = Object.assign({
                        originalBackgroundImage: mountedSettings.backgroundImage,
                        originalBackgroundImageName: mountedSettings.backgroundImageName,
                        originalIdPicture: mountedSettings.idPicture,
                        originalIdPictureName: mountedSettings.idPictureName,
                  }, mountedSettings);
                  this.setState({
                        mainSettings: mountedSettings,
                        previewSettings: mountedSettingsPreview,
                  });
            }.bind(this))
      }

      updatePreviewSettings(setting) {            
            let previewSettings = this.state.previewSettings;
            previewSettings[setting[0]] = setting[1];
            this.setState({ previewSettings });
      }

      updatePreviewMode(bool) {
            this.setState({ previewing: bool });
      }

      reinitializePreviewSettings() {
            let mainSettings = this.state.mainSettings;
            let previewSettings = Object.assign({
                  originalBackgroundImage: mainSettings.backgroundImage,
                  originalBackgroundImageName: mainSettings.backgroundImageName,
                  originalIdPicture: mainSettings.idPicture,
                  originalIdPictureName: mainSettings.idPictureName,
            }, mainSettings);
            this.setState({ previewSettings });
      }

      updateLangPref(lang) {
            if (typeof(Storage) !== "undefined") {
                  window.localStorage.setItem("langPref", lang);
            }
            let mainSettings = this.state.mainSettings;
            mainSettings.langPref = lang;
            this.setState({ mainSettings });
      }

      render() {
            const history = createBrowserHistory();
            const mainBackgroundStyle = this.state.mainSettings["backgroundImage"] ?
                                          { backgroundImage: "url(" + this.state.mainSettings["backgroundImage"] + ")" }
                                          : { backgroundColor: this.state.mainSettings["backgroundColor"] || "#eeeeee" };
            const previewBackgroundStyle = this.state.previewSettings["backgroundImage"] ?
                                                { backgroundImage: "url(" + this.state.previewSettings["backgroundImage"] + ")" }
                                                : { backgroundColor: this.state.previewSettings["backgroundColor"] || "#eeeeee" };
            const backgroundStyle = this.state.previewing ? previewBackgroundStyle : mainBackgroundStyle;
            
            return (
                  <Router history={history}>

                  <div id="app-container" style={backgroundStyle}>
          
                  <Route path="/" render={(props2) => <Navibar {...this.props} 
                                                               {...props2}                                                                
                                                               settings={this.state.previewing ? 
                                                                        this.state.previewSettings
                                                                        : this.state.mainSettings} /> } />

                  { this.props.flashDanger.length > 0 ? (<NoticeDanger flashDanger={this.props.flashDanger} />) : null }
                  { this.props.flashInfo.length > 0 ? (<NoticeInfo flashInfo={this.props.flashInfo} />) : null }
                  { this.props.flashSuccess.length > 0 ? (<NoticeSuccess flashSuccess={this.props.flashSuccess} />) : null }
                  
                  <Switch>

                        <Route exact path="/" render={(props2) => <HomePage {...this.props} {...props2} /> } />

                        <Route exact path="/index" render={(props2) => <HomePage {...this.props} {...props2} /> } />

                        <Route exact path="/about" render={(props2) => <AboutPage {...this.props} 
                                                                                  {...props2} 
                                                                                  idPicture={this.state.mainSettings.idPicture}
                                                                                  langPref={this.state.mainSettings.langPref}
                                                                                  updateLangPref={this.updateLangPref} /> } />

                        <Route exact path="/categories" 
                               render={(props2) => this.props.categoryErrors ? (<CategoryForm {...this.props} {...props2}/>) 
                                                                              : (<CategoriesIndex {...this.props} {...props2} />) } />

                        <Route exact path="/categories/new" 
                               render={(props2) => <CategoryForm {...this.props} 
                                                                 {...props2} /> } />

                        <Route exact path="/categories/:category_id" 
                               render={(props2) => <CategoryForm {...this.props} {...props2} /> } />

                        <Route exact path="/categories/:category_id/edit" 
                               render={(props2) => <CategoryForm {...this.props} {...props2} /> } />
                        
                        <Route exact path="/categories/:category_id/cat_descriptions" 
                               render={(props2) => this.props.catDescriptionErrors ? 
                                                      <CatDescriptionForm {...this.props} {...props2} />
                                                      : null } />
                        
                        <Route exact path="/categories/:category_id/cat_descriptions/new" 
                               render={(props2) => <CatDescriptionForm {...this.props} {...props2} /> } />

                        <Route exact path="/categories/:category_id/cat_descriptions/:cat_description_id/edit" 
                               render={(props2) => <CatDescriptionForm {...this.props} {...props2} /> } />

                        <Route exact path="/categories/:category_id/cat_descriptions/:cat_description_id" 
                               render={(props2) => this.props.catDescriptionErrors ? 
                                                      <CatDescriptionForm {...this.props} {...props2} />
                                                      : null } />

                        <Route exact path="/categories/:category_id/pictures" 
                               render={(props2) => this.props.pictureErrors ? 
                                                      <PictureForm {...this.props} {...props2} /> 
                                                      : <PicturesIndex langPref={this.state.mainSettings.langPref} 
                                                                        updateLangPref={this.updateLangPref} 
                                                                        {...this.props} {...props2} /> } />

                        <Route exact path="/categories/:category_id/pictures/new" 
                               render={(props2) => <PictureForm {...this.props} {...props2} /> } />

                        <Route exact path="/categories/:category_id/pictures/:picture_id/edit" 
                               render={(props2) => <PictureForm {...this.props} {...props2} /> } />

                        <Route exact path="/categories/:category_id/pictures/:picture_id" 
                               render={(props2) => this.props.pictureErrors ? 
                                                      <PictureForm {...this.props} {...props2} /> 
                                                      : <PicturesIndex langPref={this.state.mainSettings.langPref} 
                                                                        {...this.props} {...props2} /> } />
                        
                        <Route exact path="/categories/:category_id/pictures/:picture_id/pic_descriptions" 
                               render={(props2) => this.props.picDescriptionErrors ? 
                                                      <PicDescriptionForm {...this.props} {...props2} /> 
                                                      : <PictureForm langPref={this.state.mainSettings.langPref} 
                                                                     {...this.props} {...props2} /> } />

                        <Route exact path="/categories/:category_id/pictures/:picture_id/pic_descriptions/new" 
                               render={(props2) => <PicDescriptionForm {...this.props} {...props2} /> } />

                        <Route exact path="/categories/:category_id/pictures/:picture_id/pic_descriptions/:pic_description_id/edit" 
                               render={(props2) => <PicDescriptionForm {...this.props} {...props2} /> } />

                        <Route exact path="/categories/:category_id/pictures/:picture_id/pic_descriptions/:pic_description_id"
                               render={(props2) => this.props.picDescriptionErrors ? 
                                                      <PicDescriptionForm {...this.props} {...props2} />
                                                      : null } />

                        <Route path="/login" render={(props2) => <LoginForm {...this.props} {...props2} /> } />

                        <Route exact path="/languages" 
                               render={(props2) => this.props.languageErrors ? 
                                                      <LanguageForm {...this.props} {...props2} /> 
                                                      : <Languages {...this.props} {...props2} /> } />

                        <Route exact path="/languages/new" 
                               render={(props2) => <LanguageForm {...this.props} {...props2} /> } />

                        <Route exact path="/languages/:language_id" 
                               render={(props2) => this.props.languageErrors ?
                                                      <LanguageForm {...this.props} {...props2} /> 
                                                      : null } />

                        <Route exact path="/languages/:language_id/edit" 
                               render={(props2) => <LanguageForm {...this.props} {...props2} /> } />
                        
                        <Route exact path="/presentations" 
                               render={(props2) => this.props.presentationErrors ? 
                                                      <PresentationForm {...this.props} {...props2} />
                                                      : <Presentations {...this.props} {...props2} /> } />

                        <Route exact path="/presentations/new" 
                               render={(props2) => <PresentationForm {...this.props} {...props2} /> } />

                        <Route exact path="/presentations/:presentation_id" 
                               render={(props2) => this.props.presentationErrors ? 
                                                      <PresentationForm {...this.props} {...props2} /> 
                                                      : <Presentations {...this.props} {...props2} /> } />

                        <Route exact path="/presentations/:presentation_id/edit" 
                               render={(props2) => <PresentationForm {...this.props} {...props2} /> } />          
                        
                        <Route exact path="/users" 
                               render={(props2) => this.props.userErrors ? 
                                                      <UserForm {...this.props} {...props2} />
                                                      : <UsersIndex {...this.props} {...props2} /> } />

                        <Route exact path="/users/new" render={(props2) => <UserForm {...this.props} {...props2} /> } />

                        <Route exact path="/signup" render={(props2) => <UserForm {...this.props} {...props2} /> } />

                        <Route exact path="/users/:user_id/edit" render={(props2) => <UserForm {...this.props} {...props2} /> } />

                        <Route exact path="/users/:user_id" 
                               render={(props2) => this.props.userErrors ? 
                                                      <UserForm {...this.props} {...props2} />
                                                      : <UserDetails {...this.props} {...props2} /> } />

                        <Route path="/settings" render={(props2) => <SettingForm {...this.props} {...props2}
                                                                                 updatePreviewMode={this.updatePreviewMode} 
                                                                                 settings={this.state.previewSettings}
                                                                                 updatePreviewSettings={this.updatePreviewSettings}
                                                                                 reinitializePreviewSettings={this.reinitializePreviewSettings} /> } />
                  
                  </Switch>
                  
                  <Route path="/" component={Footer} />
            
            </div>
            </Router>
    )
  }
};

export default App;