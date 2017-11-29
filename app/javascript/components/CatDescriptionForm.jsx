import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, Table } from 'react-bootstrap';
import ErrorsComponent from './ErrorsComponent';


const LanguageChoice = props => {
    return <option value={props.data.id}>{props.data.name}</option>
};


class CatDescriptionForm extends React.Component {

    componentWillMount() {
        this.setState({ display: "none",
                        token: this.props.token,
                        errors: this.props.cat_description_errors || null,
                        user: this.props.user || null,
                        languages: [],
                        category_name: '',
                        cat_description_id: this.props.match.params.cat_description_id || '',
                        language_id: this.props.cat_description_data ? this.props.cat_description_data.language_id : '',
                        content: this.props.cat_description_data ? this.props.cat_description_data.content : ''});
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

        fetch('/categories/' + this.props.match.params.category_id + '/cat_descriptions.json',
            {credentials: 'same-origin'})
        .then(function(resp) {
            return resp.json();
        })
        .then(function(cat_descriptions) {
            const category_name = cat_descriptions.pop();
            this.setState({ category_name, display: "block" })
        }.bind(this))

    }

    handleContent(event) {
        if (event.target.value.length <= 1000) {
            this.setState({content: event.target.value});
        }  
    }

    handleLanguageId(event) {
        this.setState({language_id: event.target.value});
    }

    handleSubmit(event) {
        let alerts = '';
        if (this.state.content.length < 10) {
            alerts += "A category description must be at least 10 characters long and at most 1000 characters. "
        }
        if (!this.state.language_id || this.state.language_id == "-- select --") {
            alerts += "Please select a language."
        }
        if (alerts) {
            alert(alerts);
            event.preventDefault();
        }
    }

    render() {
        const form_action = this.state.cat_description_id ?
                            ("/categories/" + this.props.match.params.category_id + "/cat_descriptions/" + this.state.cat_description_id)
                            : ("/categories/" + this.props.match.params.category_id + "/cat_descriptions");
        const input_edit = this.state.cat_description_id ? React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'}) : null;
        const newLangLink = (this.state.user && this.state.user.superadmin) ?
                                (<Button id="new_lang_link" bsSize="xsmall" bsStyle="success" 
                                         style={{marginLeft: '7px', paddingRight: '3px', opacity: '0.75'}}
                                         href={"/languages/new?redirect_to_cat_desc_edit=" + encodeURIComponent(this.props.match.url)}>
                                    <span className="glyphicon glyphicon-plus"></span>
                                </Button>)
                                : null;
        const page_title = this.state.cat_description_id ?
                                ("Edit '" + this.state.category_name + "' description")
                                : ("Create description for " + this.state.category_name);

        return (
            <div className="form-layout" style={{display: this.state.display}}>
                <div className="admin-page-title">{page_title}
                    <Button bsStyle="primary"
                            bsSize="xsmall" 
                            style={{marginLeft: '10px'}}
                            className="back-link" 
                            href={"/categories/" + this.props.match.params.category_id + "/edit"}>
                        <span className="glyphicon glyphicon-arrow-left"></span>
                    </Button>
                </div>

                { this.state.errors ? (<ErrorsComponent errors={this.state.errors} model={"cat_description"} />) : null }

                <form encType="multipart/form-data" action={form_action} method="post" 
                      acceptCharset="UTF-8" onSubmit={this.handleSubmit} style={{marginTop: '20px'}} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly={true} />
                    {input_edit}
                    <input type="hidden" value={this.props.match.params.category_id} name="cat_description[category_id]" />
                    
                    <Table responsive bordered striped id="catdescription_form_table">
                        <tbody>
                            <tr>
                                <td><label htmlFor="choose-language">Language</label>{newLangLink}</td>
                                <td>
                                    <FormGroup controlId="formControlsSelect">
                                        <FormControl componentClass="select" 
                                                     value={this.state.language_id || "-- select --"} 
                                                     name="cat_description[language_id]" 
                                                     onChange={this.handleLanguageId}>
                                            <option value="-- select --">-- select --</option>
                                            { this.state.languages.map(pres => <LanguageChoice key={pres.id} data={pres} />) }>
                                        </FormControl>
                                    </FormGroup>
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="pres_content">Description</label></td>
                                <td>
                                    <FormGroup controlId="formControlsTextarea">
                                        <FormControl componentClass="textarea" 
                                                     placeholder={"Describe " + this.state.category_name}
                                                     style={{height: '250px'}}
                                                     name="cat_description[content]" 
                                                     value={this.state.content || ''} 
                                                     onChange={this.handleContent} />
                                    </FormGroup>
                                </td>
                            </tr>
                        </tbody>
                    </Table>

                    <div className="actions">
                        <input type="submit" name="commit" value={ this.state.cat_description_id ? "Submit changes" : "Create description"} />
                    </div>
                </form>
            </div>
        );
    }
}

export default CatDescriptionForm;