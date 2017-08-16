import React from 'react'
import ReactDOM from 'react-dom'

const AboutPage = props => (
    <div>
        <h1>Who is Eugenie?</h1>
        <p>BLAH BLAH BLAH smart and interesting stuff BLAH BLAH BLAH</p>
    </div>
);

document.addEventListener('turbolinks:load', () => {
  if (document.getElementById('about_page')) {
    ReactDOM.render(
      <AboutPage />,
      document.getElementById('about_page'),
    );
  }
});