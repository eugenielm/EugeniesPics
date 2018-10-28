import React from 'react';
import { Button, Table, FormGroup, FormControl, Panel, Modal, Popover, OverlayTrigger, Image } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';


const unauthorizedActionPopover = (
    <Popover id="popover-trigger-click-hover" title="">
      You don't have the permissions to delete this presentation.
    </Popover>
);

class EditDeletePresentation extends React.Component {
    componentWillMount() {
      this.setState({displayDeleteModal: false});
    }
  
    render() {
      return (
        <span>
          <Button bsSize="xsmall" bsStyle="info" style={{ marginLeft: '12px', opacity: '0.75' }} 
                  href={ "/presentations/" + this.props.presId + "/edit" }>
            <span className="glyphicon glyphicon-edit"></span>
          </Button>
  
          <Button bsSize="xsmall" bsStyle="danger" style={{ marginLeft: '15px', outline: 0, opacity: '0.75' }}
                  onClick={() => this.setState({displayDeleteModal: true})}>
              <span className="glyphicon glyphicon-trash"></span>
          </Button>
  
          <Modal show={this.state.displayDeleteModal}>
              <Modal.Body>
                {this.props.user && this.props.user.superadmin ?
                  <div className="confirm_delete_modal">
                      Are you sure you want to delete {this.props.presLang} presentation?
                      <br/><br/>
                      <Button bsStyle="danger" 
                              bsSize="xsmall"
                              onClick={() => this.setState({displayDeleteModal: false})}
                              href={ "/presentations/" + this.props.presId }
                              data-method="delete"
                              >Yes
                      </Button>
                      <Button bsSize="xsmall" bsStyle="primary" style={{marginLeft: '30px'}} 
                              onClick={() => this.setState({displayDeleteModal: false})}>No</Button>
                  </div>
                :
                  <OverlayTrigger trigger={['hover', 'click']} placement="bottom" overlay={unauthorizedActionPopover}>
                    <div className="confirm_delete_modal">
                      Are you sure you want to delete {this.props.presLang} presentation?
                      <br/><br/>
                      <Button bsStyle="danger" 
                              bsSize="xsmall"
                              disabled={true}
                              >Yes
                      </Button>
                      <Button bsSize="xsmall" bsStyle="primary" style={{marginLeft: '30px'}} 
                              onClick={() => this.setState({displayDeleteModal: false})}>No</Button>
                  </div>
                  </OverlayTrigger>
                }  
              </Modal.Body>
          </Modal>
        </span>
      );
    }
  };


class AboutPage extends React.Component {
    componentWillMount() {
        this.setState({presentationContent: [],
                       pageTitle: '',
                       language: this.props.langPref || '',
                       presentations: {}, // Presentation model content attribute
                       availableLanguages: [],
                       userName: '',
                       emailAddress: '',
                       messageBody: '',
                       token: this.props.token,
                       panelOpen: false,
                       recaptchaResponse: null,
                       display: "none"});
        this.handleContent = this.handleContent.bind(this);
        this.handleUserName = this.handleUserName.bind(this);
        this.handleEmailAddress = this.handleEmailAddress.bind(this);
        this.handleMessageBody = this.handleMessageBody.bind(this);
        this.handleRecaptcha = this.handleRecaptcha.bind(this);
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
          // presentations = {'LANG_ABBREV1': [pres_content1, language_name1, pres_id1, lang_id1], 'LANG2': [etc.]}
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
        if (e.target.value.match(/^[A-Za-z\ \u00E0-\u00FC\-¨\^]*$/) !== null) {
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

    handleRecaptcha(e) {
        if (e) {
            this.setState({recaptchaResponse: "ok"});
        } else {
            this.setState({recaptchaResponse: null});
        }
    }

    handleSubmit(e) {
        var alerts = "";
        if (!this.state.recaptchaResponse) {
            alerts += "Please show you're not a robot! ";
        }
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
                                                     style={lang == this.state.language ? {opacity: 0.85} : {opacity: 1}}
                                                     className='lang_btns'
                                                     onClick={() => this.handleContent(lang)}>{lang}</Button>);
        const pres = this.state.presentations[this.state.language];
        return (
            <div id="contact_page" style={{display: this.state.display}}>
                <div className="page-title">
                    {this.state.pageTitle}
                    {pres && this.props.user ?
                        <EditDeletePresentation user={this.props.user}
                                                presId={pres[2]} 
                                                presLang={pres[1]} />
                        : null}
                </div>
                { languageButtons ?
                    <div id="language_buttons">{languageButtons}</div>
                    : null
                }
                <div id="about_presentation">
                    {this.props.idPicture ? 
                        <Image src={this.props.idPicture}
                               alt="Photographer ID picture"
                               id="id_picture" /> : null}
                    {this.state.presentationContent.map((s, index) => <p key={index}>{s}</p>)}
                </div>
                <div id="contact_me">
                    <Button id="contact_btn"
                            onClick={() => this.setState({ panelOpen: !this.state.panelOpen })}>
                        Contact me
                    </Button>
                    <Panel collapsible expanded={this.state.panelOpen}>
                        <form id="contact_form" 
                              encType="multipart/form-data" 
                              action='/about' 
                              method="post" 
                              acceptCharset="UTF-8" 
                              onSubmit={this.handleSubmit}>
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
                                                             style={{height: 220 + 'px'}}
                                                             name="message[body]" 
                                                             value={this.state.messageBody || ''} 
                                                             onChange={this.handleMessageBody} />
                                            </FormGroup>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>

                            <div className="actions">
                                <input type="submit" name="commit" value="Send" disabled={this.props.demoMode} />
                            </div>

                            {!this.props.demoMode ?
                                <ReCAPTCHA sitekey="6LctkTYUAAAAABfLXQzX4brqTbRniz3cuR5AgDYp"
                                        size='compact'
                                        style={{float: 'right', marginTop: '-33px'}}
                                        onChange={(e) => this.handleRecaptcha(e)} />
                                : null}
                        </form>
                    </Panel>
                </div>
            </div>
            )
    }
};

export default AboutPage;