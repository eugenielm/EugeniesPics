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
            <Route exact path="/about" render={() => <AboutPage langPref={this.state.langPref} updateLangPref={this.updateLangPref}/>} />

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
                                                                        : (<HomePage langPref={this.state.langPref} updateLangPref={this.updateLangPref}/>)} />
            <Route exact path="/categories/:category_id/cat_descriptions/new" 
                  render={(props2) => <CatDescriptionForm {...this.props} {...props2} />} />
            <Route exact path="/categories/:category_id/cat_descriptions/:cat_description_id/edit" 
                  render={(props2) => <CatDescriptionForm {...this.props} {...props2} />} />
            <Route exact path="/categories/:category_id/cat_descriptions/:cat_description_id" 
                  render={(props2) => this.props.cat_description_errors ? (<CatDescriptionForm {...this.props} {...props2} />) 
                                                                    : (<HomePage langPref={this.state.langPref} updateLangPref={this.updateLangPref} />)} />

            <Route exact path="/categories/:category_id/pictures" 
                  render={(props2) => this.props.picture_errors ? (<PictureForm {...this.props} {...props2} />) 
                                                                : (<PicturesIndex langPref={this.state.langPref} updateLangPref={this.updateLangPref} {...this.props} {...props2} />)} />
            <Route exact path="/categories/:category_id/pictures/new" 
                  render={(props2) => <PictureForm {...this.props} {...props2} />} />
            <Route exact path="/categories/:category_id/pictures/:picture_id/edit" 
                  render={(props2) => <PictureForm {...this.props} {...props2} />} />
            <Route exact path="/categories/:category_id/pictures/:picture_id" 
                  render={(props2) => props.picture_errors ? (<PictureForm {...this.props} {...props2} />) 
                                                            : (<HomePage langPref={this.state.langPref} updateLangPref={this.updateLangPref} />)} />
            
            <Route exact path="/categories/:category_id/pictures/:picture_id/pic_descriptions" 
                  render={(props2) => this.props.pic_description_errors ? (<PicDescriptionForm {...this.props} {...props2} />) 
                                                                        : (<HomePage langPref={this.state.langPref} updateLangPref={this.updateLangPref} />)} />
            <Route exact path="/categories/:category_id/pictures/:picture_id/pic_descriptions/new" 
                  render={(props2) => <PicDescriptionForm {...this.props} {...props2} />} />
            <Route exact path="/categories/:category_id/pictures/:picture_id/pic_descriptions/:pic_description/edit" 
                  render={(props2) => <PicDescriptionForm {...this.props} {...props2} />} />
            <Route exact path="/categories/:category_id/pictures/:picture_id/pic_descriptions/:pic_descriptions_id"
                  render={(props2) => this.props.pic_description_errors ? (<PicDescriptionForm {...this.props} {...props2} />) 
                                                                        : (<HomePage langPref={this.state.langPref} updateLangPref={this.updateLangPref} />)} />

            <Route path="/login" render={(props2) => <LoginForm {...this.props} {...props2} />} />

            <Route exact path="/languages" 
                  render={(props2) => this.props.language_errors ? (<LanguageForm {...this.props} {...props2} />) 
                                                            : (<Languages {...this.props} {...props2} />)} />
            <Route exact path="/languages/new" 
                  render={(props2) => <LanguageForm {...this.props} {...props2} />} />
            <Route exact path="/languages/:language_id" 
                  render={(props2) => this.props.language_errors ? (<LanguageForm {...this.props} {...props2} />) 
                                                            : (<Languages {...this.props} {...props2} />)} />
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

