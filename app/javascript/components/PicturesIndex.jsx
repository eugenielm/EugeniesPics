import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Grid, Row, Panel, Modal, OverlayTrigger, Popover } from 'react-bootstrap';
import PictureComponent from './PictureComponent';


const CatAdminActionsElement = (props) => {
    const edit_cat_link = <Button bsStyle="primary" 
                                  bsSize="xsmall" 
                                  style={{marginRight: '30px'}}
                                  href={"/categories/" + props.category_id + "/edit"}>
                            <span className="glyphicon glyphicon-edit"></span>
                          </Button>;

    const delete_cat_link = <Button bsStyle="danger" 
                                    bsSize="xsmall" 
                                    style={{marginRight: '30px', outline: 0}}
                                    onClick={() => props.handleDeleteModal(true)}>
                                <span className="glyphicon glyphicon-trash"></span>
                            </Button>;

    const new_picture_link = <Button bsStyle="success" bsSize="xsmall" 
                                     href={"/categories/" + props.category_id + "/pictures/new"}>
                                <span className="glyphicon glyphicon-picture"></span>
                            </Button>;

    return (
        <Popover id="cat_popover_admin_actions"
                 title="Actions on this category"
                 style={{zIndex: 2, textAlign: 'center'}}
                 positionLeft={props.positionLeft} 
                 positionTop={props.positionTop}
                 placement="right">
            {edit_cat_link}{delete_cat_link}{new_picture_link}
        </Popover>
    );
};


class PicturesIndex extends React.Component {

    componentWillMount() {
        this.setState({ categoryName: '', 
                        descriptionContent: null,
                        pictures: [], 
                        categoryDescriptions: {}, 
                        availableLanguages: [],
                        language: '',
                        panelOpen: false,
                        showPicDesc: false,
                        displayDeleteModal: false});
        this.handleCategoryDescription = this.handleCategoryDescription.bind(this);
        this.showPicDescription = this.showPicDescription.bind(this);
        this.handleDeleteModal = this.handleDeleteModal.bind(this);
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
            const language = this.props.langPref ? (availableLanguages.includes(this.props.langPref) ? this.props.langPref
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
                const language = this.props.langPref ? (availableLanguages.includes(this.props.langPref) ? this.props.langPref
                                                                                                         : (availableLanguages.includes('EN') ? 'EN'
                                                                                                                                              : availableLanguages[0]))
                                                    : (availableLanguages.includes('EN') ? 'EN' : availableLanguages[0]);
                const categoryDescription = categoryDescriptions[language];
                const descriptionContent = categoryDescription ? categoryDescription.split('\r\n') : null;
                this.setState({categoryName, pictures, availableLanguages, language, categoryDescriptions, descriptionContent, panelOpen: false});
            }.bind(this));
        }
    }

    handleCategoryDescription(lang) {
        const categoryDescription = this.state.categoryDescriptions[lang];
        const descriptionContent = categoryDescription.split('\r\n');
        this.props.updateLangPref(lang); // update language preference in App (parent) component
        this.setState({categoryDescription, descriptionContent, language: lang});
    }

    showPicDescription() {
        this.setState({showPicDesc: !this.state.showPicDesc});
    }

    handleDeleteModal(bool) {
        this.setState({displayDeleteModal: bool});
    }

    render() {
        const languageButtons = this.state.availableLanguages.map(
            (lang, i) => <Button bsSize="xsmall" 
                                 key={i} 
                                 active={lang == this.state.language ? true : false}
                                 disabled={lang == this.state.language ? true : false}
                                 className='lang_btns'
                                 onClick={() => this.handleCategoryDescription(lang)}>{lang}</Button>);
        
        return (
            <div id="pictures-page">

                { this.props.user && this.props.user.superadmin ?
                    <OverlayTrigger trigger="click" 
                                    placement="right" 
                                    overlay={<CatAdminActionsElement {...this.props} 
                                                                     category_id={this.props.match.params.category_id}
                                                                     handleDeleteModal={this.handleDeleteModal} />} >
                        <Button id="cat_admin_overlay_btn">
                            <span className="glyphicon glyphicon-cog"></span>
                        </Button>
                    </OverlayTrigger>
                    : null
                }

                <Modal show={this.state.displayDeleteModal}>
                    <Modal.Body>
                        <div className="confirm_delete_modal">
                            Are you sure you want to destroy '{this.state.categoryName}' category?
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
                    </Modal.Body>
                </Modal>
                
                <div className="page-title">{this.state.categoryName}</div>
                
                {this.state.descriptionContent ? 
                    <div className="inline">
                        <Button id="cat_desc_btn" bsSize="xsmall"
                                onClick={() => this.setState({ panelOpen: !this.state.panelOpen })}>
                            <span className={this.state.panelOpen ? "glyphicon glyphicon-circle-arrow-up"
                                                                  : "glyphicon glyphicon-circle-arrow-down"}></span>
                                
                        </Button>
                        
                        <Panel collapsible expanded={this.state.panelOpen}>
                            <div id="language_buttons">{languageButtons}</div>
                            {this.state.descriptionContent.map((s, index) => <p key={index} style={{textAlign: 'justify'}}>{s}</p>)}
                        </Panel>
                    </div>
                    : null
                }

                <Grid fluid>
                    <Row id='all_pictures' className="show-grid">
                        {this.state.pictures.map(pic => <PictureComponent
                                                            key={pic.id}
                                                            currentPicture={pic}
                                                            prevPicture={(this.state.pictures.indexOf(pic) == 0)
                                                                        ? this.state.pictures[this.state.pictures.length - 1]
                                                                        : this.state.pictures[this.state.pictures.indexOf(pic) - 1]}
                                                            nextPicture={(this.state.pictures.indexOf(pic) == this.state.pictures.length -1)
                                                                        ? this.state.pictures[0]
                                                                        : this.state.pictures[this.state.pictures.indexOf(pic) + 1]}
                                                            category_id={this.props.match.params.category_id}
                                                            picture_id={this.props.match.params.picture_id}
                                                            language={this.state.language}
                                                            user={this.props.user}
                                                            showPicDescription={this.showPicDescription}
                                                            showPicDesc={this.state.showPicDesc} />)}
                    </Row>
                </Grid>
            </div>
        );
    }
};

export default PicturesIndex;