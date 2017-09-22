import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, ButtonGroup, ButtonToolbar, SplitButton, MenuItem, Navbar, Nav, NavItem, NavDropdown, Jumbotron, Grid, Row, Col, Well, PageHeader } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';


const CategoriesDropdownElement = (props) => {
  return (<LinkContainer to={'/categories/' + props.cat_id + '/pictures'}>
            <MenuItem bsSize="small" eventKey={"1." + (2 + props.index).toString()} active={props.path == '/categories/' + props.cat_id + '/pictures' ? true : false}>
              {props.cat_name}
            </MenuItem>
          </LinkContainer>);
}


class Navibar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {categories: [], path: this.props.location.pathname, dropdownOpen: false};
    this.handleDropdown = this.handleDropdown.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
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
    this.setState({ path: nextProps.location.pathname, dropdownOpen: false })
  }

  handleDropdown() {
    this.setState({ dropdownOpen: !this.state.dropdownOpen })
  }

  handleOpen() {
    this.setState({ dropdownOpen: true })
  }

  handleClose() {
    this.setState({ dropdownOpen: false })
  }

  render () {

    const dropdown = <NavDropdown eventKey={1} title="Going places" id="categories-nav-dropdown" noCaret onToggle={this.handleDropdown}
                      onMouseEnter={ this.handleOpen } onMouseLeave={ this.handleClose } open={this.state.dropdownOpen}
                      active={!(this.state.path == '/' || this.state.path == '/about') ? true : false} >
                      { this.state.path == '/categories' ?
                        <MenuItem eventKey={1.1} href="/categories" active={true}>Overview</MenuItem>
                        :
                        <IndexLinkContainer to='/categories'>
                          <MenuItem eventKey={1.1}>Overview</MenuItem>
                        </IndexLinkContainer>
                      }
                        <MenuItem divider />
                        { this.state.categories.map(c => <CategoriesDropdownElement key={c.id} cat_id={c.id} cat_name={c.name} path={this.state.path} index={this.state.categories.indexOf(c)} />) }
                    </NavDropdown>

    return (

      <div id="page-header">
        { this.props.user ? <Button id="id-button" bsStyle="default" bsSize="small" data-method="delete" href="/logout">Log out</Button> : null }
        <p>EUGENIE'S PICS</p>
        <p>Photographs by Eugénie Le Moulec</p>
     
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <IndexLinkContainer to='/'>
              <Navbar.Brand>Home</Navbar.Brand>
            </IndexLinkContainer>
            <Navbar.Toggle />
          </Navbar.Header>

          <Navbar.Collapse>
            <Nav>
              {dropdown}
              <LinkContainer to='/about'>
                <NavItem eventKey={2}>About</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>

    )
  }
};

export default Navibar;