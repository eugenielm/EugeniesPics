import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, Popover, OverlayTrigger } from 'react-bootstrap';


const unauthorizedActionPopover = (
  <Popover id="popover-trigger-click-hover" title="">
    FYI you don't have the permissions to delete this category.
  </Popover>
);


const CatAdminActionsElement = (props) => {
  const editCatLink = <Button bsStyle="primary" 
                                bsSize="xsmall" 
                                style={{marginRight: '30px'}}
                                href={"/categories/" + props.categoryId + "/edit"}>
                          <span className="glyphicon glyphicon-edit"></span>
                        </Button>;

  const deleteCatLink = <Button bsStyle="danger" 
                                  bsSize="xsmall" 
                                  style={{outline: 0}}
                                  onClick={() => props.handleCatDeleteModal(true)}>
                              <span className="glyphicon glyphicon-trash"></span>
                          </Button>;

  return (
      <Popover id="cat_popover_admin_actions"
                title="Actions on this category"
                style={{zIndex: 0, textAlign: 'center'}}
                positionLeft={props.positionLeft} 
                positionTop={props.positionTop}
                placement="right">
          {editCatLink}{deleteCatLink}
      </Popover>
  );
};


class EditDeleteCategory extends React.Component {

  componentWillMount() {
    this.setState({ displayDeleteModal: false });
    this.handleCatDeleteModal = this.handleCatDeleteModal.bind(this);
  }

  handleCatDeleteModal(bool) {
    this.setState({ displayDeleteModal: bool });
  }

  render() {
    return (
      <div className="edit-delete-cat">

          <OverlayTrigger trigger="click" 
                          placement="right" 
                          overlay={<CatAdminActionsElement {...this.props} 
                                                           categoryId={this.props.catId}
                                                           user={this.props.user}
                                                           handleCatDeleteModal={this.handleCatDeleteModal} />} >
            <Button className="cat_admin_overlay_btn">
                <span className="glyphicon glyphicon-cog"></span>
            </Button>
          </OverlayTrigger>

        <Modal show={this.state.displayDeleteModal}
               style={{padding: '15px', marginTop: '30vh'}}>
            <Modal.Body>
              {this.props.user && this.props.user.superadmin ?
                <div className="confirm_delete_modal">
                  Are you sure you want to delete the '{this.props.catName}' category?
                  <br/><br/>
                  <Button bsStyle="danger" 
                          bsSize="xsmall"
                          onClick={() => this.setState({displayDeleteModal: false})}
                          href={ "/categories/" + this.props.catId}
                          data-method="delete"
                          >Yes
                  </Button>
                  <Button bsSize="xsmall" bsStyle="primary" style={{marginLeft: '30px'}} 
                          onClick={() => this.setState({displayDeleteModal: false})}>No</Button>
              </div>
            :
              <OverlayTrigger trigger={['hover', 'click']} placement="bottom" overlay={unauthorizedActionPopover}>
                <div className="confirm_delete_modal">
                    Are you sure you want to delete the '{this.props.catName}' category?
                    <br/><br/>
                    <Button bsStyle="danger" 
                            bsSize="xsmall"
                            disabled={true}
                            >Yes
                    </Button>
                    <Button bsSize="xsmall" bsStyle="primary" style={{marginLeft: '30px'}} 
                            onClick={() => this.setState({displayDeleteModal: false})}>No</Button>
                </div>
              </OverlayTrigger>
              }
            </Modal.Body>
        </Modal>
      </div>
  )};
};


class CategoryComponent extends React.Component {
  componentWillMount() {
    this.setState({ display: "none" });
    this.handleLoading = this.handleLoading.bind(this);
  }

  handleLoading() {
    this.setState({ display: "block" });
  }

  render() {
    const device = window.navigator.userAgent.includes("Mobile") ?
                   "mobile" : "desktop";
    const catPicDisplay = device === "mobile" ? {opacity: 0.6, filter: "blur(1px)"} : {};
    const catnameDisplay = device === "mobile" ? {opacity: 1} : {};
    return (
        <div className="cat_pic" style={{display: this.props.display}}>
          <Link to={"/categories/" + this.props.category.id + "/pictures"}>
            <img src={screen.width < 1000 || screen.height < 1000 ? 
                          (screen.width < 600 || screen.height < 600 ? this.props.category.catpic_url_small 
                                                                     : this.props.category.catpic_url_medium)
                          : this.props.category.catpic_url_large} 
                 alt={this.props.category.name + "'s category'"} 
                 onLoad={this.handleLoading}
                 style={catPicDisplay}/>
            <p className="catname" style={catnameDisplay}>{this.props.category.name.toUpperCase()}</p>
          </Link>
          { this.props.user ?
            <EditDeleteCategory catId={this.props.category.id} 
                                catName={this.props.category.name} 
                                user={this.props.user} /> 
            : null }
        </div>
    );
  }
};


class CategoriesIndex extends React.Component {

  componentWillMount() {
    this.setState({ categories: [], display: "none" });
  }

  componentDidMount() {
    fetch('/categories.json')
    .then(function(resp) {
      return resp.json();
    })
    .then(function(categories) {
      this.setState({ categories, display: "block" })
    }.bind(this))
  }
  
  render() {
    const new_cat_link = this.props.user ?
                          <Button style={{marginLeft: '10px', marginTop: '-7px', opacity: '0.75'}} 
                                  bsStyle="success" 
                                  bsSize="xsmall" 
                                  href="/categories/new">
                                  <span className="glyphicon glyphicon-plus" style={{paddingLeft: '1px'}}></span>
                          </Button>
                          : null;
    return (
      <div id="categories-page" style={{display: this.state.display}}>
        <div className="page-title">ALL GALLERIES{new_cat_link}</div>
          <div id="all_cats">
            { this.state.categories.map(c => <CategoryComponent user={this.props.user} key={c.id} category={c}/>) }
          </div>
      </div>
    );
  }
};

export default CategoriesIndex;