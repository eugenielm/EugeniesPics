import React from 'react'
import ReactDOM from 'react-dom'

const EditDeletePicture = props => {
    if (window.user && window.user.superadmin) {
        return (
            <p>
                <a href={ "/categories/" + props.cat_id + "/pictures/" + props.pic_id + "/edit" }>Edit picture</a>
                <a data-method="delete" href={ "/categories/" + props.cat_id + "/pictures/" + props.pic_id }>Delete picture</a>
            </p>
        )
    }
    return null;
};

export default EditDeletePicture;