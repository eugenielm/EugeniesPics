import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Col, Image, Modal, OverlayTrigger, Tooltip, Panel, Popover } from 'react-bootstrap';

const tooltip = (
    <Tooltip id="tooltip">~ C ~ L ~ I ~ C ~ K ~</Tooltip>
);


const PicAdminActionsElement = (props) => {
    const edit_cat_link = <Button bsStyle="primary" 
                                  bsSize="xsmall" 
                                  style={{marginRight: '30px'}}
                                  href={"/categories/" + props.category_id + "/pictures/" + props.picture_id + "/edit"}>
                            <span className="glyphicon glyphicon-edit"></span>
                          </Button>;

    const delete_cat_link = <Button bsStyle="danger" 
                                    bsSize="xsmall" 
                                    style={{outline: 0}}
                                    onClick={() => props.handleDeleteModal(true)}>
                                <span className="glyphicon glyphicon-trash"></span>
                            </Button>;

    return (
        <Popover id="pic_popover_admin_actions"
                 title="Actions on this picture"
                 style={{zIndex: 0, textAlign: 'center'}}
                 positionLeft={props.positionLeft} 
                 positionTop={props.positionTop}
                 placement="right">
            {edit_cat_link}{delete_cat_link}
        </Popover>
    );
};


class EditDeletePicture extends React.Component {
    componentWillMount() {
        this.setState({displayDeletePicModal: false});
        this.handleDeleteModal = this.handleDeleteModal.bind(this);
    }

    handleDeleteModal(bool) {
        this.setState({displayDelePicteModal: bool});
    }

    render() {
        return (
            <div id="edit-delete-pic">
                <OverlayTrigger trigger="click" 
                                placement="right" 
                                overlay={<PicAdminActionsElement {...this.props} 
                                                                 category_id={this.props.cat_id}
                                                                 picture_id={this.props.pic_id}
                                                                 handleDeleteModal={this.handleDeleteModal} />} >
                    <Button id="pic_admin_overlay_btn">
                        <span className="glyphicon glyphicon-cog"></span>
                    </Button>
                </OverlayTrigger>

                <Modal show={this.state.displayDelePicteModal}
                    style={{padding: '15px', top: '30vh'}}>
                    <Modal.Body>
                        <div style={{margin: '20px'}}>
                            Are you sure you want to destroy '{this.props.pic_title}'?
                            <br/><br/>
                            <Button bsStyle="danger" 
                                    bsSize="xsmall"
                                    onClick={() => this.setState({displayDelePicteModal: false})}
                                    href={ "/categories/" + this.props.cat_id + "/pictures/" + this.props.pic_id }
                                    data-method="delete"
                                    style={{marginLeft: '5px'}}
                                    >Yes
                            </Button>
                            <Button bsSize="xsmall" bsStyle="primary" style={{marginLeft: '30px'}} 
                                    onClick={() => this.setState({displayDelePicteModal: false})}>No</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
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
            if (typeof(response) === 'undefined') {
                alert('Posting was cancelled!');
            }
            else if (response && !response.error_message) {
                alert('Posting completed!');
            } else {
                alert('Sorry, an error has occurred :\\');
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
                    (<EditDeletePicture cat_id={this.props.category_id} 
                                        pic_id={this.props.currentPicture.id} 
                                        pic_title={this.props.currentPicture.title} />) : null}
            </div>
        </Col>
        )
    }
}

export default PictureComponent;