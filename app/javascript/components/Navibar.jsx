import React from 'react';
import { Link } from 'react-router-dom';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { IndexLinkContainer } from 'react-router-bootstrap';


const CategoriesLinks = (props) => {
  return (
    <IndexLinkContainer to={'/categories/' + props.catId + '/pictures'}>
      <MenuItem eventKey={(2 + props.index).toString()}>{props.catName}</MenuItem>
    </IndexLinkContainer>)
}


class Navibar extends React.Component {

  componentWillMount() {
    this.setState({ categories: [], 
                    path: this.props.location.pathname, 
                    open: false, 
                    openAdmin: false });
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
        if (typeof(response) === 'undefined' || response && response.error_code === 4201) {
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
      <div id="page-header" style={{backgroundColor: this.props.settings["navbarcolor"]}}>
        <Link to='/' id="home-link">
          <p id="site-name" style={{color: this.props.settings["navbarfont"]}}>{this.props.settings["maintitle"]}</p>
          <p id="site-name-2" style={{color: this.props.settings["navbarfont"]}}>{this.props.settings["subtitle"]}</p>
        </Link>

        <hr style={{width: '450px', margin: '0 auto'}}/>
                    
        <div className="hidden-xs" id="menuitems">
            
            { this.state.path == '/categories' ?
                <Button href="/categories" active={true} id="gallery_btn">* All galleries *</Button>
                  :
                <IndexLinkContainer to='/categories' id="gallery_btn"><Button>* All galleries *</Button></IndexLinkContainer>
            }

              { this.state.categories.map(c => <CategoriesLinks key={c.id} 
                                                                catId={c.id} 
                                                                catName={c.name} 
                                                                path={this.state.path} 
                                                                index={this.state.categories.indexOf(c)} />) }

            <IndexLinkContainer to='/about' id="about_button">
              <Button>* Info &amp; <span className="glyphicon glyphicon-envelope"></span> *</Button>
            </IndexLinkContainer>
            
        </div>

        <DropdownButton noCaret id="menuitems" 
                        title={<span className="glyphicon glyphicon-menu-hamburger"></span>} 
                        open={this.state.open} onToggle={this.handleCollapse} 
                        className="visible-xs">
      
          { this.state.path == '/categories' ?
            <MenuItem eventKey={1} href="/categories" active={true} id="gallery_btn">All galleries</MenuItem>
              :
            <IndexLinkContainer to='/categories' id="gallery_btn"><MenuItem eventKey={1}>All galleries</MenuItem></IndexLinkContainer>
          }

          <IndexLinkContainer to='/about' id="about_button">
            <MenuItem eventKey={2} >Info &amp; <span className="glyphicon glyphicon-envelope"></span></MenuItem>
          </IndexLinkContainer>

          <MenuItem divider/>

          { this.state.categories.map(c => <CategoriesLinks key={c.id} 
                                                            catId={c.id} 
                                                            catName={c.name} 
                                                            path={this.state.path} 
                                                            index={this.state.categories.indexOf(c)} />) }
        </DropdownButton>

        {this.props.user ? 
          <DropdownButton id="admin_dropdown" 
                          title="Admin" 
                          open={this.state.openAdmin} 
                          onToggle={this.handleCollapseAdmin}
                          pullRight noCaret>
            {this.props.settings.settingId ? 
              <IndexLinkContainer to={'/settings/' + this.props.settings.settingId + '/edit'}>
                <MenuItem eventKey={(numberOfCategories + 2).toString() + '.1'}>settings</MenuItem>
              </IndexLinkContainer>
            :
              <IndexLinkContainer to='/settings/new'>
                <MenuItem eventKey={(numberOfCategories + 2).toString() + '.1'}>settings</MenuItem>
              </IndexLinkContainer>
            }
            <IndexLinkContainer to='/languages'>
              <MenuItem eventKey={(numberOfCategories + 2).toString() + '.2'}>languages</MenuItem>
            </IndexLinkContainer>
            <IndexLinkContainer to='/presentations'>
              <MenuItem eventKey={(numberOfCategories + 2).toString() + '.3'}>presentations</MenuItem>
            </IndexLinkContainer>
            {this.props.user.superadmin ?
              <IndexLinkContainer to='/users'>
                <MenuItem eventKey={(numberOfCategories + 2).toString() + '.4'}>users</MenuItem>
              </IndexLinkContainer>
            : <IndexLinkContainer to={'/users/' + this.props.user.id}>
                <MenuItem eventKey={(numberOfCategories + 2).toString() + '.4'}>your profile</MenuItem>
              </IndexLinkContainer>
            }
            <MenuItem divider/>
            <IndexLinkContainer to="/logout" data-method="delete">
              <MenuItem eventKey={(numberOfCategories + 2).toString() + '.5'}>log out</MenuItem>
            </IndexLinkContainer>
          </DropdownButton>
          
        : null}

        {!this.props.user && this.props.demoMode ?
          <Link to="/login" 
                style={{position: "absolute", top: '10px', right: '10px', color: 'white', textShadow: '2px 2px 10px black'}}>
            Log in
          </Link>
          : null}

        {!this.props.demoMode ?

          <button id="fb_share_btn" onClick={this.triggerShareDialog}>
            <i className="fa fa-facebook-official"></i>
            <span>Share</span>
          </button>
          
          : null}

        {this.props.demoMode && !this.props.user ?
          <p id="demo_warning">
            You need to be logged in to fully experience this demo!
          </p>
        
          : null}
      
      </div>
    )
  }
};

export default Navibar;