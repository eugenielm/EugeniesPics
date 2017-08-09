// Run this example by adding <%= javascript_pack_tag 'Logout' %> to the head of your layout file,
// like app/views/layouts/application.html.erb.

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const Logout = props => {
  if (window.user) {
    return <a data-method="delete" href="/logout">Log out</a>
  }
  return null
}

Logout.propTypes = {
}

document.addEventListener('turbolinks:load', () => {
  ReactDOM.render(
    <Logout />,
    document.getElementById('logout-link')
  )
})
