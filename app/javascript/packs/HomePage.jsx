import React from 'react'
import ReactDOM from 'react-dom'

const HomePage = props => {
        return (
            <div>
                <h1>A photography gallery by Eugénie</h1>
                <div>
                  3 pictures should be passing one after another every 5 seconds
                </div>
            </div>
        );
};

document.addEventListener('turbolinks:load', () => {
  if (document.getElementById('welcome_page')) {
    ReactDOM.render(
      <HomePage />,
      document.getElementById('welcome_page'),
    );
  }
});