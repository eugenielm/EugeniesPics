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
        this.setState(this.initialState(this.props));
        this.initialState = this.initialState.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.triggerShareDialog = this.triggerShareDialog.bind(this);
    }

    initialState(props) {
        return {
            show: props.picture_id && props.picture_id == props.currentPicture.id ? true : false, 
            showDescription: false, 
            picIndex: 0,
            language: props.language
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.language != nextProps.language) {
            this.setState({language: nextProps.language});
        }
    }

    handleDescription() {
        if (this.state.show) {
            this.setState({showDescription: !this.state.showDescription});
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.initialState(nextProps));
    }

    triggerShareDialog() {
        FB.ui({
            method: 'share',
            href: window.location.href,
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
                <Link onClick={() => {this.setState({show: true})}} to={'/categories/' + this.props.category_id + '/pictures/' + this.props.currentPicture.id.toString()}>
                    <Image src={this.props.currentPicture.pic_url_small} alt={this.props.currentPicture.title} responsive />
                </Link>
                
                <Modal className="picture_modal"
                       show={this.state.show}
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
                        
                            {(this.state.show && !this.state.showDescription && descriptionsLength > 0) ?
                                
                                <OverlayTrigger placement="bottom" overlay={tooltip}>
                                    <Image src={this.props.currentPicture.pic_url_medium}
                                        alt={this.props.currentPicture.title}
                                        onClick={() => this.handleDescription()}
                                        responsive />
                                </OverlayTrigger>

                                : <Image src={this.props.currentPicture.pic_url_medium}
                                        alt={this.props.currentPicture.title}
                                        onClick={() => this.handleDescription()}
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
                        (c) {this.props.currentPicture.author} - all rights reserved
                        <Button onClick={this.triggerShareDialog}>
                            <i className="fa fa-facebook-official"></i>
                        </Button>
                    </Modal.Footer>
                
                </Modal>

                {this.props.user && this.props.user.superadmin ?
                    (<EditDeletePicture cat_id={this.props.category_id} pic_id={this.props.currentPicture.id} />) : null}
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
        this.triggerShareDialog = this.triggerShareDialog.bind(this);
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
                                                                                                         : (availableLanguages.includes('EN') ? 'EN' : availableLanguages[0]))
                                                    : (availableLanguages.includes('EN') ? 'EN' : availableLanguages[0]);
                const categoryDescription = categoryDescriptions[language];
                const descriptionContent = categoryDescription ? categoryDescription.split('\r\n') : null;
                this.setState({categoryName, pictures, availableLanguages, language, categoryDescriptions, descriptionContent, panelOpen: false});
            }.bind(this));
        }
    }

    handleContent(lang) {
        const categoryDescription = this.state.categoryDescriptions[lang];
        const descriptionContent = categoryDescription.split('\r\n');
        this.props.updateLangPref(lang); // update language preference in App (parent) component
        this.setState({categoryDescription, descriptionContent, language: lang});
    }

    triggerShareDialog() {
        FB.ui({
            method: 'share',
            href: window.location.href,
        }, function(response) {
            if (response && !response.error_message) {
                alert('Posting completed!');
            } else {
                alert('Error while posting :\\');
            }
        });
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
                            <span className={this.state.panelOpen ? "glyphicon glyphicon-circle-arrow-up"
                                                                  : "glyphicon glyphicon-circle-arrow-down"}></span>
                                
                        </Button>
                        
                        <i className="fa fa-facebook-square fa-2x" id="category_fb_share_btn" onClick={this.triggerShareDialog}></i>
                        
                        <Panel collapsible expanded={this.state.panelOpen}>
                            <div id="language_buttons">{languageButtons}</div>
                            {this.state.descriptionContent.map((s, index) => <p key={index} style={{textAlign: 'justify'}}>{s}</p>)}
                        </Panel>
                    </div>
                    : null
                }
                
                <div style={{float: 'left', marginTop: '-25px'}}>{edit_cat_link} {delete_cat_link} {new_picture_link}</div>

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
                                                            categoryName={this.state.categoryName}
                                                            category_id={this.props.match.params.category_id}
                                                            picture_id={this.props.match.params.picture_id}
                                                            language={this.state.language}
                                                            user={this.props.user} />)}
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default PicturesIndex;