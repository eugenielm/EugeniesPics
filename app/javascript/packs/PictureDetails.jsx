import React from 'react';
import ReactDOM from 'react-dom';

const EditDeletePicture = props => {
  return (
      <p>
          <a href={ "/categories/" + props.cat_id + "/pictures/" + props.pic_id + "/edit" }>Edit picture</a>
          <a href={ "/categories/" + props.cat_id + "/pictures/" + props.pic_id } data-method="delete" >Delete picture</a>
      </p>
  )
};

class PictureDetails extends React.Component {
  
  componentWillMount() {
    this.setState({ title: '', description: '', category_name: '', pic_url: '' });
  }
  
  componentDidMount() {
    const url = '/categories/' + this.props.match.params.category_id + '/pictures/' + this.props.match.params.picture_id + '.json';
    fetch(url)
    .then(function(resp) {
      return resp.json();
    })
    .then(function(picture) {
      this.setState({ title: picture.title,
                      description: picture.description,
                      category_name: picture.category.name, // see show.json.builder
                      pic_url: picture.pic_url.medium }); // see show.json.builder
    }.bind(this))
  }

  render() {
    return (
      <div id='picture_details'>
        {(this.props.user && this.props.user.superadmin) ?
        (<EditDeletePicture cat_id={this.props.match.params.category_id} pic_id={this.props.match.params.picture_id} />) : null}
        <img src={this.state.pic_url} />
        <p>{this.state.category_name} | {this.state.title} | {this.state.description}</p>
        <p>(c) Eugenie Le Moulec - all rights reserved</p>
      </div>
    )
  }
}

export default PictureDetails;