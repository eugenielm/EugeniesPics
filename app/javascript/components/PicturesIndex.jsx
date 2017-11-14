import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Grid, Row, Col, Image, Modal, OverlayTrigger, Tooltip, Panel } from 'react-bootstrap';

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
        this.setState({ show: (window.location.hash && window.location.hash.toString().slice(1) 
                               == this.props.pictures[0].id.toString()) ? true : false, 
                        showDescription: false, 
                        picIndex: 0, 
                        language: this.props.language });
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleDisplayedPic = this.handleDisplayedPic.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.shareOnFacebook = this.shareOnFacebook.bind(this);
    }

    shareOnFacebook() {
        const currentPicture = this.props.pictures[this.state.picIndex];
        const picToDisplay = currentPicture.pic_url_medium;
        const picTitle = currentPicture.title;
        const picAuthor = "A photograph by " + currentPicture.author;
        const currentUrl = window.location.href;
        console.log("picToDisplay: ", picToDisplay);
        console.log("picTitle: ", picTitle, ", type of picTitle: ", typeof(picTitle));
        
        // initialize the FB JavaScript SDK
        window.fbAsyncInit = function(picToDisplay, picTitle, picAuthor, currentUrl) {
            FB.init({
              appId            : '1836842776645754',
              autoLogAppEvents : true,
              xfbml            : true,
              version          : 'v2.10'
            });
            FB.ui(
                {
                 method: 'share_open_graph',
                 action_type: 'og.likes',
                 action_properties: JSON.stringify({
                    object : {
                       "og:url": currentUrl,
                       "og:title": picTitle,
                       "og:description": picAuthor,
                       "og:image": picToDisplay,
                    }
                })
                // callback below:
               }, function(response) {
                if (response && !response.error_message) {
                    alert("Posting completed!");
                  } else {
                    alert("Error while posting :\\");
                  }
               }.bind(this));
            // JS SDK initialized, support XFBML tags
            FB.XFBML.parse();
        };

        // Load the SDK asynchronously
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
    }

    showModal() {
        this.setState({show: true});
    }
    
    hideModal() {
        window.location.hash = '';
        this.setState({show: false, showDescription: false, picIndex: 0});
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
                window.location.hash = this.props.pictures[this.state.picIndex + 1].id.toString();
            } else {
                this.setState({ picIndex: 0 });
                window.location.hash = this.props.pictures[0].id.toString();
            }
        } else {
            if (this.state.picIndex == 0) {
                this.setState({ picIndex: this.props.pictures.length - 1 });
                window.location.hash = this.props.pictures[this.props.pictures.length - 1].id.toString();
            } else {
                this.setState({ picIndex: this.state.picIndex - 1 });
                window.location.hash = this.props.pictures[this.state.picIndex - 1].id.toString();
            }
        }
    }

    render() {
        const currentPicture = this.props.pictures[this.state.picIndex];
        const descriptionsLength = Object.entries(currentPicture.descriptions).length;
        
        return (
            <Col lg={3} md={4} sm={6} xs={6} className="picture-element">
            <div className="picture_pic">
                <Link onClick={this.showModal} to={"#" + this.props.pictures[0].id.toString()}>
                    <Image src={this.props.pictures[0].pic_url_small} alt={this.props.pictures[0].title} responsive />
                </Link>
                <Modal className="picture_modal"
                       show={this.state.show}
                       onHide={this.hideModal}
                       dialogClassName="custom-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-lg">
                            <span>{this.props.categoryName} / "{currentPicture.title}"</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="prev-pic" onClick={() => this.handleDisplayedPic(-1)}>
                            <span id="chevron-left" className="glyphicon glyphicon-chevron-left"></span>
                        </div>
                        
                        {(this.state.show && !this.state.showDescription && Object.entries(currentPicture.descriptions).length > 0) ?
                            
                            <OverlayTrigger placement="bottom" overlay={tooltip}>
                                <Image src={currentPicture.pic_url_medium}
                                       alt={currentPicture.title}
                                       onClick={() => this.handleDescription()}
                                       responsive />
                            </OverlayTrigger>

                            : <Image src={currentPicture.pic_url_medium}
                                     alt={currentPicture.title}
                                     onClick={() => this.handleDescription()}
                                     responsive />
                        }

                        {this.state.showDescription && descriptionsLength > 0 ? 
                            (this.state.language ?
                                (currentPicture.descriptions[this.state.language] ?
                                    (<span className="pic-description">{currentPicture.descriptions[this.state.language]}</span>)
                                    : (currentPicture.descriptions['EN'] ?
                                        (<span className="pic-description">{currentPicture.descriptions['EN']}</span>) 
                                        : (<span className="pic-description">{Object.entries(currentPicture.descriptions)[0][1]}</span>)))
                                : (currentPicture.descriptions['EN'] ?
                                    <span className="pic-description">{currentPicture.descriptions['EN']}</span> 
                                    : <span className="pic-description">{Object.entries(currentPicture.descriptions)[0][1]}</span>)
                            )
                        : null}
                        
                        <div className="next-pic" onClick={() => this.handleDisplayedPic(1)}>
                            <span id="chevron-right" className="glyphicon glyphicon-chevron-right"></span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        (c) {currentPicture.author} - all rights reserved 
                        <Button onClick={() => this.shareOnFacebook()}>
                            <i className="fa fa-facebook-official"></i>
                        </Button>
                    </Modal.Footer>
                </Modal>
                {this.props.user && this.props.user.superadmin ?
                    (<EditDeletePicture cat_id={this.props.category_id} pic_id={currentPicture.id} />) : null}
            </div>
        </Col>
        )
    }
}


