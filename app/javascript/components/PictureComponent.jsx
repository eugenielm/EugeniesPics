import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Col, Image, Modal, OverlayTrigger, Tooltip, Panel } from 'react-bootstrap';

const tooltip = (
    <Tooltip id="tooltip">~ C ~ L ~ I ~ C ~ K ~</Tooltip>
);


const EditDeletePicture = props => {
    return (
        <div id="edit-delete-pic">
            <Button className="edit-picture" bsSize="xsmall" bsStyle="info" style={{opacity: 0.8}}
                    href={ "/categories/" + props.cat_id + "/pictures/" + props.pic_id + "/edit" }>
                    <span className="glyphicon glyphicon-edit"></span>
            </Button>
            <Button bsSize="xsmall" bsStyle="danger" style={{opacity: 0.8}}
                    href={ "/categories/" + props.cat_id + "/pictures/" + props.pic_id } data-method="delete" >
                    <span className="glyphicon glyphicon-trash"></span>
            </Button>
        </div>
    )
};


class PictureComponent extends React.Component {

    componentWillMount() {
        this.setState(this.initialState(this.props));
        this.initialState = this.initialState.bind(this);
        this.triggerShareDialog = this.triggerShareDialog.bind(this);
    }

    initialState(props) {
        return {
            showModal: props.picture_id && props.picture_id == props.currentPicture.id ? true : false, 
            showDescription: this.props.showPicDesc, 
            picIndex: 0,
            language: props.language
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.language != nextProps.language) {
            this.setState({language: nextProps.language});
        }
        if (this.props.showPicDesc != nextProps.showPicDesc) {
            this.setState({showDescription: nextProps.showPicDesc});
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.initialState(nextProps));
    }

    triggerShareDialog() {
        FB.ui({
            method: 'share',
            href: window.location.origin + "/categories/" + this.props.category_id + '/pictures/' + this.props.picture_id,
        }, function(response) {
            if (response && !response.error_message) {
                alert('Posting completed!');
            } else {
                alert('Error while posting :\\');
            }
        });
    }

    render() {
        const descriptionsLength = Object.entries(this.props.currentPicture.descriptions).length;
        
        return (
            <Col lg={3} md={4} sm={6} xs={6} className="picture-element">
            <div className="picture_pic">
                <Link onClick={() => {this.setState({showModal: true})}} 
                      to={'/categories/' + this.props.category_id + '/pictures/' + this.props.currentPicture.id.toString()}>
                    <Image src={this.props.currentPicture.pic_url_small} alt={this.props.currentPicture.title} responsive />
                </Link>
                
                <Modal className="picture_modal"
                       show={this.state.showModal}
                       dialogClassName="custom-modal"
                       animation={false}
                >
                    <Modal.Header>
                        <Link to={'/categories/' + this.props.category_id + '/pictures'} id="close_button">X</Link>
                        <Modal.Title id="contained-modal-title-lg">
                            <span>{this.props.categoryName} / "{this.props.currentPicture.title}"</span>
                        </Modal.Title>
                    </Modal.Header>
                    
                    <Modal.Body>
                        <Link className="prev-pic" 
                              to={'/categories/' + this.props.category_id + '/pictures/' + this.props.prevPicture.id}>
                            <span id="chevron-left" className="glyphicon glyphicon-chevron-left"></span>
                        </Link>
                        
                            {(this.state.showModal && !this.state.showDescription && descriptionsLength > 0) ?
                                
                                <OverlayTrigger placement="bottom" overlay={tooltip}>
                                    <Image src={this.props.currentPicture.pic_url_medium}
                                           alt={this.props.currentPicture.title}
                                           onClick={this.props.showPicDescription}
                                           responsive />
                                </OverlayTrigger>

                                : <Image src={this.props.currentPicture.pic_url_medium}
                                         alt={this.props.currentPicture.title}
                                         onClick={this.props.showPicDescription}
                                         responsive />
                            }

                        {this.state.showDescription && descriptionsLength > 0 ? 
                            (this.state.language ?
                                (this.props.currentPicture.descriptions[this.state.language] ?
                                    (<span className="pic-description">{this.props.currentPicture.descriptions[this.state.language]}</span>)
                                    : (this.props.currentPicture.descriptions['EN'] ?
                                        (<span className="pic-description">{this.props.currentPicture.descriptions['EN']}</span>) 
                                        : (<span className="pic-description">{Object.entries(this.props.currentPicture.descriptions)[0][1]}</span>)))
                                : (this.props.currentPicture.descriptions['EN'] ?
                                    <span className="pic-description">{this.props.currentPicture.descriptions['EN']}</span> 
                                    : <span className="pic-description">{Object.entries(this.props.currentPicture.descriptions)[0][1]}</span>)
                            )
                        : null}
                        
                        <Link className="next-pic" 
                              to={'/categories/' + this.props.category_id + '/pictures/' + this.props.nextPicture.id}>
                            <span id="chevron-right" className="glyphicon glyphicon-chevron-right"></span>
                        </Link>
                    </Modal.Body>

                    <Modal.Footer>
                        <span id="pic_copyright">(c) {this.props.currentPicture.author} - all rights reserved</span>
                        <button id="fb_share_btn_pic" onClick={this.triggerShareDialog}>
                            <i className="fa fa-facebook-official"></i>
                            <span>Share</span>
                        </button>
                    </Modal.Footer>
                
                </Modal>

                {this.props.user && this.props.user.superadmin ?
                    (<EditDeletePicture cat_id={this.props.category_id} pic_id={this.props.currentPicture.id} />) : null}
            </div>
        </Col>
        )
    }
}

export default PictureComponent;