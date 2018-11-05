import React from 'react';
import { Button, Modal, OverlayTrigger, Popover } from 'react-bootstrap';
import Masonry from 'react-masonry-component';
import PictureComponent from './PictureComponent';
import plusIcon from '../images/plus.png';


const unauthorizedActionPopover = (
    <Popover id="popover-trigger-click-hover" title="">
      You don't have the permissions to delete this category.
    </Popover>
);


const CatAdminActionsElement = (props) => {
    const edit_cat_link = <Button bsStyle="primary" 
                                  bsSize="xsmall" 
                                  style={{marginRight: '30px'}}
                                  href={"/categories/" + props.categoryId + "/edit"}>
                            <span className="glyphicon glyphicon-edit"></span>
                          </Button>;

    const delete_cat_link = <Button bsStyle="danger" 
                                    bsSize="xsmall" 
                                    style={{marginRight: '30px', outline: 0}}
                                    onClick={() => props.handleDeleteModal(true)}>
                                <span className="glyphicon glyphicon-trash"></span>
                            </Button>;

    const new_picture_link = <Button bsStyle="success" bsSize="xsmall" 
                                     href={"/categories/" + props.categoryId + "/pictures/new"}>
                                <span className="glyphicon glyphicon-picture"></span>
                            </Button>;

    return (
        <Popover id="cat_popover_admin_actions"
                 title="Actions on this category"
                 style={{zIndex: 2, textAlign: 'center'}}
                 positionLeft={props.positionLeft} 
                 positionTop={props.positionTop}
                 placement="left">
            {edit_cat_link}{delete_cat_link}{new_picture_link}
        </Popover>
    );
};


class PicturesIndex extends React.Component {

    componentWillMount() {
        this.setState(this.initialState);
        this.initialState = this.initialState.bind(this);
        this.handleCategoryDescription = this.handleCategoryDescription.bind(this);
        this.showPicDescription = this.showPicDescription.bind(this);
        this.handleDeleteModal = this.handleDeleteModal.bind(this);
        this.handleCatDescriptionModal = this.handleCatDescriptionModal.bind(this);
    }

    initialState() {
        return {
            categoryName: '', 
            descriptionContent: null,
            pictures: [], 
            categoryDescriptions: {}, 
            availableLanguages: [],
            language: '',
            showCatDescription: false,
            showPicDesc: false,
            displayDeleteModal: false,
        };
    }

    componentDidMount() {
        const url = '/categories/' + this.props.match.params.category_id + '/pictures.json';
        fetch(url)
        .then(function(resp) {
            return resp.json();
        })
        .then(function(pics) {
            // pictures = [{id, title, author, descriptions, category_name, pic_url_small, pic_url_medium}, 
            //             {PictN2},
            //             {PictN3},
            //             {cat_lang_abbr: cat_content, cat_lang_abbr2: cat_content2},
            //             category_name,
            //             [all_categories]]
            pics.pop(); // popping out all_categories list
            const categoryName = pics.pop();
            const categoryDescriptions = pics.pop();
            const pictures = pics;
            const availableLanguages = Object.keys(categoryDescriptions);
            const language = this.props.langPref ? 
                (availableLanguages.includes(this.props.langPref) ? this.props.langPref
                                                                  : (availableLanguages.includes('EN') ? 'EN' : availableLanguages[0]))
                : (availableLanguages.includes('EN') ? 'EN' : availableLanguages[0]);
            const categoryDescription = categoryDescriptions[language];
            const descriptionContent = categoryDescription ? categoryDescription.split('\r\n') : null;
            this.setState({categoryName, pictures, availableLanguages, language, categoryDescriptions, descriptionContent});
        }.bind(this));
    }

