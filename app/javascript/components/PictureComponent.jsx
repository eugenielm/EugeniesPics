import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Col, Image, Modal, OverlayTrigger, Tooltip, Panel, Popover } from 'react-bootstrap';
import ReactEventComponent from "react-swipe-event-component";


const tooltip = (
    <Tooltip id="tooltip">~ C ~ L ~ I ~ C ~ K ~</Tooltip>
);

const unauthorizedActionPopover = (
    <Popover id="popover-trigger-click-hover" title="">
      You don't have the permissions to delete this picture.
    </Popover>
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
                 style={{zIndex: 1, textAlign: 'center'}}
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
                    <Button className="pic_admin_overlay_btn">
                        <span className="glyphicon glyphicon-cog"></span>
                    </Button>
                </OverlayTrigger>

                <Modal show={this.state.displayDelePicteModal}>
                    <Modal.Body>
                        {this.props.user && this.props.user.superadmin ?
                            <div className="confirm_delete_modal">
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
                        :
                            <OverlayTrigger trigger={['hover', 'click']} placement="bottom" overlay={unauthorizedActionPopover}>
                                <div className="confirm_delete_modal">
                                    Are you sure you want to destroy '{this.props.pic_title}'?
                                    <br/><br/>
                                    <Button bsStyle="danger" 
                                            bsSize="xsmall"
                                            disabled={true}
                                            style={{marginLeft: '5px'}}
                                            >Yes
                                    </Button>
                                    <Button bsSize="xsmall" bsStyle="primary" style={{marginLeft: '30px'}} 
                                            onClick={() => this.setState({displayDelePicteModal: false})}>No</Button>
                                </div>
                            </OverlayTrigger>
                        }
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
};


class SwipableModal extends ReactEventComponent {
    
    componentWillMount() {
        this.handlePicWithKeyboard = this.handlePicWithKeyboard.bind(this);
        this.triggerShareDialog = this.triggerShareDialog.bind(this);
    }

    handlePicWithKeyboard(event) {
        if (event.keyCode == 37) {
            window.location.pathname = '/categories/' + this.props.category_id + '/pictures/' + this.props.prevPicture.id;
        }
        if (event.keyCode == 39) {
            window.location.pathname = '/categories/' + this.props.category_id + '/pictures/' + this.props.nextPicture.id;
        }
    }

    handleSwipeRight() {
        window.location.pathname = '/categories/' + this.props.category_id + '/pictures/' + this.props.prevPicture.id;
    }

    handleSwipeLeft() {
        window.location.pathname = '/categories/' + this.props.category_id + '/pictures/' + this.props.nextPicture.id;
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
        return (
            <Modal className="picture_modal"
                show={this.props.showModal}
                dialogClassName="custom-modal"
                animation={false}
                onKeyDown={this.handlePicWithKeyboard}
                {...this.touchEventProperties}
            >
                <Modal.Header>
                    <Link to={'/categories/' + this.props.category_id + '/pictures'} id="close_button">X</Link>
                    <Modal.Title id="contained-modal-title-lg">
                        <span>{this.props.currentPicture.title}</span>
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    <Link className="prev-pic" 
                        to={'/categories/' + this.props.category_id + '/pictures/' + this.props.prevPicture.id}>
                        <span id="chevron-left" className="glyphicon glyphicon-menu-left"></span>
                    </Link>
                    
                        {(this.props.showModal && !this.props.showDescription && this.props.descriptionsLength > 0) ?
                            
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

                    {this.props.showDescription && this.props.descriptionsLength > 0 ? 
                        (this.props.language ?
                            (this.props.currentPicture.descriptions[this.props.language] ?
                                (<span className="pic-description">{this.props.currentPicture.descriptions[this.props.language]}</span>)
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
                        <span id="chevron-right" className="glyphicon glyphicon-menu-right"></span>
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
        )
    }

};


class PictureComponent extends React.Component {

    componentWillMount() {
        this.setState(this.initialState(this.props));
        this.initialState = this.initialState.bind(this);
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

    render() {
        const descriptionsLength = Object.entries(this.props.currentPicture.descriptions).length;
        
        return (
            <Col lg={4} md={6} sm={6} xs={12} className="picture-element">
                <div className="picture_pic">
                    <Link onClick={() => {this.setState({showModal: true})}} 
                          to={'/categories/' + this.props.category_id + '/pictures/' + this.props.currentPicture.id.toString()}>
                        <Image src={this.props.currentPicture.pic_url_small} alt={this.props.currentPicture.title}/>
                        <p>{this.props.currentPicture.title}</p>
                        <p>(c) {this.props.currentPicture.author} - all rights reserved</p>
                    </Link>
                    
                    <SwipableModal {...this.props}
                                   showModal={this.state.showModal}
                                   showDescription={this.state.showDescription}
                                   descriptionsLength={descriptionsLength}
                                   language={this.state.language}

                                    />

                    {this.props.user ?
                        (<EditDeletePicture cat_id={this.props.category_id} 
                                            pic_id={this.props.currentPicture.id} 
                                            user={this.props.user}
                                            pic_title={this.props.currentPicture.title} />) : null}
                </div>
        </Col>
        )
    }
}

export default PictureComponent;