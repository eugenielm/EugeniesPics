import React from 'react'
import ReactDOM from 'react-dom'
import EditDeletePicture from './EditDeletePicture'

const PictureComponent = props => (
    <div id={"picture_" + props.data.id}>
        <p><a href={"/categories/" + props.data.category_id + "/pictures/" + props.data.id}>
            <img src={props.data.pic_url} alt={props.data.title} />
        </a></p>
        <EditDeletePicture cat_id={props.data.category_id} pic_id={props.data.id} />
    </div>
);

export default PictureComponent;