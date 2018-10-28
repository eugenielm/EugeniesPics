import React from 'react';
import { Button, FormGroup, FormControl, Table } from 'react-bootstrap';
import ErrorsComponent from './ErrorsComponent';


const LanguageChoice = props => {
    return <option value={props.data.id} disabled={props.takenLangs.includes(props.data.id) ? true : false}>{props.data.name}</option>
};


class PicDescriptionForm extends React.Component {

    componentWillMount() {
        this.setState({ token: this.props.token,
                        errors: this.props.picDescriptionErrors || null,
                        user: this.props.user || null,
                        languages: [],
                        picture_title: '',
                        existingPicdescriptions: [],
                        pic_description_id: this.props.match.params.pic_description_id || '',
                        language_id: this.props.picDescriptionData ? this.props.picDescriptionData.language_id : '',
                        pic_descr_language_name: '',
                        content: this.props.picDescriptionData ? this.props.picDescriptionData.content : ''});
        this.handleLanguageId = this.handleLanguageId.bind(this);
        this.handleContent = this.handleContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {

        fetch('/languages.json', {credentials: 'same-origin'})
        .then(function(resp) {
            return resp.json();
          })
          .then(function(languages) {
            let pic_descr_language_name;
            if (this.state.pic_description_id) {
                for (let i=0; i < languages.length; i++) {
                    if (languages[i].id == this.state.language_id) {
                        pic_descr_language_name = languages[i].name;
                    }
                }
            }
            this.setState({ languages, pic_descr_language_name });
          }.bind(this))

        fetch('/categories/' + this.props.match.params.category_id 
            + '/pictures/' + this.props.match.params.picture_id 
            + '/pic_descriptions.json',
            {credentials: 'same-origin'})
        .then(function(resp) {
            return resp.json();
        })
        .then(function(pic_descriptions) {
            const picture_title = pic_descriptions.pop();
            // now pic_descriptions = [{id: 'id', language_id: 'lang id', language_name: 'lang name', content: 'desc content'}, {etc.}, {etc.}]
            const existingPicdescriptions = [];
            for (let i=0; i < pic_descriptions.length; i++) {
                existingPicdescriptions.push(pic_descriptions[i].language_id);
            }
            this.setState({ picture_title, existingPicdescriptions });
        }.bind(this))

    }

    handleContent(event) {
        if (event.target.value.length <= 500) {
            this.setState({content: event.target.value});
        }  
    }

    handleLanguageId(event) {
        this.setState({language_id: event.target.value});
    }

    handleSubmit(event) {
        let alerts = '';
        if (this.state.content.length < 2) {
            alerts += "A picture description must be at least 2 characters long and at most 500 characters.\n"
        }
        if (!this.state.language_id || this.state.language_id == "-- select --") {
            alerts += "Please select a language.\n"
        }
        if (this.state.user && !this.state.user.superadmin) {
            alerts += "You don't have the required permissions to create a picture description."
        }
        if (alerts) {
            alert(alerts);
            event.preventDefault();
        }
    }

    render() {
        const form_action = this.state.pic_description_id ?
                            ("/categories/" + this.props.match.params.category_id + "/pictures/" 
                            + this.props.match.params.picture_id + '/pic_descriptions/' + this.state.pic_description_id)
                            : ("/categories/" + this.props.match.params.category_id + "/pictures/" 
                            + this.props.match.params.picture_id + '/pic_descriptions');
        const input_edit = this.state.pic_description_id ? 
                                React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'}) : null;
        const newLangLink = (this.state.user && this.state.user.superadmin) ?
                                (<Button id="new_lang_link" bsSize="xsmall" bsStyle="success" 
                                         style={{marginLeft: '7px', paddingRight: '3px', opacity: '0.75'}}
                                         href={"/languages/new?redirect_to_pic_desc_edit=" + encodeURIComponent(this.props.match.url)}>
                                        <span className="glyphicon glyphicon-plus"></span>
                                </Button>)
                                : null;
        const page_title = this.state.pic_description_id ?
                                ("Edit '" + this.state.picture_title + "' description")
                                : ("Create description for '" + this.state.picture_title + "'");

        return (
            <div className="form-layout">
                <div className="admin-page-title">{page_title}
                    <Button bsStyle="primary"
                            bsSize="xsmall" 
                            style={{marginLeft: 10 + 'px'}}
                            className="back-link" 
                            href={"/categories/" + this.props.match.params.category_id 
                                + "/pictures/" + this.props.match.params.picture_id + "/edit"}>
                        <span className="glyphicon glyphicon-arrow-left"></span>
                    </Button>
                </div>

                { this.state.errors ? (<ErrorsComponent errors={this.state.errors} model={"pic_description"} />) : null }

                <form encType="multipart/form-data" action={form_action} method="post" 
                      acceptCharset="UTF-8" onSubmit={this.handleSubmit} style={{marginTop: '20px'}} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly={true} />
                    {input_edit}
                    <input type="hidden" value={this.props.match.params.picture_id} name="pic_description[picture_id]" />
                    
                    <Table responsive bordered striped id="catdescription_form_table">
                        <tbody>
                            {this.state.pic_description_id ?
                                (<tr>
                                    <td><label htmlFor="choose-language">Language</label></td>
                                    <td>
                                        <FormGroup controlId="formControlsSelect">
                                            <FormControl componentClass="select" 
                                                         value={this.state.language_id} 
                                                         name="pic_description[language_id]" 
                                                         onChange={this.handleLanguageId}>
                                                <option value={this.state.language_id}>{this.state.pic_descr_language_name}</option>
                                            >
                                            </FormControl>
                                        </FormGroup>
                                    </td>
                                </tr>)

                                : (<tr>
                                    <td><label htmlFor="choose-language">Language</label>{newLangLink}</td>
                                    <td>
                                        <FormGroup controlId="formControlsSelect">
                                            <FormControl componentClass="select" 
                                                         value={this.state.language_id || "-- select --"}
                                                         name="pic_description[language_id]" 
                                                         onChange={this.handleLanguageId}>
                                                <option value="-- select --">-- select --</option>
                                                { this.state.languages.map(pres => <LanguageChoice key={pres.id} 
                                                                                                   data={pres}
                                                                                                   takenLangs={this.state.existingPicdescriptions} />) }>
                                            </FormControl>
                                        </FormGroup>
                                    </td>
                                </tr>)
                            }
                            <tr>
                                <td><label htmlFor="pres_content">Description</label></td>
                                <td>
                                    <FormGroup controlId="formControlsTextarea">
                                        <FormControl componentClass="textarea" 
                                                     placeholder={"Describe " + this.state.picture_title}
                                                     style={{height: 100 + 'px'}}
                                                     name="pic_description[content]" 
                                                     value={this.state.content || ''} 
                                                     onChange={this.handleContent} />
                                    </FormGroup>
                                </td>
                            </tr>
                        </tbody>
                    </Table>

                    <div className="actions">
                        <input type="submit" name="commit" value={this.state.pic_description_id ? "Submit changes" : "Create description"} />
                    </div>
                </form>
            </div>
        );
    }
}

export default PicDescriptionForm;