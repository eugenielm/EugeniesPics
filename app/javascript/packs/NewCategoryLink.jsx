import React from 'react'
import ReactDOM from 'react-dom'

const NewCategoryLink = props => {
    if (window.user && window.user.superadmin) {
        return (<p id="new_cat_link"><a href="/categories/new">New category</a></p>);
    }
    return null;
};

export default NewCategoryLink;