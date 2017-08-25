import React from 'react'
import ReactDOM from 'react-dom'

const Logout = props => {
  if (props.user) {
    return <a data-method="delete" href="/logout">Log out</a>
  }
  return null;
}

export default Logout;
