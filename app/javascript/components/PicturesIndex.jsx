import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Grid, Row, Panel } from 'react-bootstrap';
import PictureComponent from './PictureComponent';



class PicturesIndex extends React.Component {

    componentWillMount() {
        this.setState({ categoryName: '', 
                        descriptionContent: null,
                        pictures: [], 
                        categoryDescriptions: {}, 
                        availableLanguages: [],
                        language: '',
                        panelOpen: false,
                        showPicDesc: false});
        this.handleCategoryDescription = this.handleCategoryDescription.bind(this);
        this.showPicDescription = this.showPicDescription.bind(this);
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

    handleCategoryDescription(lang) {
        const categoryDescription = this.state.categoryDescriptions[lang];
        const descriptionContent = categoryDescription.split('\r\n');
        this.props.updateLangPref(lang); // update language preference in App (parent) component
        this.setState({categoryDescription, descriptionContent, language: lang});
    }

    showPicDescription() {
        this.setState({showPicDesc: !this.state.showPicDesc});
    }

    render() {
        const languageButtons = this.state.availableLanguages.map(
            (lang, i) => <Button bsSize="xsmall" 
                                 key={i} 
                                 active={lang == this.state.language ? true : false}
                                 disabled={lang == this.state.language ? true : false}
                                 className='lang_btns'
                                 onClick={() => this.handleCategoryDescription(lang)}>{lang}</Button>);
        
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
                        
                        <i className="fb-share-button" 
                           data-layout="button"
                           data-size="small"
                           data-href={window.location.origin + "/categories/" + this.props.match.params.category_id + "/pictures"}
                           style={{position: 'absolute', top: '20.2vw', right: '5px'}}></i>
                        
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
                                                            user={this.props.user}
                                                            showPicDescription={this.showPicDescription}
                                                            showPicDesc={this.state.showPicDesc} />)}
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default PicturesIndex;