    // this method is needed to triger re-rendering when switching from one categories index page to another
    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.category_id != this.props.match.params.category_id ||
            nextProps.match.params.picture_id != this.props.match.params.picture_id) {
            fetch('/categories/' + nextProps.match.params.category_id + '/pictures.json')
            .then(function(resp) {
                return resp.json();
            })
            .then(function(pics) {
                pics.pop(); // popping out all_categories list
                const categoryName = pics.pop();
                const categoryDescriptions = pics.pop();
                const pictures = pics;
                const availableLanguages = Object.keys(categoryDescriptions);
                const language = this.props.langPref ? 
                    (availableLanguages.includes(this.props.langPref) ? this.props.langPref
                                                                     : (availableLanguages.includes('EN') ? 'EN'
                                                                                                                                              : availableLanguages[0]))
                    : (availableLanguages.includes('EN') ? 'EN' : availableLanguages[0]);
                const categoryDescription = categoryDescriptions[language];
                const descriptionContent = categoryDescription ? categoryDescription.split('\r\n') : null;
                this.setState({categoryName, pictures, availableLanguages, language, categoryDescriptions, 
                               descriptionContent, showCatDescription: false});
            }.bind(this));
        }
    }

    handleCategoryDescription(lang) {
        const categoryDescription = this.state.categoryDescriptions[lang];
        const descriptionContent = categoryDescription.split('\r\n');
        this.props.updateLangPref(lang); // update language preference in App (parent) component
        this.setState({categoryDescription, descriptionContent, language: lang});
    }

    handleCatDescriptionModal() {
        this.setState({showCatDescription: !this.state.showCatDescription});
    }

    showPicDescription() {
        this.setState({showPicDesc: !this.state.showPicDesc});
    }

    handleDeleteModal(bool) {
        this.setState({displayDeleteModal: bool});
    }

    render() {
        window.scrollTo(0, 0);
        const languageButtons = this.state.availableLanguages.map(
            (lang, i) => <Button bsSize="xsmall" 
                                 key={i} 
                                 active={lang == this.state.language ? true : false}
                                 disabled={lang == this.state.language ? true : false}
                                 className='lang_btns'
                                 onClick={() => this.handleCategoryDescription(lang)}>{lang}</Button>);
        
        return (
            <div id="pictures-page">

                <Modal show={this.state.displayDeleteModal}>
                    <Modal.Body>
                        {this.props.user && this.props.user.superadmin ?
                            <div className="confirm_delete_modal">
                                Are you sure you want to delete '{this.state.categoryName}' category?
                                <br/><br/>
                                <Button bsStyle="danger" 
                                        bsSize="xsmall"
                                        onClick={() => this.setState({displayDeleteModal: false})}
                                        href={"/categories/" + this.props.match.params.category_id}
                                        data-method="delete"
                                        style={{marginLeft: '5px'}}
                                        >Yes
                                </Button>
                                <Button bsSize="xsmall" bsStyle="primary" style={{marginLeft: '30px'}} 
                                        onClick={() => this.setState({displayDeleteModal: false})}>No</Button>
                            </div>
                        :
                            <OverlayTrigger trigger={['hover', 'click']} placement="bottom" overlay={unauthorizedActionPopover}>
                                <div className="confirm_delete_modal">
                                    Are you sure you want to delete '{this.state.categoryName}' category?
                                    <br/><br/>
                                    <Button bsStyle="danger" 
                                            bsSize="xsmall"
                                            disabled={true}
                                            style={{marginLeft: '5px'}}
                                            >Yes
                                    </Button>
                                    <Button bsSize="xsmall" bsStyle="primary" style={{marginLeft: '30px'}} 
                                            onClick={() => this.setState({displayDeleteModal: false})}>No</Button>
                                </div>
                            </OverlayTrigger>
                        }
                    </Modal.Body>
                </Modal>
                
                <div className="page-title">
                    <span>{this.state.categoryName.toUpperCase()}</span>
                    {this.state.descriptionContent ? 
                        <span><img id="cat_desc_btn" src={plusIcon} width={30} height={25} 
                                    onClick={this.handleCatDescriptionModal}></img></span>
                        : null }
                </div>
                {this.state.descriptionContent ?
                    <Modal className="cat_desc_modal" backdropClassName="cat_desc_backdrop" 
                           show={this.state.showCatDescription} onHide={this.handleCatDescriptionModal}>
                        <Modal.Header>
                            <div id="language_buttons" style={{float: 'left'}}>{languageButtons}</div>
                            <span id="close_button" onClick={this.handleCatDescriptionModal}>X</span>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.descriptionContent.map((s, index) => <p key={index} style={{textAlign: 'justify'}}>{s}</p>)}
                        </Modal.Body>
                    </Modal>
                : null }

                { this.props.user ?
                    <OverlayTrigger trigger="click" 
                                    placement="left" 
                                    overlay={<CatAdminActionsElement {...this.props} 
                                                                    user={this.props.user}
                                                                    categoryId={this.props.match.params.category_id}
                                                                    handleDeleteModal={this.handleDeleteModal} />} >
                        <Button className="cat_admin_overlay_btn" style={{display: "inline"}}>
                            <span className="glyphicon glyphicon-cog"></span>
                        </Button>
                    </OverlayTrigger>
                    : null
                }

                <Masonry
                    className={'all_pictures'}
                    options={{percentPosition: true, columnWidth: '#grid-sizer', itemSelector: '.grid-item'}}
                    updateOnEachImageLoad={true}
                >
                    <div id="grid-sizer"></div>
                    {this.state.pictures.map(pic => <PictureComponent
                                                    key={pic.id}
                                                    currentPicture={pic}
                                                    prevPictureId={(this.state.pictures.indexOf(pic) == 0)
                                                                ? this.state.pictures[this.state.pictures.length - 1].id
                                                                : this.state.pictures[this.state.pictures.indexOf(pic) - 1].id}
                                                    nextPictureId={(this.state.pictures.indexOf(pic) == this.state.pictures.length -1)
                                                                ? this.state.pictures[0].id
                                                                : this.state.pictures[this.state.pictures.indexOf(pic) + 1].id}
                                                    categoryId={this.props.match.params.category_id}
                                                    pictureId={this.props.match.params.picture_id}
                                                    language={this.state.language}
                                                    user={this.props.user}
                                                    showPicDescription={this.showPicDescription}
                                                    showPicDesc={this.state.showPicDesc}
                                                    history={this.props.history} />)}
                </Masonry>
            </div>
        );
    }
};

export default PicturesIndex;