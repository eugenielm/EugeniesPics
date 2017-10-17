import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, Table } from 'react-bootstrap';
import ErrorsComponent from './ErrorsComponent';


const LanguageChoice = props => {
    return <option value={props.data.id}>{props.data.name}</option>
};


class PicDescriptionForm extends React.Component {

    componentWillMount() {
        this.setState({ display: "none",
                        token: this.props.token,
                        errors: this.props.pic_description_errors || null,
                        user: this.props.user || null,
                        languages: [],
                        picture_title: '',
                        pic_description_id: this.props.match.params.pic_description_id || '',
                        language_id: this.props.pic_description_data ? this.props.pic_description_data.language_id : '',
                        content: this.props.pic_description_data ? this.props.pic_description_data.content : ''});
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
            this.setState({ picture_title, display: "block" })
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
        if (this.state.content.length < 5) {
            alerts += "A picture description must be at least 5 characters long and at most 500 characters. "
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
        const form_action = this.state.pic_description_id ?
                            ("/categories/" + this.props.match.params.category_id + "/pictures/" 
                            + this.props.match.params.picture_id + '/pic_descriptions/' + this.state.pic_description_id)
                            : ("/categories/" + this.props.match.params.category_id + "/pictures/" 
                            + this.props.match.params.picture_id + '/pic_descriptions');
        const input_edit = this.state.pic_description_id ? React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'}) : null;
        const newLangLink = (this.state.user && this.state.user.superadmin) ?
                            (<Button id="new_lang_link" bsSize="xsmall" bsStyle="success" style={{marginLeft: 5 + 'px', paddingRight: 3 + 'px'}}
                                     href={"/languages/new?redirect_to_pic_desc_edit=" + encodeURIComponent(this.props.match.url)}>
                                     <span className="glyphicon glyphicon-plus"></span>
                            </Button>)
                            : null;
        const page_title = this.state.pic_description_id ?
                                ("Edit '" + this.state.picture_name + "' description")
                                : ("Create description for " + this.state.picture_title);

        return (
            <div className="form-layout" style={{display: this.state.display}}>
                <h3>{page_title}
                    <Button bsStyle="primary"
                            bsSize="xsmall" 
                            style={{marginLeft: 10 + 'px'}}
                            className="back-link" 
                            href={"/categories/" + this.props.match.params.category_id 
                                + "/pictures/" + this.props.match.params.picture_id + "/edit"}>
                        <span className="glyphicon glyphicon-arrow-left"></span>
                    </Button>
                </h3>

                { this.state.errors ? (<ErrorsComponent errors={this.state.errors} model={"pic_description"} />) : null }

                <form encType="multipart/form-data" action={form_action} method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly={true} />
                    {input_edit}
                    <input type="hidden" value={this.props.match.params.picture_id} name="pic_description[picture_id]" />
                    
                    <Table responsive bordered striped>
                        <tbody>
                            <tr>
                                <td><label htmlFor="choose-language">Language</label>{newLangLink}</td>
                                <td>
                                    <FormGroup controlId="formControlsSelect">
                                        <FormControl componentClass="select" 
                                                     value={this.state.language_id || "-- select --"} 
                                                     name="pic_description[language_id]" 
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
                                                     placeholder={"Describe " + this.state.picture_title}
                                                     style={{height: 500 + 'px'}}
                                                     name="pic_description[content]" 
                                                     value={this.state.content || ''} 
                                                     onChange={this.handleContent} />
                                    </FormGroup>
                                </td>
                            </tr>
                        </tbody>
                    </Table>

                    <div className="actions">
                        <input type="submit" name="commit" value={ this.state.pic_description_id ? "Submit changes" : "Create description"} />
                    </div>
                </form>
            </div>
        );
    }
}

export default PicDescriptionForm;