import React from 'react'
import ReactDOM from 'react-dom'
import EditDeleteCategory from './EditDeleteCategory'

function getImgUrl() {
  return ("/nopicture-sm.jpg");
}

const CategoryComponent = props =>
  <div id={"category_" + props.data.id}>
    <p>{props.data.name}</p>
    <EditDeleteCategory category_id={props.data.id} />
    <p><a href={"/categories/" + props.data.id + "/pictures"}>
      <img src={getImgUrl()} alt={props.data.name + "'s category'"} />
    </a></p>
  </div>;

export default CategoryComponent;
