import React from 'react';
import ReactDOM from 'react-dom';
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
    this.setState({langPref: '',
                   backgroundImage: null,
                   backgroundImageName: null,
                   backgroundColor: "",
                   maintitle: "",
                   subtitle: "",
                   navbarcolor: "",
                   navbarfont: "",
                   settingId: undefined,
                   idPicture: undefined,
                   idPictureName: undefined});
    this.updateLangPref = this.updateLangPref.bind(this);
    this.updateNavbarcolor = this.updateNavbarcolor.bind(this);
    this.updateNavbarfont = this.updateNavbarfont.bind(this);
    this.updateBackgroundColor = this.updateBackgroundColor.bind(this);
    this.updateMaintitle = this.updateMaintitle.bind(this);
    this.updateSubtitle = this.updateSubtitle.bind(this);
    this.updateBackgroundImage = this.updateBackgroundImage.bind(this);
    this.updateBackgroundImageName = this.updateBackgroundImageName.bind(this);
    this.updateIdPicture = this.updateIdPicture.bind(this);
    this.updateIdPictureName = this.updateIdPictureName.bind(this);
  }

  componentDidMount() {
      fetch('/settings.json', {credentials: 'same-origin'})
      .then(function(resp) {
      return resp.json();
      })
      .then(function(settings) {
            this.setState({ backgroundImage: settings.background_url,
                            backgroundImageName: settings.background_name,
                            backgroundColor: this.props.setting_data ? this.props.setting_data.background_color 
                                                                     : settings.background_color,
                            maintitle: this.props.setting_data ? this.props.setting_data.maintitle 
                                                               : settings.maintitle,
                            subtitle: this.props.setting_data ? this.props.setting_data.subtitle 
                                                              : settings.subtitle, 
                            navbarcolor: this.props.setting_data ? this.props.setting_data.navbarcolor 
                                                                 : settings.navbarcolor,
                            navbarfont: this.props.setting_data ? this.props.setting_data.navbarfont 
                                                                : settings.navbarfont,
                            settingId: settings.id,
                            idPicture: settings.id_picture_url,
                            idPictureName: settings.id_picture_name
                          })
      }.bind(this))
  }

  updateLangPref(lang) {
    this.setState({langPref: lang});
  }

  updateNavbarcolor(col) {
      this.setState({navbarcolor: col});
  }

  updateNavbarfont(col) {
      this.setState({navbarfont: col});
  }

  updateBackgroundColor(col) {
      this.setState({backgroundColor: col});
  }

  updateMaintitle(newTitle) {
      this.setState({maintitle: newTitle});
  }

  updateSubtitle(newSubtitle) {
      this.setState({subtitle: newSubtitle});
  }

  updateBackgroundImage(newImg) {
      this.setState({backgroundImage: newImg});
  }

  updateBackgroundImageName(newName) {
      this.setState({backgroundImageName: newName});
  }

  updateIdPicture(newImg) {
      this.setState({idPicture: newImg});
  }

  updateIdPictureName(newName) {
      this.setState({idPictureName: newName});
  }

  render() {
    const history = createBrowserHistory();
    const backgroundStyle = this.state.backgroundImage ? { backgroundImage: "url(" + this.state.backgroundImage + ")" }
                                                       : { backgroundColor: this.state.backgroundColor || "#eeeeee" }
    return (
      <Router history={history}>

         <div id="app-container" style={backgroundStyle}>
          
          <Route path="/" render={(props2) => <Navibar {...this.props} {...props2} 
                                                       maintitle={this.state.maintitle}
                                                       subtitle={this.state.subtitle}
                                                       navbarcolor={this.state.navbarcolor}
                                                       navbarfont={this.state.navbarfont}
                                                       settingId={this.state.settingId} />} />
          { this.props.flash_danger.length > 0 ? (<NoticeDanger flash_danger={this.props.flash_danger} />) : null }
          { this.props.flash_info.length > 0 ? (<NoticeInfo flash_info={this.props.flash_info} />) : null }
          { this.props.flash_success.length > 0 ? (<NoticeSuccess flash_success={this.props.flash_success} />) : null }
          
          <Switch>

            <Route exact path="/" component={HomePage}/>
            <Route exact path="/index" component={HomePage}/>} />
            <Route exact path="/about" render={(props2) => <AboutPage {...this.props} {...props2} 
                                                                      langPref={this.state.langPref} 
                                                                      updateLangPref={this.updateLangPref}
                                                                      idPicture={this.state.idPicture}/>}
            />

            <Route exact path="/categories" 
                  render={(props2) => this.props.category_errors ? (<CategoryForm {...this.props} {...props2} />) 
                                                                 : (<CategoriesIndex {...this.props} {...props2} />)} />
            <Route exact path="/categories/new" 
                  render={(props2) => <CategoryForm {...this.props} {...props2} />}/>
            <Route exact path="/categories/:category_id" 
                  render={(props2) => <CategoryForm {...this.props} {...props2} />} />
            <Route exact path="/categories/:category_id/edit" 
                  render={(props2) => <CategoryForm {...this.props} {...props2} />} />
            
            <Route exact path="/categories/:category_id/cat_descriptions" 
                  render={(props2) => this.props.cat_description_errors ? (<CatDescriptionForm {...this.props} {...props2} />) 
                                                                        : null } />
            <Route exact path="/categories/:category_id/cat_descriptions/new" 
                  render={(props2) => <CatDescriptionForm {...this.props} {...props2} />} />
            <Route exact path="/categories/:category_id/cat_descriptions/:cat_description_id/edit" 
                  render={(props2) => <CatDescriptionForm {...this.props} {...props2} />} />
            <Route exact path="/categories/:category_id/cat_descriptions/:cat_description_id" 
                  render={(props2) => this.props.cat_description_errors ? (<CatDescriptionForm {...this.props} {...props2} />) 
                                                                        : null } />

            <Route exact path="/categories/:category_id/pictures" 
                  render={(props2) => this.props.picture_errors ? (<PictureForm {...this.props} {...props2} />) 
                                                                : (<PicturesIndex langPref={this.state.langPref} updateLangPref={this.updateLangPref} 
                                                                                  {...this.props} {...props2} />)} />
            <Route exact path="/categories/:category_id/pictures/new" 
                  render={(props2) => <PictureForm {...this.props} {...props2} />} />
            <Route exact path="/categories/:category_id/pictures/:picture_id/edit" 
                  render={(props2) => <PictureForm {...this.props} {...props2} />} />
            <Route exact path="/categories/:category_id/pictures/:picture_id" 
                  render={(props2) => this.props.picture_errors ? (<PictureForm {...this.props} {...props2} />) 
                                                                : (<PicturesIndex langPref={this.state.langPref} updateLangPref={this.updateLangPref} 
                                                                                  {...this.props} {...props2} />)} />
            
            <Route exact path="/categories/:category_id/pictures/:picture_id/pic_descriptions" 
                  render={(props2) => this.props.pic_description_errors ? (<PicDescriptionForm {...this.props} {...props2} />) 
                                                                        : (<PictureForm langPref={this.state.langPref} updateLangPref={this.updateLangPref}
                                                                                        {...this.props} {...props2} />)} />
            <Route exact path="/categories/:category_id/pictures/:picture_id/pic_descriptions/new" 
                  render={(props2) => <PicDescriptionForm {...this.props} {...props2} />} />
            <Route exact path="/categories/:category_id/pictures/:picture_id/pic_descriptions/:pic_description_id/edit" 
                  render={(props2) => <PicDescriptionForm {...this.props} {...props2} />} />
            <Route exact path="/categories/:category_id/pictures/:picture_id/pic_descriptions/:pic_description_id"
                  render={(props2) => this.props.pic_description_errors ? (<PicDescriptionForm {...this.props} {...props2} />) 
                                                                        : null} />

            <Route path="/login" render={(props2) => <LoginForm {...this.props} {...props2} />} />

            <Route exact path="/languages" 
                  render={(props2) => this.props.language_errors ? (<LanguageForm {...this.props} {...props2} />) 
                                                                 : (<Languages {...this.props} {...props2} />)} />
            <Route exact path="/languages/new" 
                  render={(props2) => <LanguageForm {...this.props} {...props2} />} />
            <Route exact path="/languages/:language_id" 
                  render={(props2) => this.props.language_errors ? (<LanguageForm {...this.props} {...props2} />) 
                                                                 : null} />
            <Route exact path="/languages/:language_id/edit" 
                  render={(props2) => <LanguageForm {...this.props} {...props2} />} />
            
            <Route exact path="/presentations" 
                  render={(props2) => this.props.presentation_errors ? (<PresentationForm {...this.props} {...props2} />) 
                                                                     : (<Presentations {...this.props} {...props2} />) } />
            <Route exact path="/presentations/new" 
                  render={(props2) => <PresentationForm {...this.props} {...props2} />} />
            <Route exact path="/presentations/:presentation_id" 
                  render={(props2) => this.props.presentation_errors ? (<PresentationForm {...this.props} {...props2} />) 
                                                                     : (<Presentations {...this.props} {...props2} />) } />
            <Route exact path="/presentations/:presentation_id/edit" 
                  render={(props2) => <PresentationForm {...this.props} {...props2}/>} />          
            
            <Route exact path="/users" 
                  render={(props2) => this.props.user_errors ? (<UserForm {...this.props} {...props2} />) 
                                                             : (<UsersIndex {...this.props} {...props2} />)} />
            <Route exact path="/users/new" render={(props2) => <UserForm {...this.props} {...props2} /> } />
            <Route exact path="/signup" render={(props2) => <UserForm {...this.props} {...props2} /> } />
            <Route exact path="/users/:user_id/edit" render={(props2) => <UserForm {...this.props} {...props2} /> } />
            <Route exact path="/users/:user_id" 
                   render={(props2) => this.props.user_errors ? (<UserForm {...this.props} {...props2} />) 
                                                              : (<UserDetails {...this.props} {...props2} />)} />

            <Route path="/settings" render={(props2) => <SettingForm {...this.props} {...props2} 
                                                                     backgroundImage={this.state.backgroundImage} 
                                                                     settingId={this.state.settingId}
                                                                     backgroundColor={this.state.backgroundColor}
                                                                     navbarcolor={this.state.navbarcolor}
                                                                     navbarfont={this.state.navbarfont}
                                                                     maintitle={this.state.maintitle}
                                                                     subtitle={this.state.subtitle}
                                                                     backgroundImageName={this.state.backgroundImageName}
                                                                     idPicture={this.state.idPicture}
                                                                     idPictureName={this.state.idPictureName}
                                                                     updateBackgroundColor={this.updateBackgroundColor}
                                                                     updateNavbarcolor={this.updateNavbarcolor}
                                                                     updateNavbarfont={this.updateNavbarfont}
                                                                     updateMaintitle={this.updateMaintitle} 
                                                                     updateSubtitle={this.updateSubtitle}
                                                                     updateBackgroundImage={this.updateBackgroundImage}
                                                                     updateBackgroundImageName={this.updateBackgroundImageName}
                                                                     updateIdPicture={this.updateIdPicture}
                                                                     updateIdPictureName={this.updateIdPictureName} /> } />
          
          </Switch>
          
          <Route path="/" component={Footer} />
        
        </div>
      </Router>
    )
  }
};

export default App;