import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, ButtonToolbar, SplitButton, MenuItem, Navbar, Nav, NavItem, NavDropdown, Jumbotron, Grid, Row, Col, Well, PageHeader } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';


const CategoriesDropdownElement = (props) => {
  return (<LinkContainer to={'/categories/' + props.cat_id + '/pictures'}>
            <MenuItem bsSize="small" active={(props.path == '/categories/' + props.cat_id + '/pictures') ? true : false}>
              {props.cat_name}
            </MenuItem>
          </LinkContainer>);
}


class Navibar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {categories: [], path: this.props.location.pathname, dropdownOpen: false, navbarExpanded: false};
    this.handleDropdown = this.handleDropdown.bind(this);
    this.handleNavbarExpanded = this.handleNavbarExpanded.bind(this);
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

  handleNavbarExpanded() {
    this.setState({ navbarExpanded: !this.state.navbarExpanded })
  }

  render () {

    const dropdown = <NavDropdown title="Going places" id="categories-nav-dropdown" noCaret 
                      onToggle={this.handleDropdown} open={this.state.dropdownOpen}
                      active={(this.state.path != '/' && this.state.path != '/about') ? true : false} >
                      { this.state.path == '/categories' ?
                        <MenuItem href="/categories" active={true}>Overview</MenuItem>
                        :
                        <IndexLinkContainer to='/categories'>
                          <MenuItem active={false}>Overview</MenuItem>
                        </IndexLinkContainer>
                      }
                        <MenuItem divider />
                        { this.state.categories.map(c => <CategoriesDropdownElement key={c.id} cat_id={c.id} cat_name={c.name} path={this.state.path} />) }
                    </NavDropdown>

    return (
      
      <div id="page-header">
        <p>EUGENIE'S PICS</p>
        <p>Photographs by Eugénie Le Moulec</p>

        <br/>
                    
          <Navbar expanded={this.state.navbarExpanded ? true : false} onToggle={this.handleNavbarExpanded}>
            <Navbar.Header>
              <IndexLinkContainer to='/'>
                <Navbar.Brand>LOGO</Navbar.Brand>
              </IndexLinkContainer>
              <Navbar.Toggle/>
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav>
                  { dropdown }
                  <IndexLinkContainer to='/about'><NavItem active={this.state.path == '/about' ? true : false}>About</NavItem></IndexLinkContainer>
                </Nav>
            </Navbar.Collapse>
          </Navbar>
                  
        { this.props.user ? <Button id="id-button" bsStyle="default" bsSize="small" data-method="delete" href="/logout">Log out</Button> : null }
      </div>

    )
  }
};

export default Navibar;