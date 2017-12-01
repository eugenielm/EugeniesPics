import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { IndexLinkContainer } from 'react-router-bootstrap';


const CategoriesLinks = (props) => {
  return (
    <IndexLinkContainer to={'/categories/' + props.cat_id + '/pictures'}>
      <MenuItem eventKey={(2 + props.index).toString()}>{props.cat_name}</MenuItem>
    </IndexLinkContainer>)
}


class Navibar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {categories: [], path: this.props.location.pathname, open: false, openAdmin: false};
    this.handleCollapse = this.handleCollapse.bind(this);
    this.handleCollapseAdmin = this.handleCollapseAdmin.bind(this);
    this.triggerShareDialog = this.triggerShareDialog.bind(this);
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

  triggerShareDialog() {
    const urlToShare = this.props.match.params.category_id ?
      (window.location.origin + "/categories/" + this.props.match.params.category_id + '/pictures')
      : (window.location.origin);
    FB.ui({
        method: 'share',
        href: urlToShare,
    }, function(response) {
        if (typeof(response) === 'undefined') {
            alert('Posting was cancelled!');
        }
        else if (response && !response.error_message) {
            alert('Posting completed!');
        } else {
            alert('Sorry, an error has occurred :\\');
        }
    });
  }


  render () {
    const numberOfCategories = this.state.categories.length;
    return (
      <div id="page-header">
        <Link to='/' id="home-link">
          <p id="site-name">EUGENIE'S PICS</p>
          <p id="site-name-2">- Photographs by Eugénie Le Moulec -</p>
        </Link>

        <hr style={{width: '450px', margin: '0 auto'}}/>
                    
        <div className="hidden-xs" id="menuitems">
            
            { this.state.path == '/categories' ?
                <Button href="/categories" active={true} id="gallery_btn">~ All galleries ~</Button>
                  :
                <IndexLinkContainer to='/categories' id="gallery_btn"><Button>~ All galleries ~</Button></IndexLinkContainer>
            }

              { this.state.categories.map(c => <CategoriesLinks key={c.id} 
                                                                cat_id={c.id} 
                                                                cat_name={c.name} 
                                                                path={this.state.path} 
                                                                index={this.state.categories.indexOf(c)} />) }

            <IndexLinkContainer to='/about' id="about_button">
              <Button>Info & <span className="glyphicon glyphicon-envelope"></span></Button>
            </IndexLinkContainer>
            
        </div>

        <DropdownButton noCaret id="menuitems" 
                        title={<span className="glyphicon glyphicon-menu-hamburger"></span>} 
                        open={this.state.open} onToggle={this.handleCollapse} 
                        className="visible-xs">
      
          { this.state.path == '/categories' ?
            <MenuItem eventKey={1} href="/categories" active={true} id="gallery_btn">~ All galleries ~</MenuItem>
              :
            <IndexLinkContainer to='/categories' id="gallery_btn"><MenuItem eventKey={1}>~ All galleries ~</MenuItem></IndexLinkContainer>
          }

          <IndexLinkContainer to='/about' id="about_button">
            <MenuItem eventKey={2} >Info & <span className="glyphicon glyphicon-envelope"></span></MenuItem>
          </IndexLinkContainer>

          <MenuItem divider/>

          { this.state.categories.map(c => <CategoriesLinks key={c.id} 
                                                            cat_id={c.id} 
                                                            cat_name={c.name} 
                                                            path={this.state.path} 
                                                            index={this.state.categories.indexOf(c)} />) }
        </DropdownButton>

        {this.props.user && this.props.user.superadmin ? 
          <DropdownButton id="admin_dropdown" 
                          title="Admin" 
                          open={this.state.openAdmin} 
                          onToggle={this.handleCollapseAdmin}
                          pullRight noCaret>
            <IndexLinkContainer to='/languages'>
              <MenuItem eventKey={(numberOfCategories + 2).toString() + '.1'}>languages</MenuItem>
            </IndexLinkContainer>
            <IndexLinkContainer to='/presentations'>
              <MenuItem eventKey={(numberOfCategories + 2).toString() + '.2'}>presentations</MenuItem>
            </IndexLinkContainer>
            <IndexLinkContainer to='/users'>
              <MenuItem eventKey={(numberOfCategories + 2).toString() + '.3'}>users</MenuItem>
            </IndexLinkContainer>
            <MenuItem divider/>
            <IndexLinkContainer to="/logout" data-method="delete">
              <MenuItem eventKey={(numberOfCategories + 2).toString() + '.4'}>log out</MenuItem>
            </IndexLinkContainer>
          </DropdownButton>
          
        : null}

        <button id="fb_share_btn" onClick={this.triggerShareDialog}>
          <i className="fa fa-facebook-official"></i>
          <span>Share</span>
        </button>
                  
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