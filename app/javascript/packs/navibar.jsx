import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

const Navibar = props => {
  if (window.user) {
    return (
      <div>
        <a href="/">Home</a> |
        <a href="/categories">Going places</a> |
        <a href="/about">About me</a> |
        <a data-method="delete" href="/logout">Log out</a>
      </div>
    )
  } else {
    return (
      <div>
        <a href="/">Home</a> |
        <a href="/categories">Going places</a> |
        <a href="/about">About me</a>
      </div>
    )
  }
}

document.addEventListener('turbolinks:load', () => {
  ReactDOM.render(
    <Navibar />,
    document.getElementById('navibar'),
  )
})
