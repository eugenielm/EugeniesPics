import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, Table } from 'react-bootstrap';
import ErrorsComponent from './ErrorsComponent';


const LanguageChoice = props => {
    // the list of keys returned by Object.keys(obj) are stringified
    return <option value={props.data.id}
                   disabled={Object.keys(props.usedLanguages).includes(props.data.id.toString()) ? true : false}>
                   {props.data.name}
           </option>
};


class PresentationForm extends React.Component {

    componentWillMount() {
        this.setState({ display: "none",
                        token: this.props.token,
                        errors: this.props.presentation_errors || null,
                        user: this.props.user || null,
                        languages: [],
                        usedLanguages: {},
                        presentation_id: this.props.match.params ? this.props.match.params.presentation_id : '',
                        presentation_content: this.props.presentation_data ? this.props.presentation_data.content : '',
                        presentation_language_id: this.props.presentation_data ? this.props.presentation_data.language_id : '' });
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
            this.setState({ languages, display: "block" });
          }.bind(this));

        // needed to deactivate already taken languages for a new presentation
        fetch('/presentations.json', {credentials: 'same-origin'})
          .then(function(resp) {
            return resp.json();
          })
          .then(function(presentations) {
              // presentations = {'LANG_ABBREV1': [pres_content1, language_name1, pres_id1, lang_id1], 'LANG2': [etc.]}
              let usedLanguages = {};
              Object.values(presentations).forEach(
                  (v) => {
                      const newKey = v[3];
                      const newValue = v[1];
                      usedLanguages[newKey] = newValue;
                  }
              )
            this.setState({ usedLanguages })
          }.bind(this))

    }

    handleContent(event) {
        if (event.target.value.length <= 1000) {
            this.setState({presentation_content: event.target.value});
        }  
    }

    handleLanguageId(event) {
        this.setState({presentation_language_id: event.target.value});
    }

    handleSubmit(event) {
        let alerts = '';
        if (!this.state.presentation_content || this.state.presentation_content.length < 10) {
            alerts += "A presentation must be at least 10 characters long and at most 1000 characters. "
        }
        if (!this.state.presentation_language_id || this.state.presentation_language_id == "-- select --") {
            alerts += "Please select a language. "
        }
        if (this.state.user && !this.state.user.superadmin) {
            alerts += "You don't have the required permissions to create or edit a presentation."
        }
        if (alerts) {
            alert(alerts);
            event.preventDefault();
        }
    }

    render() {
        const form_action = this.state.presentation_id ? ("/presentations/" + this.state.presentation_id) : ("/presentations");
        const input_edit = this.state.presentation_id ? React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'}) : null;
        const newLangLink = (this.state.user && this.state.user.superadmin) ?
                            (<Button id="new_lang_link" bsSize="xsmall" bsStyle="success" style={{marginLeft: 5 + 'px', paddingRight: 3 + 'px'}}
                                     href={"/languages/new?redirect_to_presentation_edit=" + encodeURIComponent(this.props.match.url)}>
                                     <span className="glyphicon glyphicon-plus"></span>
                            </Button>)
                            : null;
        const page_title = this.state.presentation_id ? "Edit presentation" : "New presentation";

        return (
            <div className="form-layout" style={{display: this.state.display}}>
                <div className="admin-page-title">{page_title} <Button bsStyle="primary" 
                                                                       bsSize="xsmall" 
                                                                       className="back-link" 
                                                                       href="/presentations">
                                                                    <span className="glyphicon glyphicon-arrow-left"></span>
                                                                </Button>
                </div>
                { this.state.errors ? (<ErrorsComponent errors={this.state.errors} model={"presentation"} />) : null }
                <form encType="multipart/form-data" action={form_action} method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly={true} />
                    {input_edit}
                    
                    <Table responsive bordered striped id="presentation_form_table">
                        <tbody>
                            <tr>
                                <td><label htmlFor="choose-language">Language</label>{newLangLink}</td>
                                {this.state.presentation_id ?
                                    (<td>
                                        <FormGroup controlId="formControlsSelect">
                                            <FormControl componentClass="select" readOnly 
                                                         value={this.state.presentation_language_id} 
                                                         name="presentation[language_id]">
                                                <option value={this.state.presentation_language_id}>
                                                    {this.state.usedLanguages[this.state.presentation_language_id]}
                                                </option>
                                            </FormControl>
                                        </FormGroup>
                                    </td>)
                                :
                                    <td>
                                        <FormGroup controlId="formControlsSelect">
                                            <FormControl componentClass="select" 
                                                        value={this.state.presentation_language_id || "-- select --"} 
                                                        name="presentation[language_id]" 
                                                        onChange={this.handleLanguageId}>
                                                <option value="-- select --">-- select --</option>
                                                { this.state.languages.map(lang => <LanguageChoice key={lang.id} 
                                                                                                   data={lang} 
                                                                                                   usedLanguages={this.state.usedLanguages} />) }>
                                            </FormControl>
                                        </FormGroup>
                                    </td>
                                }
                            </tr>
                            <tr>
                                <td><label htmlFor="pres_content">Presentation</label></td>
                                <td>
                                    <FormGroup controlId="formControlsTextarea">
                                        <FormControl componentClass="textarea" 
                                                     placeholder={"Mention the title of your presentation page on the first line! (e.g. 'About me')\r\n\r\nTell your story"} 
                                                     style={{height: '400px'}}
                                                     name="presentation[content]" 
                                                     value={this.state.presentation_content || ''} 
                                                     onChange={this.handleContent} />
                                    </FormGroup>
                                </td>
                            </tr>
                        </tbody>
                    </Table>

                    <div className="actions">
                        <input type="submit" name="commit" value={ this.state.presentation_id ? "Submit changes" : "Create presentation"} />
                    </div>
                </form>
            </div>
        );
    }
}

export default PresentationForm;