document.addEventListener('turbolinks:load', () => {
  const csrf_token = document.getElementById('csrf_token') ?
                     document.getElementById('csrf_token').getAttribute('data').split('content=')[2].slice(1, -4) : null;
  
  const category_errors = document.getElementById('category_errors') 
                          && JSON.parse(document.getElementById('category_errors').getAttribute('data')).length > 0 ?
                          JSON.parse(document.getElementById('category_errors').getAttribute('data')) : null;
  const picture_errors = document.getElementById('picture_errors') 
                         && JSON.parse(document.getElementById('picture_errors').getAttribute('data')).length > 0 ?
                         JSON.parse(document.getElementById('picture_errors').getAttribute('data')) : null;
  const user_errors = document.getElementById('user_errors') 
                      && JSON.parse(document.getElementById('user_errors').getAttribute('data')).length > 0 ?
                      JSON.parse(document.getElementById('user_errors').getAttribute('data')) : null;
  const presentation_errors = document.getElementById('presentation_errors') 
                              && JSON.parse(document.getElementById('presentation_errors').getAttribute('data')).length > 0 ?
                              JSON.parse(document.getElementById('presentation_errors').getAttribute('data')) : null;
  const language_errors = document.getElementById('language_errors') 
                          && JSON.parse(document.getElementById('language_errors').getAttribute('data')).length > 0 ?
                          JSON.parse(document.getElementById('language_errors').getAttribute('data')) : null;
  const cat_description_errors = document.getElementById('cat_description_errors') 
                                 && JSON.parse(document.getElementById('cat_description_errors').getAttribute('data')).length > 0 ?
                                 JSON.parse(document.getElementById('cat_description_errors').getAttribute('data')) : null;
  const pic_description_errors = document.getElementById('pic_description_errors') 
                                 && JSON.parse(document.getElementById('pic_description_errors').getAttribute('data')).length > 0 ?
                                 JSON.parse(document.getElementById('pic_description_errors').getAttribute('data')) : null;              
  
  const user_data = document.getElementById('user_data') ?
                    JSON.parse(document.getElementById('user_data').getAttribute('data')) : null;
  const category_data = document.getElementById('category_data') ?
                        JSON.parse(document.getElementById('category_data').getAttribute('data')) : null;
  const picture_data = document.getElementById('picture_data') ?
                       JSON.parse(document.getElementById('picture_data').getAttribute('data')) : null;
  const presentation_data = document.getElementById('presentation_data') ?
                            JSON.parse(document.getElementById('presentation_data').getAttribute('data')) : null;
  const language_data = document.getElementById('language_data') ?
                        JSON.parse(document.getElementById('language_data').getAttribute('data')) : null;
  const cat_description_data = document.getElementById('cat_description_data') ?
                               JSON.parse(document.getElementById('cat_description_data').getAttribute('data')) : null;
  const pic_description_data = document.getElementById('pic_description_data') ?
                               JSON.parse(document.getElementById('pic_description_data').getAttribute('data')) : null;
  
  const flash_info = [];
  document.getElementsByClassName('info') ?
    Array.from(document.getElementsByClassName('info')).map(e => flash_info.push(JSON.parse(e.getAttribute('data')))) : [];
  
  const flash_danger = [];
  document.getElementsByClassName('danger') ?
    Array.from(document.getElementsByClassName('danger')).map(e => flash_danger.push(JSON.parse(e.getAttribute('data')))) : [];

  const flash_success = [];
  document.getElementsByClassName('success') ?
    Array.from(document.getElementsByClassName('success')).map(e => flash_success.push(JSON.parse(e.getAttribute('data')))) : [];

  ReactDOM.render(
    <App user={window.user} 
         token={csrf_token} 
         category_errors={category_errors} 
         picture_errors={picture_errors} 
         user_errors={user_errors} 
         presentation_errors={presentation_errors} 
         language_errors={language_errors} 
         cat_description_errors={cat_description_errors}
         pic_description_errors={pic_description_errors} 
         user_data={user_data} 
         category_data={category_data} 
         picture_data={picture_data} 
         presentation_data={presentation_data} 
         language_data={language_data} 
         cat_description_data={cat_description_data}
         pic_description_data={pic_description_data} 
         flash_info={flash_info}
         flash_danger={flash_danger}
         flash_success={flash_success} />, 
    document.getElementById('app-component')
  );
})