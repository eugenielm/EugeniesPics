import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { IndexLinkContainer } from 'react-router-bootstrap';


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
    this.state = {categories: [], path: this.props.location.pathname, open: false, openAdmin: false};
    this.handleCollapse = this.handleCollapse.bind(this);
    this.handleCollapseAdmin = this.handleCollapseAdmin.bind(this);
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

  handleCollapseAdmin() {
    this.setState({ openAdmin: !this.state.openAdmin })
  }


  render () {
    const numberOfCategories = this.state.categories.length;
    return (
      // for height to be 20vw, the image ratio must be 1/5 (height=1 and width=5)
      <div id="page-header">
        <Link to='/' id="home-link">
          <p id="site-name">EUGENIE'S PICS</p>
          <p id="site-name-2">- Photographs by Eugénie Le Moulec -</p>
        </Link>
                    
        <div className="d-flex justify-content-around" id="menuitems">
            
            { this.state.path == '/categories' ?
                <Button href="/categories" active={true} id="gallery_btn">~ Galleries ~</Button>
                  :
                <IndexLinkContainer to='/categories' id="gallery_btn"><Button>~ Galleries ~</Button></IndexLinkContainer>
            }

            <div id="allcats" className="hidden-xs hidden-sm">
              { this.state.categories.map(c => <CategoriesLinks key={c.id} 
                                                                cat_id={c.id} 
                                                                cat_name={c.name} 
                                                                path={this.state.path} 
                                                                index={this.state.categories.indexOf(c)} />) }
            </div>

            <IndexLinkContainer to='/about' id="about_button">
              <Button>Info & <span className="glyphicon glyphicon-envelope"></span></Button>
            </IndexLinkContainer>

            <DropdownButton pullRight noCaret id="allcats" 
                                              title={<span className="glyphicon glyphicon-th-list"></span>} 
                                              open={this.state.open} onToggle={this.handleCollapse} 
                                              className="visible-xs visible-sm">
              { this.state.categories.map(c => <CategoriesLinks key={c.id} 
                                                                cat_id={c.id} 
                                                                cat_name={c.name} 
                                                                path={this.state.path} 
                                                                dropdown={true} 
                                                                index={this.state.categories.indexOf(c)} />) }
            </DropdownButton>

            {this.props.user && this.props.user.superadmin ? 
              <DropdownButton id="admin_dropdown" 
                              title="Admin" 
                              open={this.state.openAdmin} 
                              onToggle={this.handleCollapseAdmin}
                              pullRight>
                <IndexLinkContainer to='/languages'>
                  <MenuItem eventKey={(numberOfCategories + 2).toString() + '.1'}>languages</MenuItem>
                </IndexLinkContainer>
                <IndexLinkContainer to='/presentations'>
                  <MenuItem eventKey={(numberOfCategories + 2).toString() + '.2'}>presentations</MenuItem>
                </IndexLinkContainer>
                <IndexLinkContainer to='/users'>
                  <MenuItem eventKey={(numberOfCategories + 2).toString() + '.3'}>users</MenuItem>
                </IndexLinkContainer>
                <MenuItem divider style={{padding: '1px'}} />
                <IndexLinkContainer to="/logout" data-method="delete">
                  <MenuItem eventKey={(numberOfCategories + 2).toString() + '.4'}>log out</MenuItem>
                </IndexLinkContainer>
              </DropdownButton>
              
              : null}
            
        </div>
                  
        { this.props.user && !this.props.user.superadmin ?
          <Button id="logout-button" 
                  bsStyle="danger" 
                  bsSize="xsmall" 
                  data-method="delete" 
                  href="/logout">Log out</Button>
          : null }
      </div>

    )
  }
};

export default Navibar;