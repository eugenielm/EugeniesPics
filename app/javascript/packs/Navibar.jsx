import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';


class Navibar extends React.Component {

  componentWillMount() {
    this.setState({ catLink: null, pathParams: this.props.location.pathname.split('/').slice(1) });
  }

  componentDidMount() {
    if (!this.state.catLink && this.state.pathParams.length > 3) {
      const category_id = this.state.pathParams[1];
      fetch('/categories/' + category_id + '/pictures.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(catData) {
        catData.pop();
        const category_name = catData.pop();
        this.setState({ catLink: (<a href={"/categories/" + category_id + "/pictures"}>Back to {category_name}</a>) })
      }.bind(this));
    }
  }

  componentWillReceiveProps(nextProps) {
    const newPathParams = nextProps.location.pathname.split('/').slice(1);
    this.setState({ pathParams: newPathParams });
    if (this.state.catLink && newPathParams.length < 4) {
      this.setState({ catLink: null });
    } 
    if (!this.state.catLink && newPathParams.length > 3) {
      const category_id = newPathParams[1];
      fetch('/categories/' + category_id + '/pictures.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(catData) {
        catData.pop();
        const category_name = catData.pop();
        this.setState({ catLink: (<Link to={"/categories/" + category_id + "/pictures"}>Back to {category_name}</Link>) })
      }.bind(this))
    }
  }

  render () {
    const path = window.location.pathname;
    return (
      <div>
        <Link to="/">Home</Link>
        {path == '/categories' ? <a href="/categories">Going places</a> : <Link to="/categories">Going places</Link>}
        {this.state.catLink}
        <Link to="/about">About me</Link>
        {this.props.user ? <a data-method="delete" href="/logout">Log out</a> : null}
      </div>
    )
  }
};

export default Navibar;