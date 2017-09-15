import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';


const EditDeletePicture = props => {
    return (
        <p>
            <a href={ "/categories/" + props.cat_id + "/pictures/" + props.pic_id + "/edit" }>Edit "{props.pic_title}"</a>
            <a href={ "/categories/" + props.cat_id + "/pictures/" + props.pic_id } data-method="delete" >Delete "{props.pic_title}"</a>
        </p>
    )
};


const PictureComponent = props => (
    <div id={"picture_" + props.picture.id}>
        <p><Link to={"/categories/" + props.category_id + "/pictures/" + props.picture.id}>
            <img src={props.picture.pic_url} alt={props.picture.title} /></Link></p>
        {props.user && props.user.superadmin ?
        (<EditDeletePicture cat_id={props.category_id} pic_id={props.picture.id} pic_title={props.picture.title} />) : null}
        <br />
    </div>
);


class PicturesIndex extends React.Component {

    componentWillMount() {
        this.setState({category_name: '', pictures: []});
    }

    componentDidMount() {
        const url = '/categories/' + this.props.match.params.category_id + '/pictures.json';
        fetch(url)
        .then(function(resp) {
            return resp.json();
        })
        .then(function(pics) {
            pics.pop(); // getting rid of all categories list
            const category_name = pics.pop();
            const pictures = pics;
            this.setState({category_name, pictures});
        }.bind(this));
    }

    render() {
        return (
            <div>
                <h1>A tour in {this.state.category_name}</h1>
                {this.props.user && this.props.user.superadmin ?
                (<a href={"/categories/" + this.props.match.params.category_id + "/pictures/new"}>New picture</a>) : null}
                <br />
                <br />
                <div id='all_pictures'>
                    {this.state.pictures.map(pic => <PictureComponent key={pic.id}
                                                                      picture={pic}
                                                                      category_name={this.state.category_name}
                                                                      category_id={this.props.match.params.category_id}
                                                                      user={this.props.user} />)}
                </div>
            </div>
        );
    }
}

export default PicturesIndex;