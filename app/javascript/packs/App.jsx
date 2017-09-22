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
import PictureDetails from './PictureDetails';
import LoginForm from './LoginForm';
import UsersIndex from './UsersIndex';
import UserForm from './UserForm';
import UserDetails from './UserDetails';
import NoticeInfo from './NoticeInfo';
import NoticeDanger from './NoticeDanger';


const App = (props) => (
    <Router>
      <div id="app-container">
        <Route path="/" render={(props2) => <Navibar {...props} {...props2} />} />
        { props.flash_danger.length > 0 ? (<NoticeDanger flash_danger={props.flash_danger} />) : null }
        { props.flash_info.length > 0 ? (<NoticeInfo flash_info={props.flash_info} />) : null }
        <Switch>
          <Route exact path="/" component={HomePage}/>
          <Route exact path="/about" component={AboutPage}/>
          <Route exact path="/categories" render={(props2) => props.category_errors ? (<CategoryForm {...props} {...props2} />) : (<CategoriesIndex {...props} {...props2} />)} />
          <Route exact path="/categories/new" render={(props2) => <CategoryForm {...props} {...props2} />}/>
          <Route exact path="/categories/:category_id" render={(props2) => <CategoryForm {...props} {...props2} />} />
          <Route exact path="/categories/:category_id/edit" render={(props2) => <CategoryForm {...props} {...props2} />} />
          <Route exact path="/categories/:category_id/pictures" render={(props2) => props.picture_errors ? (<PictureForm {...props} {...props2} />) : (<PicturesIndex {...props} {...props2} />)} />
          <Route exact path="/categories/:category_id/pictures/new" render={(props2) => <PictureForm {...props} {...props2} />} />
          <Route exact path="/categories/:category_id/pictures/:picture_id/edit" render={(props2) => <PictureForm {...props} {...props2} />} />
          <Route exact path="/categories/:category_id/pictures/:picture_id" render={(props2) => props.picture_errors ? (<PictureForm {...props} {...props2} />) : (<PictureDetails {...props} {...props2} />)} />
          <Route path="/login" render={(props2) => <LoginForm {...props} {...props2} />} />
          <Route exact path="/users" render={(props2) => props.user_errors ? (<UserForm {...props} {...props2} />) : (<UsersIndex {...props} {...props2} />)} />
          <Route exact path="/users/new" render={(props2) => <UserForm {...props} {...props2} /> } />
          <Route exact path="/users/:user_id/edit" render={(props2) => <UserForm {...props} {...props2} /> } />
          <Route exact path="/users/:user_id" render={(props2) => props.user_errors ? (<UserForm {...props} {...props2} />) : (<UserDetails {...props} {...props2} />)} />
        </Switch>
      </div>
    </Router>
  )

document.addEventListener('turbolinks:load', () => {
  const csrf_token = document.getElementById('csrf_token') ?
                     document.getElementById('csrf_token').getAttribute('data').split('content=')[2].slice(1, -4) : null;
  const category_errors = document.getElementById('category_errors') && JSON.parse(document.getElementById('category_errors').getAttribute('data')).length > 0 ?
                          JSON.parse(document.getElementById('category_errors').getAttribute('data')) : null;
  const picture_errors = document.getElementById('picture_errors') && JSON.parse(document.getElementById('picture_errors').getAttribute('data')).length > 0 ?
                         JSON.parse(document.getElementById('picture_errors').getAttribute('data')) : null;
  const user_errors = document.getElementById('user_errors') && JSON.parse(document.getElementById('user_errors').getAttribute('data')).length > 0 ?
                      JSON.parse(document.getElementById('user_errors').getAttribute('data')) : null;
  const user_data = document.getElementById('user_data') ?
                    JSON.parse(document.getElementById('user_data').getAttribute('data')) : null;
  const category_data = document.getElementById('category_data') ?
                        JSON.parse(document.getElementById('category_data').getAttribute('data')) : null;
  const picture_data = document.getElementById('picture_data') ?
                       JSON.parse(document.getElementById('picture_data').getAttribute('data')) : null;
  const flash_info = [];
  document.getElementsByClassName('info') ? Array.from(document.getElementsByClassName('info')).map(e => flash_info.push(JSON.parse(e.getAttribute('data')))) : [];
  const flash_danger = [];
  document.getElementsByClassName('danger') ? Array.from(document.getElementsByClassName('danger')).map(e => flash_danger.push(JSON.parse(e.getAttribute('data')))) : [];

  ReactDOM.render(
    <App user={window.user} 
         token={csrf_token} 
         category_errors={category_errors} 
         picture_errors={picture_errors} 
         user_errors={user_errors} 
         user_data={user_data} 
         category_data={category_data} 
         picture_data={picture_data}
         flash_info={flash_info}
         flash_danger={flash_danger} />, 
    document.getElementById('app-component')
  );
})