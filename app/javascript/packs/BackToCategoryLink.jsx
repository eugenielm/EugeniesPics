import React from 'react'
import ReactDOM from 'react-dom'

const BackToCategoryLink = props => {
  const path = window.location.pathname;
  if (path.split('/').length == 5) {
    return (
      <a href={"/categories/" + path.split('/')[2]}>Back to {props.data.pic_category}</a>
    );
  }
  return null;
}

export default BackToCategoryLink;
