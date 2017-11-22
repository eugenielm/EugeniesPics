import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Grid, Row, Col, Image, Modal, Popover, OverlayTrigger } from 'react-bootstrap';


const CatAdminActionsElement = (props) => {
  const edit_cat_link = <Button bsStyle="primary" 
                                bsSize="xsmall" 
                                style={{marginRight: '30px'}}
                                href={"/categories/" + props.category_id + "/edit"}>
                          <span className="glyphicon glyphicon-edit"></span>
                        </Button>;

  const delete_cat_link = <Button bsStyle="danger" 
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
          {edit_cat_link}{delete_cat_link}
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
      <div id="edit-delete-cat">

          <OverlayTrigger trigger="click" 
                          placement="right" 
                          overlay={<CatAdminActionsElement {...this.props} 
                                                           category_id={this.props.cat_id}
                                                           handleCatDeleteModal={this.handleCatDeleteModal} />} >
            <Button id="cat_admin_overlay_btn">
                <span className="glyphicon glyphicon-cog"></span>
            </Button>
          </OverlayTrigger>

        <Modal show={this.state.displayDeleteModal}
               style={{padding: '15px', marginTop: '30vh'}}>
            <Modal.Body>
                <div style={{margin: '20px'}}>
                    Are you sure you want to destroy the '{this.props.cat_name}' category?
                    <br/><br/>
                    <Button bsStyle="danger" 
                            bsSize="xsmall"
                            onClick={() => this.setState({displayDeleteModal: false})}
                            href={ "/categories/" + this.props.cat_id}
                            data-method="delete"
                            >Yes
                    </Button>
                    <Button bsSize="xsmall" bsStyle="primary" style={{marginLeft: '30px'}} 
                            onClick={() => this.setState({displayDeleteModal: false})}>No</Button>
                </div>
            </Modal.Body>
        </Modal>
      </div>
  )};
};

const CategoryComponent = props => {
  return (
    <Col md={4} sm={6} xs={6} id={"category_" + props.category.id}>
      <div className="cat_pic">
        <Link to={"/categories/" + props.category.id + "/pictures"}>
          <p id="catname">{props.category.name}</p>
          <Image src={props.category.catpic_url} alt={props.category.name + "'s category'"} responsive />
        </Link>
        { props.user && props.user.superadmin ?
          <EditDeleteCategory cat_id={props.category.id} cat_name={props.category.name} /> : null }
      </div>
    </Col>
  );
};


class CategoriesIndex extends React.Component {

  componentWillMount() {
    this.setState({ categories: [] });
    this.triggerShareDialog = this.triggerShareDialog.bind(this);
  }

  componentDidMount() {
    fetch('/categories.json')
    .then(function(resp) {
      return resp.json();
    })
    .then(function(categories) {
      this.setState({ categories })
    }.bind(this))
  }

  triggerShareDialog() {
    FB.ui({
        method: 'share',
        href: window.location.origin + "/categories",
    }, function(response) {
        if (response && !response.error_message) {
            alert('Posting completed!');
        } else {
            alert('Error while posting :\\');
        }
    });
  }
  
  render() {
    const new_cat_link = this.props.user && this.props.user.superadmin ?
                          <Button style={{marginLeft: '10px', marginTop: '-2px', fontFamily: 'Arial, Helvetica, sans-serif', opacity: '0.75'}} 
                                  bsStyle="success" 
                                  bsSize="xsmall" 
                                  href="/categories/new">
                                  <span className="glyphicon glyphicon-plus" style={{paddingLeft: '1px'}}></span>
                          </Button>
                          : null;
    return (
      <div id="categories-page">
        <div className="page-title">Galleries{new_cat_link}</div>
        <button id="fb_share_btn" onClick={this.triggerShareDialog} style={{top: '1vh', right: '0.8vh'}}>
            <i className="fa fa-facebook-official"></i>
            <span>Share</span>
        </button>
        <Grid>
          <Row id="all_categories" className="show-grid">
            { this.state.categories.map(c => <CategoryComponent user={this.props.user} key={c.id} category={c}/>) }
          </Row>
        </Grid>
      </div>
    );
  }
};

export default CategoriesIndex;