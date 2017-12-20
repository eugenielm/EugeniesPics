/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import ReactDOM from 'react-dom';
import React from 'react';
import App from '../components/App'


document.addEventListener('turbolinks:load', () => {
  const csrf_token = document.getElementById('csrf_token') ?
                     document.getElementById('csrf_token').getAttribute('data').split('content=')[2].slice(1, -4) : null;
  
  const setting_errors = document.getElementById('setting_errors') 
                         && JSON.parse(document.getElementById('setting_errors').getAttribute('data')).length > 0 ?
                         JSON.parse(document.getElementById('setting_errors').getAttribute('data')) : null;
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
  
  const setting_data = document.getElementById('setting_data') ?
                       JSON.parse(document.getElementById('setting_data').getAttribute('data')) : null;
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
         setting_errors={setting_errors}
         category_errors={category_errors} 
         picture_errors={picture_errors} 
         user_errors={user_errors} 
         presentation_errors={presentation_errors} 
         language_errors={language_errors} 
         cat_description_errors={cat_description_errors}
         pic_description_errors={pic_description_errors} 
         setting_data={setting_data}
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