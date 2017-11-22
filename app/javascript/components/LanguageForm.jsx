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
                        languages: [],
                        language_id: this.props.match.params ? this.props.match.params.language_id : '',
                        language_name: this.props.language_data ? this.props.language_data.name : '',
                        language_abbr: this.props.language_data ? this.props.language_data.abbreviation : ''})
        this.handleLanguageName = this.handleLanguageName.bind(this);
        this.handleLanguageAbbr = this.handleLanguageAbbr.bind(this);
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
        let lang_abbr = [];
        let lang_names = [];
        Object.values(this.state.languages).map(l => l.id != this.state.language_id ? lang_abbr.push(l.abbreviation) : null);
        Object.values(this.state.languages).map(l => l.id != this.state.language_id ? lang_names.push(l.name) : null);        
        if (!this.state.language_abbr || this.state.language_abbr.length < 2 
            || !this.state.language_name || this.state.language_name.length < 2) {
            alert("A language abbreviation length must be between 2 and 5 chars, and its name between 2 and 30 chars.");
            event.preventDefault();
        }
        if (lang_abbr.includes(this.state.language_abbr)) {
            alert("The language abbreviation you entered already exists.");
            event.preventDefault();
        }
        if (lang_names.includes(this.state.language_name)) {
            alert("The language name you entered already exists.");
            event.preventDefault();
        }
    }

    render() {
        let form_action = this.state.language_id ? ("/languages/" + this.state.language_id) : ("/languages");
        // need to check if there're query string params for redirection
        window.location.search ? form_action += window.location.search : null;
        const input_edit = this.state.language_id ? React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'}) : null;

        return (
            <div className="form-layout" style={{display: this.state.display}}>
                <div className="admin-page-title">{ this.state.language_id ? "Edit language" : "New language"}

            {window.location.search ? null
                                    : <Button bsStyle="primary" 
                                              bsSize="xsmall" 
                                              className="back-link" 
                                              href="/languages"
                                              style={{marginLeft: '10px'}} >
                                        <span className="glyphicon glyphicon-arrow-left"></span>
                                    </Button>
            }

                </div>
                { this.state.errors ? (<ErrorsComponent errors={this.state.errors} model={"language"} />) : null }
                <form encType="multipart/form-data" action={form_action} method="post" 
                      acceptCharset="UTF-8" onSubmit={this.handleSubmit} style={{marginTop: '20px'}} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly={true} />
                    {input_edit}
                    
                    <Table responsive>
                        <tbody>
                            <tr>
                                <td><label htmlFor="lang_name">Language</label></td>
                                <td><input id="language_name" type="text" name="language[name]" 
                                           value={this.state.language_name || ''} 
                                           onChange={this.handleLanguageName} /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="lang_abbr">Abbreviation</label></td>
                                <td><input id="language_abbr" type="text" name="language[abbreviation]" 
                                           value={this.state.language_abbr || ''} 
                                           onChange={this.handleLanguageAbbr} /></td>
                            </tr>
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