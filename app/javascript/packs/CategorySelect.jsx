import React from 'react'
import ReactDOM from 'react-dom'

const CategoryChoice = props => {
    return (
        <option value={props.data.id}>{props.data.name}</option>
    )
}

const CategorySelect = props => {
    return (
        <select defaultValue={props.cat_id} name="picture[category_id]" id="picture_category_id">
            { props.data.map(c => <CategoryChoice key={c.id} data={c} />) }
        </select>
    )
};

export default CategorySelect;