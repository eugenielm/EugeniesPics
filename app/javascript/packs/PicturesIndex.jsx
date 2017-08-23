import React from 'react'
import ReactDOM from 'react-dom'
import PictureComponent from './PictureComponent'
import NewPictureLink from './NewPictureLink'

const PicturesIndex = props => {
    return (
        <div>
            <h1>A tour in {props.cat.name}</h1>
            <NewPictureLink category_id={props.cat.id} />
            <div id='all_pictures'>
                {props.data.map(pic => <PictureComponent key={pic.id} data={pic}/>)}
            </div>
        </div>
    );
};


document.addEventListener('turbolinks:load', () => {
  if (document.getElementById('pictures-data')) {
    const pictures = JSON.parse(document.getElementById('pictures-data').getAttribute('data'));
    const category = JSON.parse(document.getElementById('category-data').getAttribute('data'));
    ReactDOM.render(
      <PicturesIndex data={pictures} cat={category} />,
      document.getElementById('pictures_index'),
    );
  }
});