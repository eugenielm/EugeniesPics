import React from 'react'
import ReactDOM from 'react-dom'

const EditDeleteCategory = props => {
    if (window.user && window.user.superadmin) {
        return (
            <p>
                <a href={ "/categories/" + props.category_id + "/edit" }>Edit category</a>
                <a data-method="delete" href={ "/categories/" + props.category_id }>Delete category</a>
            </p>
        );
    }
    return null;
};

export default EditDeleteCategory;