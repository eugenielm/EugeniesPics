import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Grid, Row, Col, Image } from 'react-bootstrap';

const EditDeleteCategory = props => {
    return (
      <div id="edit-delete-cat">
        <Button className="edit-category" bsSize="xsmall" bsStyle="info" href={ "/categories/" + props.cat_id + "/edit" }>
          <span className="glyphicon glyphicon-edit"></span>
        </Button>
        <Button bsSize="xsmall" bsStyle="danger" href={ "/categories/" + props.cat_id } data-method="delete">
          <span className="glyphicon glyphicon-trash"></span>
        </Button>
      </div>
    );
};

const CategoryComponent = props => {
  return (
    <Col md={4} sm={6} xs={6} id={"category_" + props.category.id}>
      <div className="cat_pic">
        <Link to={"/categories/" + props.category.id + "/pictures"}>
          <p id="catname">{props.category.name}</p>
          <Image src={props.category.catpic_url} alt={props.category.name + "'s category'"} responsive />
        </Link>
        { (props.user && props.user.superadmin) ?
          (<EditDeleteCategory cat_id={props.category.id} />) : null }
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
                          <Button style={{marginLeft: 10 + 'px', fontFamily: 'Arial, Helvetica, sans-serif'}} 
                                  bsStyle="success" 
                                  bsSize="xsmall" 
                                  href="/categories/new">
                                  <span className="glyphicon glyphicon-plus" style={{paddingLeft: '1px'}}></span>
                          </Button>
                          : null;
    return (
      <div id="categories-page">
        <div className="page-title">Galleries{new_cat_link}</div>
        <button id="fb_share_btn" onClick={this.triggerShareDialog}>
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