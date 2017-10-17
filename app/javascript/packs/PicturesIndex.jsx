import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Grid, Row, Col, Image, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';


const tooltip = (
    <Tooltip id="tooltip">Click me for more info!</Tooltip>
);


const EditDeletePicture = props => {
    return (
        <div id="edit-delete-pic">
            <Button className="edit-picture" bsSize="xsmall" bsStyle="info" 
                    href={ "/categories/" + props.cat_id + "/pictures/" + props.pic_id + "/edit" }>
                    <span className="glyphicon glyphicon-edit"></span>
            </Button>
            <Button bsSize="xsmall" bsStyle="danger" 
                    href={ "/categories/" + props.cat_id + "/pictures/" + props.pic_id } data-method="delete" >
                    <span className="glyphicon glyphicon-trash"></span>
            </Button>
        </div>
    )
};


class PictureComponent extends React.Component {

    componentWillMount() {
        this.setState({ show: false, showDescription: false, picIndex: 0 });
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleDisplayedPic = this.handleDisplayedPic.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
    }

    showModal() {
        this.setState({show: true});
    }
    
    hideModal() {
        this.setState({show: false, showDescription: false});
    }

    handleDescription() {
        if (this.state.show) {
            this.setState({showDescription: !this.state.showDescription});
        }
    }
    
    handleDisplayedPic(n) {
        if (n == 1) {
            if (this.state.picIndex < this.props.pictures.length - 1) {
                this.setState({ picIndex: this.state.picIndex + 1 });
            } else {
                this.setState({ picIndex: 0 });
            }
        } else {
            if (this.state.picIndex == 0) {
                this.setState({ picIndex: this.props.pictures.length - 1 });
            } else {
                this.setState({ picIndex: this.state.picIndex - 1 });
            }
        }
    }

    render() {
        return (
            <Col lg={3} md={4} sm={6} className="picture-element">
            <div className="picture_pic">
                <Link onClick={this.showModal} to="#">
                    <Image src={this.props.pictures[0].pic_url_small} alt={this.props.pictures[0].title} responsive />
                </Link>
                <Modal show={this.state.show}
                       onHide={this.hideModal}
                       dialogClassName="custom-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-lg">
                            <span>{this.props.category_name} / "{this.props.pictures[this.state.picIndex].title}"</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="prev-pic" onClick={() => this.handleDisplayedPic(-1)}><span id="chevron-left" className="glyphicon glyphicon-chevron-left"></span></div>
                        
                        {(this.state.show && !this.state.showDescription && this.props.pictures[this.state.picIndex].description) ?
                            
                            <OverlayTrigger placement="bottom" overlay={tooltip}>
                                <Image src={this.props.pictures[this.state.picIndex].pic_url_medium}
                                    alt={this.props.pictures[this.state.picIndex].title}
                                    onClick={() => this.handleDescription()}
                                    responsive />
                            </OverlayTrigger>

                            : <Image src={this.props.pictures[this.state.picIndex].pic_url_medium}
                                    alt={this.props.pictures[this.state.picIndex].title}
                                    onClick={() => this.handleDescription()}
                                    responsive />
                        }

                        {this.state.showDescription ?
                            <span className="pic-description">{this.props.pictures[this.state.picIndex].description}</span>
                            : null}
                        
                        <div className="next-pic" onClick={() => this.handleDisplayedPic(1)}><span id="chevron-right" className="glyphicon glyphicon-chevron-right"></span></div>
                    </Modal.Body>
                    <Modal.Footer>
                        (c) {this.props.pictures[this.state.picIndex].author} - all rights reserved
                    </Modal.Footer>
                </Modal>
                {this.props.user && this.props.user.superadmin ?
                    (<EditDeletePicture cat_id={this.props.category_id} pic_id={this.props.pictures[this.state.picIndex].id} />) : null}
            </div>
        </Col>
        )
    }
}


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
        const new_picture_link = this.props.user && this.props.user.superadmin ?
                                    <Button style={{marginLeft: 10 + 'px', fontFamily: 'Arial, Helvetica, sans-serif'}} 
                                            bsStyle="success" 
                                            bsSize="xsmall" 
                                            style={{marginLeft: 10 + 'px'}}
                                            href={"/categories/" + this.props.match.params.category_id + "/pictures/new"}>
                                            New picture
                                    </Button>
                                    : null;
        const edit_cat_link = this.props.user && this.props.user.superadmin ?
                                <Button style={{marginLeft: 10 + 'px', fontFamily: 'Arial, Helvetica, sans-serif'}} 
                                        bsStyle="primary" 
                                        bsSize="xsmall" 
                                        style={{marginLeft: 10 + 'px'}}
                                        href={"/categories/" + this.props.match.params.category_id + "/edit"}>
                                    <span className="glyphicon glyphicon-edit"></span>
                                </Button>
                                : null;
        const delete_cat_link = this.props.user && this.props.user.superadmin ?
                                    <Button style={{marginLeft: 10 + 'px', fontFamily: 'Arial, Helvetica, sans-serif'}} 
                                            bsStyle="danger" 
                                            bsSize="xsmall" 
                                            style={{marginLeft: 10 + 'px'}}
                                            href={"/categories/" + this.props.match.params.category_id}
                                            data-method="delete" >
                                        <span className="glyphicon glyphicon-trash"></span>
                                    </Button>
                                    : null;
        return (
            <div id="pictures-page">
                <div className="page-title">A tour in {this.state.category_name}</div>{edit_cat_link} {delete_cat_link} {new_picture_link}
                <Grid>
                    <Row id='all_pictures' className="show-grid">
                        {this.state.pictures.map(pic => <PictureComponent
                                                            key={pic.id}
                                                            pictures={this.state.pictures.slice(this.state.pictures.indexOf(pic)).concat(this.state.pictures.slice(0, this.state.pictures.indexOf(pic)))}
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