class PicturesIndex extends React.Component {

    componentWillMount() {
        this.setState({ categoryName: '', 
                        descriptionContent: null,
                        pictures: [], 
                        categoryDescriptions: {}, 
                        availableLanguages: [],
                        language: '',
                        panelOpen: false});
        this.handleContent = this.handleContent.bind(this);
    }

    componentDidMount() {
        const pathParams = this.props.location.pathname.split('/').slice(1);
        const url = '/categories/' + pathParams[1] + '/pictures.json';
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
        if (nextProps.location.pathname != this.props.location.pathname) {
            fetch(nextProps.location.pathname + '.json')
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
                                                                                                        : (availableLanguages.includes('EN') ? 'EN' : availableLanguages[0]))
                                                    : (availableLanguages.includes('EN') ? 'EN' : availableLanguages[0]);
                const categoryDescription = categoryDescriptions[language];
                const descriptionContent = categoryDescription ? categoryDescription.split('\r\n') : null;
                this.setState({categoryName, pictures, availableLanguages, language, categoryDescriptions, descriptionContent});
            }.bind(this));
        }
    }

    handleContent(lang) {
        const categoryDescription = this.state.categoryDescriptions[lang];
        const descriptionContent = categoryDescription.split('\r\n');
        this.props.updateLangPref(lang); // update language preference in App (parent) component
        this.setState({categoryDescription, descriptionContent, language: lang});
    }

    render() {
        const languageButtons = this.state.availableLanguages.map(
            (lang, i) => <Button bsSize="xsmall" 
                                 key={i} 
                                 active={lang == this.state.language ? true : false}
                                 disabled={lang == this.state.language ? true : false}
                                 className='lang_btns'
                                 onClick={() => this.handleContent(lang)}>{lang}</Button>);
        
        const edit_cat_link = this.props.user && this.props.user.superadmin ?
                                <Button bsStyle="primary" 
                                        bsSize="xsmall" 
                                        style={{marginLeft: 10 + 'px', marginTop: -7 + 'px'}}
                                        href={"/categories/" + this.props.match.params.category_id + "/edit"}>
                                    <span className="glyphicon glyphicon-edit"></span>
                                </Button>
                                : null;
        
        const delete_cat_link = this.props.user && this.props.user.superadmin ?
                                    <Button bsStyle="danger" 
                                            bsSize="xsmall" 
                                            style={{marginTop: -7 + 'px'}}
                                            href={"/categories/" + this.props.match.params.category_id}
                                            data-method="delete" >
                                        <span className="glyphicon glyphicon-trash"></span>
                                    </Button>
                                    : null;

        const new_picture_link = this.props.user && this.props.user.superadmin ?
                                    <Button style={{marginTop: -7 + 'px'}} 
                                            bsStyle="success" 
                                            bsSize="xsmall" 
                                            href={"/categories/" + this.props.match.params.category_id + "/pictures/new"}>
                                            <span className="glyphicon glyphicon-picture"></span>
                                    </Button>
                                    : null;
        
        return (
            <div id="pictures-page">
                <div className="page-title">{this.state.categoryName}</div>
                {this.state.descriptionContent ? 
                    <div className="inline">
                        <Button id="cat_desc_btn" bsSize="xsmall"
                                onClick={() => this.setState({ panelOpen: !this.state.panelOpen })}>
                            <span className="glyphicon glyphicon-circle-arrow-down"></span>
                                
                        </Button>
                        <div className="inline">{edit_cat_link} {delete_cat_link} {new_picture_link}</div>
                        <Panel collapsible expanded={this.state.panelOpen}>
                            <div id="language_buttons">{languageButtons}</div>
                            {this.state.descriptionContent.map((s, index) => <p key={index} style={{textAlign: 'justify'}}>{s}</p>)}
                        </Panel>
                    </div>
                    : <div className="inline">{edit_cat_link} {delete_cat_link} {new_picture_link}</div>
                }
                
                <Grid fluid>
                    <Row id='all_pictures' className="show-grid">
                        {this.state.pictures.map(pic => <PictureComponent
                                                            key={pic.id}
                                                            pictures={this.state.pictures.slice(this.state.pictures.indexOf(pic))
                                                            .concat(this.state.pictures.slice(0, this.state.pictures.indexOf(pic)))}
                                                            categoryName={this.state.categoryName}
                                                            category_id={this.props.match.params.category_id}
                                                            language={this.state.language}
                                                            user={this.props.user} />)}
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default PicturesIndex;