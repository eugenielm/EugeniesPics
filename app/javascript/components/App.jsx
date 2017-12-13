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


class App extends React.Component {
  
  componentWillMount() {
    this.setState({langPref: ''});
    this.updateLangPref = this.updateLangPref.bind(this);
  }

  updateLangPref(lang) {
    this.setState({langPref: lang});
  }

  render() {    
    return (
      <Router>
        <div id="app-container">
          
          <Route path="/" render={(props2) => <Navibar {...this.props} {...props2} />} />
          { this.props.flash_danger.length > 0 ? (<NoticeDanger flash_danger={this.props.flash_danger} />) : null }
          { this.props.flash_info.length > 0 ? (<NoticeInfo flash_info={this.props.flash_info} />) : null }
          { this.props.flash_success.length > 0 ? (<NoticeSuccess flash_success={this.props.flash_success} />) : null }
          
          <Switch>

            <Route exact path="/" component={HomePage}/>
            <Route exact path="/index" component={HomePage}/>} />
            <Route exact path="/about" render={(props2) => <AboutPage {...this.props} {...props2} langPref={this.state.langPref} updateLangPref={this.updateLangPref}/>} />

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
          </Switch>
          
          <Route path="/" component={Footer} />
        
        </div>
      </Router>
    )
  }
};

export default App;