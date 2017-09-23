import React from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink } from 'react-router-dom';
import { Button, ButtonGroup, ButtonToolbar, SplitButton, MenuItem, Navbar, Nav, NavItem, NavDropdown, Jumbotron, Grid, Row, Col, Well, PageHeader } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';


const CategoriesDropdownElement = (props) => {
  return (<IndexLinkContainer to={'/categories/' + props.cat_id + '/pictures'}>
            <Button active={(props.path == '/categories/' + props.cat_id + '/pictures') ? true : false}>
              {props.cat_name}
            </Button>
          </IndexLinkContainer>);
}


class Navibar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {categories: [], path: this.props.location.pathname, dropdownOpen: false, navbarExpanded: false};
    this.handleDropdown = this.handleDropdown.bind(this);
  }

  componentDidMount() {
    fetch('/categories.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(catData) {
      this.setState({ categories: catData })
    }.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ path: nextProps.location.pathname, dropdownOpen: false, navbarExpanded: false })
  }

  handleDropdown() {
    this.setState({ dropdownOpen: !this.state.dropdownOpen })
  }


  render () {

    return (
      
      <div id="page-header">
        <Link to='/' id="home-link">
          <p>EUGENIE'S PICS</p>
          <p>Photographs by Eugénie Le Moulec</p>
        </Link>

        <br/>
                    
        <div className="d-flex justify-content-around">
            <IndexLinkContainer to='/about'><Button>About</Button></IndexLinkContainer>
            { this.state.path == '/categories' ?
                <Button href="/categories">Going places</Button>
                  :
                <IndexLinkContainer to='/categories'><Button>Going places</Button></IndexLinkContainer>
            }
            { this.state.categories.map(c => <CategoriesDropdownElement key={c.id} cat_id={c.id} cat_name={c.name} path={this.state.path} />) }
        </div>
                  
        { this.props.user ? <Button id="id-button" bsStyle="info" bsSize="small" data-method="delete" href="/logout">Log out</Button> : null }
      </div>

    )
  }
};

export default Navibar;