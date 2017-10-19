import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';

class AboutPage extends React.Component {
    componentWillMount() {
        this.setState({presentationContent: [],
                       pageTitle: '',
                       language: '',
                       presentations: {}, // Presentation model content attribute
                       availableLanguages: [], 
                       display: 'none'});
        this.handleContent = this.handleContent.bind(this);
    }

    componentDidMount() {
        fetch('/presentations.json', {credentials: 'same-origin'})
        .then(function(resp) {
          return resp.json();
        })
        .then(function(presentations) {
          const availableLanguages = Object.keys(presentations);
          // default presentation will be in English if it exists, else it'll be any random one
          const presentation = Object.entries(presentations).length > 0 ? (presentations['EN'] ? presentations['EN'][0] 
                                                                        : Object.entries(presentations)[0][1][0]) : '';
          const language = Object.entries(presentations).length > 0 ? (presentations['EN'] ? 'EN' : Object.entries(presentations)[0][0]) : '';
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
        this.setState({presentation, presentationContent, pageTitle, language: lang});
    }

    render() {
        const languageButtons = this.state.availableLanguages.map(
                                (lang, i) => <Button bsSize="xsmall" 
                                                     key={i} 
                                                     active={lang == this.state.language ? true : false}
                                                     disabled={lang == this.state.language ? true : false}
                                                     style={{outline: 'none'}}
                                                     className='languagesButtons'
                                                     onClick={() => this.handleContent(lang)}>{lang}</Button>);
        return (
            <div id="about-contact">
                <div className="page-title">{this.state.pageTitle}</div> {languageButtons}
                {this.state.presentationContent.map((s, index) => <p key={index}>{s}</p>)}
            </div>
            )
    }
};

export default AboutPage;