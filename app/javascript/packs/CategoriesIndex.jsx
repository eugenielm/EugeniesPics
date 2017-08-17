import React from 'react'
import ReactDOM from 'react-dom'
import CategoryComponent from './CategoryComponent'
import NewCategoryLink from './NewCategoryLink'

const CategoriesIndex = props => {
        return (
            <div>
                <h1>Going places</h1>
                <NewCategoryLink />
                <div id="all_categories">
                  { props.data.map(c => <CategoryComponent key={c.id} data={c}/>) }
                </div>
            </div>
        );
};

document.addEventListener('turbolinks:load', () => {
  if (document.getElementById('categories_data')) {
    const categories = JSON.parse(document.getElementById('categories_data').getAttribute('data'));
    ReactDOM.render(
      <CategoriesIndex data={categories} />,
      document.getElementById('categories_index'),
    );
  }
});