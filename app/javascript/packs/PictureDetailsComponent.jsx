import React from 'react'
import ReactDOM from 'react-dom'

const PictureDetailsComponent = props =>
  <div id='picture_details'>
    <img src={props.data.pic_url} />
    <p>{props.data.pic_category} | {props.data.pic_title} | {props.data.pic_description}</p>
    <p>(c) Eugenie Le Moulec - all rights reserved</p>
  </div>
;

document.addEventListener('turbolinks:load', () => {
  if (document.getElementById('pic_details')) {
    const picture_details = JSON.parse(document.getElementById('pic_details').getAttribute('data'));
    ReactDOM.render(
      <PictureDetailsComponent data={picture_details} />,
      document.getElementById('picture-details-component'),
    );
  }
});