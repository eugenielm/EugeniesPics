import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Table, FormGroup, FormControl, Panel } from 'react-bootstrap';

class AboutPage extends React.Component {
    componentWillMount() {
        this.setState({presentationContent: [],
                       pageTitle: '',
                       language: this.props.langPref || '',
                       presentations: {}, // Presentation model content attribute
                       availableLanguages: [], 
                       display: 'none',
                       userName: '',
                       emailAddress: '',
                       messageBody: '',
                       token: this.props.token,
                       panelOpen: false});
        this.handleContent = this.handleContent.bind(this);
        this.handleUserName = this.handleUserName.bind(this);
        this.handleEmailAddress = this.handleEmailAddress.bind(this);
        this.handleMessageBody = this.handleMessageBody.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('/presentations.json', {credentials: 'same-origin'})
        .then(function(resp) {
          return resp.json();
        })
        .then(function(presentations) {
          const availableLanguages = Object.keys(presentations);
          // default presentation will be in English if it exists, else it'll be any random one
          const language = this.state.language ? this.state.language : 
                                                 (Object.entries(presentations).length > 0 ? (presentations['EN'] ? 'EN' : Object.entries(presentations)[0][0]) : '');
          const presentation = Object.entries(presentations).length > 0 ? (language ? presentations[language][0] 
                                                                                    : (presentations['EN'] ? presentations['EN'][0] 
                                                                                                           : Object.entries(presentations)[0][1][0])
                                                                          )
                                                                          : '';
          const presentationContent = presentation.split('\r\n');
          const pageTitle = presentationContent.shift();
          this.setState({ presentations, availableLanguages, presentationContent, pageTitle, language, display: "block" })
          // presentations = {'LANG1': [content1, language1, id1], 'LANG2': [content2, language2, id2]}
        }.bind(this))
    }

    handleContent(lang) {
        const presentation = this.state.presentations[lang][0];
        const presentationContent = presentation.split('\r\n');
        const pageTitle = presentationContent.shift();
        this.props.updateLangPref(lang); // update language preference in App component
        this.setState({presentation, presentationContent, pageTitle, language: lang});
    }

    handleUserName(e) {
        if (e.target.value.match(/^[0-9a-zA-Z -]*$/) !== null) {
            this.setState({userName: e.target.value});
        }
    }

    handleEmailAddress(e) {
        this.setState({emailAddress: e.target.value});
    }

    handleMessageBody(e) {
        if (e.target.value.length <= 1000) {
            this.setState({messageBody: e.target.value});
        } 
    }

    handleSubmit(e) {
        var alerts = "";
        if (!this.state.userName || this.state.userName.length < 2) {
            alerts += "Please enter a valid name (ie. between 2 and 30 characters). ";
        }
        if (!this.state.emailAddress || this.state.emailAddress.length > 255 
            || (this.state.emailAddress.match(/\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i)) !== null) {
            alerts += "Please enter a valid email address. ";
        }
        if (!this.state.messageBody || this.state.messageBody.length < 2) {
            alerts += "Don't forget to say something ;)";
        }
        if (alerts) {
            alert(alerts);
            e.preventDefault();
        }
    }

    render() {
        const languageButtons = this.state.availableLanguages.map(
                                (lang, i) => <Button bsSize="xsmall" 
                                                     key={i} 
                                                     active={lang == this.state.language ? true : false}
                                                     disabled={lang == this.state.language ? true : false}
                                                     className='lang_btns'
                                                     onClick={() => this.handleContent(lang)}>{lang}</Button>);
        return (
            <div id="contact_page">
                <div className="page-title" style={{marginTop: 0 + 'px'}}>{this.state.pageTitle}</div>
                { languageButtons ?
                    <div id="language_buttons">{languageButtons}</div>
                    : null
                }
                <div id="about_presentation">
                    {this.state.presentationContent.map((s, index) => <p key={index}>{s}</p>)}
                </div>
                <div id="contact_me">
                    <Button id="contact_btn" bsSize="small"
                            onClick={() => this.setState({ panelOpen: !this.state.panelOpen })}>
                        Contact me
                    </Button>
                    <Panel collapsible expanded={this.state.panelOpen}>
                        <form id="contact_form" encType="multipart/form-data" action='/about' method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit}>
                            <input name="utf8" type="hidden" value="✓" />
                            <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly={true} />
                            <Table responsive>
                                <tbody>
                                    <tr>
                                        <td><input id="message_name" 
                                                type="text" 
                                                name="message[name]" 
                                                placeholder="Name*"
                                                maxLength="72" 
                                                value={this.state.userName || ''} 
                                                onChange={this.handleUserName} /></td>
                                    </tr>
                                    <tr>
                                        <td><input id="message_email" 
                                                type="email" 
                                                name="message[email]" 
                                                placeholder="Email*"
                                                maxLength="255" 
                                                value={this.state.emailAddress || ''} 
                                                onChange={this.handleEmailAddress} /></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <FormGroup controlId="formControlsTextarea" style={{marginBottom: 0}}>
                                                <FormControl componentClass="textarea" 
                                                             placeholder="Message*"
                                                             style={{height: 300 + 'px'}}
                                                             name="message[body]" 
                                                             value={this.state.messageBody || ''} 
                                                             onChange={this.handleMessageBody} />
                                            </FormGroup>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>

                            <div className="actions" style={{marginTop: 0}}>
                                <input type="submit" name="commit" value="Send" />
                            </div>
                        </form>
                    </Panel>
                </div>
            </div>
            )
    }
};

export default AboutPage;