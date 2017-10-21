import React from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink } from 'react-router-dom';
import { Button, ButtonGroup, ButtonToolbar, DropdownButton, SplitButton, MenuItem, Navbar, Nav, NavItem, NavDropdown, Jumbotron, Grid, Row, Col, Well, PageHeader, Collapse } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';


const AdminMenuItems = (props) => (
  <div id="admin-menu-items">
    <IndexLinkContainer to='/languages'><Button>&gt;languages&lt;</Button></IndexLinkContainer>
    <IndexLinkContainer to='/presentations'><Button>&gt;presentations&lt;</Button></IndexLinkContainer>
    <IndexLinkContainer to='/users'><Button>&gt;users&lt;</Button></IndexLinkContainer>
    <Button style={{color: 'red'}} data-method="delete" href="/logout">&gt;log out&lt;</Button>
  </div>
);

const CategoriesLinks = (props) => {
  if (props.dropdown) {
    return (<IndexLinkContainer to={'/categories/' + props.cat_id + '/pictures'}>
              <MenuItem eventKey={(1 + props.index).toString()}>{props.cat_name}</MenuItem>
            </IndexLinkContainer>)
  } else {
    return (<IndexLinkContainer to={'/categories/' + props.cat_id + '/pictures'}>
              <Button active={(props.path == '/categories/' + props.cat_id + '/pictures') ? true : false}>
                {props.cat_name}
              </Button>
            </IndexLinkContainer>);
  }
}


class Navibar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {categories: [], path: this.props.location.pathname, open: false};
    this.handleCollapse = this.handleCollapse.bind(this);
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
    this.setState({ path: nextProps.location.pathname, open: false })
  }

  handleCollapse() {
    this.setState({ open: !this.state.open })
  }


  render () {
    
    return (
      
      <div id="page-header">
        <Link to='/' id="home-link">
          <p id="site-name">EUGENIE'S PICS</p>
          <p id="site-name-2">Photographs by Eugénie Le Moulec</p>
        </Link>
                    
        <div className="d-flex justify-content-around" id="menuitems">
            
            {this.props.user && this.props.user.superadmin ? 
              <AdminMenuItems /> : null}

            <IndexLinkContainer to='/about'><Button><span className="glyphicon glyphicon-eye-open"></span></Button></IndexLinkContainer>
            
            { this.state.path == '/categories' ?
                <Button href="/categories" active={true}>~Galleries~</Button>
                  :
                <IndexLinkContainer to='/categories'><Button>~Galleries~</Button></IndexLinkContainer>
            }

            <div id="allcats" className="hidden-xs hidden-sm">
              { this.state.categories.map(c => <CategoriesLinks key={c.id} cat_id={c.id} cat_name={c.name} path={this.state.path} index={this.state.categories.indexOf(c)} />) }
            </div>

            <DropdownButton pullRight noCaret id="allcats" title={<span className="glyphicon glyphicon-list"></span>} open={this.state.open} onToggle={this.handleCollapse} className="visible-xs visible-sm">
              { this.state.categories.map(c => <CategoriesLinks key={c.id} cat_id={c.id} cat_name={c.name} path={this.state.path} dropdown={true} index={this.state.categories.indexOf(c)} />) }
            </DropdownButton>
            
        </div>
                  
        { this.props.user && !this.props.user.superadmin ?
          <Button id="logout-button" bsStyle="danger" bsSize="xsmall" data-method="delete" href="/logout">Log out</Button>
          : null }
      </div>

    )
  }
};

export default Navibar;