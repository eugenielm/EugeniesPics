import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import ErrorsComponent from './ErrorsComponent';


class LanguageForm extends React.Component {

    componentWillMount() {
        this.setState({ token: this.props.token,
                        errors: this.props.language_errors || null,
                        user: this.props.user || null,
                        language_id: this.props.match.params ? this.props.match.params.language_id : '',
                        language_name: this.props.language_data ? this.props.language_data.name : '',
                        language_abbr: this.props.language_data ? this.props.language_data.abbreviation : ''})
        this.handleLanguageName = this.handleLanguageName.bind(this);
        this.handleLanguageAbbr = this.handleLanguageAbbr.bind(this);
    }

    componentDidMount() {

        if (this.state.language_id) {
            fetch('/languages/' + this.state.language_id + '.json',
                 {credentials: 'same-origin'}
                 )
            .then(function(resp) {
                return resp.json();
              })
              .then(function(lang) {
                this.setState({ language_name: lang.name,
                                language_abbr: lang.abbreviation });
              }.bind(this))
        }
    }

    handleLanguageName(event) {
        if (event.target.value.length <= 30) {
            this.setState({language_name: event.target.value[0].toUpperCase() + event.target.value.slice(1).toLowerCase()});
        } 
    }

    handleLanguageAbbr(event) {
        if (event.target.value.length <= 6) {
            this.setState({language_abbr: event.target.value.toUpperCase()});
        }
    }

    handleSubmit(event) {
        if (this.state.language_abbr.length < 2 || this.state.language_name.length < 2 ) {
            alert("A language abbreviation length must be between 2 and 5 chars, and its name between 2 and 30 chars.")
            event.preventDefault();
        }
    }

    render() {
        const form_action = this.state.language_id ? ("/languages/" + this.state.language_id) : ("/languages");
        const input_edit = this.state.language_id ? React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'}) : null;

        return (
            <div className="form-layout" style={{display: this.state.display}}>
                <h2>{ this.state.language_id ? "Edit language" : "New language"} <Button bsStyle="primary" bsSize="xsmall" className="back-link" href="/languages">Back to languages</Button></h2>
                { this.state.errors ? (<ErrorsComponent errors={this.state.errors} model={"language"} />) : null }
                <form encType="multipart/form-data" action={form_action} method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly={true} />
                    {input_edit}
                    
                    <Table responsive>
                        <tbody>
                            <tr>
                                <td><label htmlFor="lang_name">Language</label></td>
                                <td><input id="language_name" type="text" name="language[name]" value={this.state.language_name || ''} onChange={this.handleLanguageName} /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="lang_abbr">Abbreviation</label></td>
                                <td><input id="language_abbr" type="text" name="language[abbreviation]" value={this.state.language_abbr || ''} onChange={this.handleLanguageAbbr} /></td>
                            </tr>
                            <tr><td></td><td></td></tr>
                        </tbody>
                    </Table>

                    <div className="actions">
                        <input type="submit" name="commit" value={ this.state.language_id ? "Submit changes" : "Create language"} />
                    </div>
                </form>
            </div>
        );
    }
}

export default LanguageForm;