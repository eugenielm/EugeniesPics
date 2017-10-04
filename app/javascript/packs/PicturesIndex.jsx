import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Grid, Row, Col, Image } from 'react-bootstrap';


const EditDeletePicture = props => {
    return (
        <div id="edit-delete-pic">
            <Button className="edit-picture" bsSize="xsmall" bsStyle="info" href={ "/categories/" + props.cat_id + "/pictures/" + props.pic_id + "/edit" }>Edit</Button>
            <Button bsSize="xsmall" bsStyle="danger"  href={ "/categories/" + props.cat_id + "/pictures/" + props.pic_id } data-method="delete" >Delete</Button>
        </div>
    )
};


const PictureComponent = props => (
    <Col lg={3} md={4} sm={6} className="picture-element">
        <div className="picture_pic">
            <Link to={"/categories/" + props.category_id + "/pictures/" + props.picture.id}>
                <Image src={props.picture.pic_url} alt={props.picture.title} responsive />
            </Link>
            {props.user && props.user.superadmin ?
                (<EditDeletePicture cat_id={props.category_id} pic_id={props.picture.id} />) : null}
        </div>
    </Col>
);


class PicturesIndex extends React.Component {

    componentWillMount() {
        this.setState({ category_name: '', pictures: [] });
    }

    componentDidMount() {
        const pathParams = this.props.location.pathname.split('/').slice(1);
        const url = '/categories/' + pathParams[1] + '/pictures.json';
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

    componentWillReceiveProps(nextProps) {
        const url = '/categories/' + nextProps.location.pathname.split('/').slice(1)[1] + '/pictures.json';
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
            <div className="cats-and-pics-pages">
                <div className="page-title">A tour in {this.state.category_name}</div>
                {this.props.user && this.props.user.superadmin ?
                (<Button className="new-picture-button" bsStyle="success" bsSize="xsmall" href={"/categories/" + this.props.match.params.category_id + "/pictures/new"}>New picture</Button>) : null}
                <Grid>
                    <Row id='all_pictures' className="show-grid">
                        {this.state.pictures.map(pic => <PictureComponent
                                                            key={pic.id}
                                                            picture={pic}
                                                            category_name={this.state.category_name}
                                                            category_id={this.props.match.params.category_id}
                                                            user={this.props.user} />)}
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default PicturesIndex;