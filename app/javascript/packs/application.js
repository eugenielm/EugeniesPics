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

  const demoMode = document.getElementById('demo_mode').getAttribute('data');

  const csrfToken = document.getElementById('csrf_token') ?
                     document.getElementById('csrf_token').getAttribute('data').split('content=')[2].slice(1, -4) : null;
  
  const settingErrors = document.getElementById('setting_errors') 
                         && JSON.parse(document.getElementById('setting_errors').getAttribute('data')).length > 0 ?
                         JSON.parse(document.getElementById('setting_errors').getAttribute('data')) : null;
  const categoryErrors = document.getElementById('category_errors') 
                          && JSON.parse(document.getElementById('category_errors').getAttribute('data')).length > 0 ?
                          JSON.parse(document.getElementById('category_errors').getAttribute('data')) : null;
  const pictureErrors = document.getElementById('picture_errors') 
                         && JSON.parse(document.getElementById('picture_errors').getAttribute('data')).length > 0 ?
                         JSON.parse(document.getElementById('picture_errors').getAttribute('data')) : null;
  const userErrors = document.getElementById('user_errors') 
                      && JSON.parse(document.getElementById('user_errors').getAttribute('data')).length > 0 ?
                      JSON.parse(document.getElementById('user_errors').getAttribute('data')) : null;
  const presentationErrors = document.getElementById('presentation_errors') 
                              && JSON.parse(document.getElementById('presentation_errors').getAttribute('data')).length > 0 ?
                              JSON.parse(document.getElementById('presentation_errors').getAttribute('data')) : null;
  const languageErrors = document.getElementById('language_errors') 
                          && JSON.parse(document.getElementById('language_errors').getAttribute('data')).length > 0 ?
                          JSON.parse(document.getElementById('language_errors').getAttribute('data')) : null;
  const catDescriptionErrors = document.getElementById('cat_description_errors') 
                                 && JSON.parse(document.getElementById('cat_description_errors').getAttribute('data')).length > 0 ?
                                 JSON.parse(document.getElementById('cat_description_errors').getAttribute('data')) : null;
  const picDescriptionErrors = document.getElementById('pic_description_errors') 
                                 && JSON.parse(document.getElementById('pic_description_errors').getAttribute('data')).length > 0 ?
                                 JSON.parse(document.getElementById('pic_description_errors').getAttribute('data')) : null;              
  
  const settingData = document.getElementById('setting_data') ?
                       JSON.parse(document.getElementById('setting_data').getAttribute('data')) : null;
  const userData = document.getElementById('user_data') ?
                    JSON.parse(document.getElementById('user_data').getAttribute('data')) : null;
  const categoryData = document.getElementById('category_data') ?
                        JSON.parse(document.getElementById('category_data').getAttribute('data')) : null;
  const pictureData = document.getElementById('picture_data') ?
                       JSON.parse(document.getElementById('picture_data').getAttribute('data')) : null;
  const presentationData = document.getElementById('presentation_data') ?
                            JSON.parse(document.getElementById('presentation_data').getAttribute('data')) : null;
  const languageData = document.getElementById('language_data') ?
                        JSON.parse(document.getElementById('language_data').getAttribute('data')) : null;
  const catDescriptionData = document.getElementById('cat_description_data') ?
                               JSON.parse(document.getElementById('cat_description_data').getAttribute('data')) : null;
  const picDescriptionData = document.getElementById('pic_description_data') ?
                               JSON.parse(document.getElementById('pic_description_data').getAttribute('data')) : null;
  const currentUser = document.getElementById('current_user_id') ?
                      {id: JSON.parse(document.getElementById('current_user_id').getAttribute('data')),
                       superadmin: JSON.parse(document.getElementById('current_user_superadmin').getAttribute('data')) } : null;

  const flashInfo = [];
  document.getElementsByClassName('info') ?
    Array.from(document.getElementsByClassName('info')).map(e => flashInfo.push(JSON.parse(e.getAttribute('data')))) : [];
  
  const flashDanger = [];
  document.getElementsByClassName('danger') ?
    Array.from(document.getElementsByClassName('danger')).map(e => flashDanger.push(JSON.parse(e.getAttribute('data')))) : [];

  const flashSuccess = [];
  document.getElementsByClassName('success') ?
    Array.from(document.getElementsByClassName('success')).map(e => flashSuccess.push(JSON.parse(e.getAttribute('data')))) : [];

  ReactDOM.render(
    <App user={currentUser}
         token={csrfToken}
         demoMode={demoMode} 
         settingErrors={settingErrors}
         categoryErrors={categoryErrors} 
         pictureErrors={pictureErrors} 
         userErrors={userErrors} 
         presentationErrors={presentationErrors} 
         languageErrors={languageErrors} 
         catDescriptionErrors={catDescriptionErrors}
         picDescriptionErrors={picDescriptionErrors} 
         settingData={settingData}
         userData={userData} 
         categoryData={categoryData} 
         pictureData={pictureData} 
         presentationData={presentationData} 
         languageData={languageData} 
         catDescriptionData={catDescriptionData}
         picDescriptionData={picDescriptionData} 
         flashInfo={flashInfo}
         flashDanger={flashDanger}
         flashSuccess={flashSuccess} />, 
    document.getElementById('app-component')
  );
})