import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Image, Modal, OverlayTrigger, Popover } from 'react-bootstrap';
import ReactEventComponent from "react-swipe-event-component";


const unauthorizedActionPopover = (
    <Popover id="popover-trigger-click-hover" title="">
      You don't have the permissions to delete this picture.
    </Popover>
);

const PicAdminActionsElement = (props) => {
    const edit_cat_link = <Button bsStyle="primary" 
                                  bsSize="xsmall" 
                                  style={{marginRight: '30px'}}
                                  href={"/categories/" + props.categoryId + "/pictures/" + props.pictureId + "/edit"}>
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
                                                                 categoryId={this.props.catId}
                                                                 pictureId={this.props.picId}
                                                                 handleDeleteModal={this.handleDeleteModal} />} >
                    <Button className="pic_admin_overlay_btn">
                        <span className="glyphicon glyphicon-cog"></span>
                    </Button>
                </OverlayTrigger>

                <Modal show={this.state.displayDelePicteModal}>
                    <Modal.Body>
                        {this.props.user && this.props.user.superadmin ?
                            <div className="confirm_delete_modal">
                                Are you sure you want to delete '{this.props.picTitle}'?
                                <br/><br/>
                                <Button bsStyle="danger" 
                                        bsSize="xsmall"
                                        onClick={() => this.setState({displayDelePicteModal: false})}
                                        href={ "/categories/" + this.props.catId + "/pictures/" + this.props.picId }
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
                                    Are you sure you want to delete '{this.props.picTitle}'?
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
            this.props.history.push('/categories/' + this.props.categoryId + '/pictures/' + this.props.prevPictureId);
        }
        if (event.keyCode == 39) {
            this.props.history.push('/categories/' + this.props.categoryId + '/pictures/' + this.props.nextPictureId);
        }
        if (event.keyCode == 27) {
            this.props.history.push('/categories/' + this.props.categoryId + '/pictures');
        }
    }

    handleSwipeRight() {
        this.props.history.push('/categories/' + this.props.categoryId + '/pictures/' + this.props.prevPictureId);
    }

    handleSwipeLeft() {
        this.props.history.push('/categories/' + this.props.categoryId + '/pictures/' + this.props.nextPictureId);
    }

    triggerShareDialog() {
        FB.ui({
            method: 'share',
            href: window.location.origin + "/categories/" + this.props.categoryId + '/pictures/' + this.props.pictureId,
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
                backdropClassName="picture_modal_backdrop" 
                show={this.props.showModal}
                dialogClassName="picture_modal_dialog"
                animation={false}
                onKeyDown={this.handlePicWithKeyboard}
                {...this.touchEventProperties}
            >
                <Link to={'/categories/' + this.props.categoryId + '/pictures'}>
                    <div id="close_button">X</div>
                </Link>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-lg">
                        <span>{this.props.currentPicture.title}</span>
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    <Link className="prev-pic" 
                        to={'/categories/' + this.props.categoryId + '/pictures/' + this.props.prevPictureId}>
                        <span id="chevron-left" className="glyphicon glyphicon-menu-left"></span>
                    </Link>
                    
                    <Image src={screen.width < 510 || screen.height < 510 ? this.props.currentPicture.pic_url_medium
                                                                                : this.props.currentPicture.pic_url_large}
                                    alt={this.props.currentPicture.title}
                                    onClick={this.props.showPicDescription}
                                    style={this.props.descriptionsLength > 0 ? {cursor: "pointer"} : {cursor: "defautl"}}
                                    responsive />

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
                        to={'/categories/' + this.props.categoryId + '/pictures/' + this.props.nextPictureId}>
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
            showModal: props.pictureId && props.pictureId == props.currentPicture.id ? true : false, 
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
            <div className="grid-item">
                <Link onClick={() => {this.setState({showModal: true})}} 
                        to={'/categories/' + this.props.categoryId + '/pictures/' + this.props.currentPicture.id.toString()}>
                    <img 
                            srcSet={this.props.currentPicture.pic_url_large, this.props.currentPicture.pic_url_medium} 
                            src={this.props.currentPicture.pic_url_small}
                            alt={this.props.currentPicture.title}/>
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
                    (<EditDeletePicture catId={this.props.categoryId} 
                                        picId={this.props.currentPicture.id} 
                                        user={this.props.user}
                                        picTitle={this.props.currentPicture.title} />) : null}
            </div>
        )
    }
}

export default PictureComponent;