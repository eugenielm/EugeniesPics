// Run this example by adding <%= javascript_pack_tag 'Logout' %> to the head of your layout file,
// like app/views/layouts/application.html.erb.

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const Logout = props => {
  if (props.user) {
    return <a data-method="delete" href="/logout">Log out</a>
  }
  return null;
}

export default Logout;
