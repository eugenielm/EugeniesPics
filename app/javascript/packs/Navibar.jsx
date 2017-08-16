import React from 'react'
import ReactDOM from 'react-dom'
import Logout from './Logout.jsx'
import BackToCategoryLink from './BackToCategoryLink.jsx'

const Navibar = props => {
  return (
    <div>
      <a href="/">Home</a>
      <a href="/categories">Going places</a>
      <BackToCategoryLink data={props.data} />
      <a href="/about">About me</a>
      <Logout user={window.user} />
    </div>
    )
}

document.addEventListener('turbolinks:load', () => {
  const picture_details = document.getElementById('pic_details') ? JSON.parse(document.getElementById('pic_details').getAttribute('data')) : null;
  ReactDOM.render(
    <Navibar data={picture_details} />,
    document.getElementById('navibar'),
  )
})
