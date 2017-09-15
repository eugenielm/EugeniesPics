import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';


const EditDeleteCategory = props => {
    return (
      <p>
        <a href={ "/categories/" + props.cat_id + "/edit" }>Edit {props.cat_name} category</a>
        <a href={ "/categories/" + props.cat_id } data-method="delete">Delete {props.cat_name} category</a>
      </p>
    );
};

const CategoryComponent = props => {
  return (
    <div id={"category_" + props.category.id}>
      <p>{props.category.name}</p>
      <p><Link to={"/categories/" + props.category.id + "/pictures"}>
        <img src={props.category.catpic_url} alt={props.category.name + "'s category'"} />
      </Link></p>
      { (props.user && props.user.superadmin) ? (<EditDeleteCategory cat_id={props.category.id} cat_name={props.category.name} />) : null }
      <br />
    </div>
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
    return (
      <div>
          <h1>Going places</h1>
          { (this.props.user && this.props.user.superadmin) ? (<p id="new_cat_link"><a href="/categories/new">New category</a></p>) : null }
          <br />
          <div id="all_categories">
            { this.state.categories.map(c => <CategoryComponent user={this.props.user} key={c.id} category={c}/>) }
          </div>
      </div>
    );
  }
};

export default CategoriesIndex;