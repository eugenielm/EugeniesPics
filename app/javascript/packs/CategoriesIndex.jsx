import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Grid, Row, Col, Image } from 'react-bootstrap';

const EditDeleteCategory = props => {
    return (
      <div id="edit-delete-cat">
        <Button className="edit-category" bsSize="xsmall" bsStyle="info" href={ "/categories/" + props.cat_id + "/edit" }>Edit</Button>
        <Button bsSize="xsmall" bsStyle="danger" href={ "/categories/" + props.cat_id } data-method="delete">Delete</Button>
      </div>
    );
};

const CategoryComponent = props => {
  return (
    <Col lg={3} md={4} sm={6} id={"category_" + props.category.id}>
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
  
  render() {
    const new_cat_link = this.props.user && this.props.user.superadmin ?
                          <Button style={{marginLeft: 10 + 'px', fontFamily: 'Arial, Helvetica, sans-serif'}} 
                                  bsStyle="success" 
                                  bsSize="xsmall" 
                                  href="/categories/new">
                                  New category
                          </Button>
                          : null;
    return (
      <div id="categories-page">
          <div className="page-title">Going places {new_cat_link}</div>
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