import React from 'react'
import ReactDOM from 'react-dom'

const NewPictureLink = props => {
    if (window.user && window.user.superadmin) {
        return (
            <p id="new_pic_link">
                <a href={"/categories/" + props.category_id + "/pictures/new"}>New picture</a>
            </p>
        );
    }
    return null;
};

export default NewPictureLink;