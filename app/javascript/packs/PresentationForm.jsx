import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, Table } from 'react-bootstrap';
import ErrorsComponent from './ErrorsComponent';


const LanguageChoice = props => {
    return <option value={props.data.id}>{props.data.name}</option>
};


class PresentationForm extends React.Component {

    componentWillMount() {
        this.setState({ token: this.props.token,
                        errors: this.props.presentation_errors || null,
                        user: this.props.user || null,
                        languages: [],
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
            this.setState({ languages });
          }.bind(this))

        if (this.state.presentation_id) {
            fetch('/presentations/' + this.state.presentation_id + '.json',
                 {credentials: 'same-origin'}
                 )
            .then(function(resp) {
                return resp.json();
              })
              .then(function(pres) {
                this.setState({ presentation_content: pres.content,
                                presentation_language_id: pres.lang_id });
              }.bind(this))
        }
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
        console.log("this.state.presentation_language_id: ", this.state.presentation_language_id, "this.state.presentation_content: ", this.state.presentation_content);
        let alerts = '';
        if (this.state.presentation_content.length < 10) {
            alerts += "A presentation must be at least 10 characters long and at most 1000 characters. "
        }
        if (!this.state.presentation_language_id || this.state.presentation_language_id == "-- select --") {
            alerts += "Please select a language."
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
                            (<Button id="new_lang_link" bsSize="xsmall" bsStyle="success" href="/languages/new">New language</Button>) : null;
        const page_title = this.state.presentation_id ? "Edit presentation" : "New presentation";

        return (
            <div className="form-layout">
                <h2>{page_title} <Button bsStyle="primary" bsSize="xsmall" className="back-link" href="/presentations">Back to presentations</Button></h2>
                { this.state.errors ? (<ErrorsComponent errors={this.state.errors} model={"presentation"} />) : null }
                <form encType="multipart/form-data" action={form_action} method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly={true} />
                    {input_edit}
                    
                    <Table responsive>
                        <tbody>
                            <tr>
                                <td><label htmlFor="choose-language" style={{display: "block"}}>Language</label>{newLangLink}</td>
                                <td>
                                    <FormGroup controlId="formControlsSelect">
                                        <FormControl componentClass="select" value={this.state.presentation_language_id || "-- select --"} name="presentation[language_id]" onChange={this.handleLanguageId}>
                                            <option value="-- select --">-- select --</option>
                                            { this.state.languages.map(pres => <LanguageChoice key={pres.id} data={pres} />) }>
                                        </FormControl>
                                    </FormGroup>
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="pres_content">Presentation</label></td>
                                <td>
                                    <FormGroup controlId="formControlsTextarea">
                                        <FormControl componentClass="textarea" 
                                                     placeholder="Tell your story" 
                                                     style={{height: 500 + 'px'}}
                                                     name="presentation[content]" 
                                                     value={this.state.presentation_content || ''} 
                                                     onChange={this.handleContent} />
                                    </FormGroup>
                                </td>
                            </tr>
                            <tr><td></td><td></td></tr>
                        </tbody>
                    </Table>

                    <div className="actions">
                        <input type="submit" name="commit" value={ this.state.presentation_id ? "Edit presentation" : "Create presentation"} />
                    </div>
                </form>
            </div>
        );
    }
}

export default PresentationForm;