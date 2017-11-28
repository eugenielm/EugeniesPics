import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Table, Modal } from 'react-bootstrap';

class EditDeleteLanguage extends React.Component {
  componentWillMount() {
    this.setState({displayDeleteModal: false});
  }

  render() {
    return (
      <div id="edit-delete-lang" style={{ display: "inline" }}>
        
        <Button bsSize="xsmall" bsStyle="info" style={{ marginRight: "20px", opacity: '0.75' }} 
                href={ "/languages/" + this.props.lang_id + "/edit" }>
          <span className="glyphicon glyphicon-edit"></span>
        </Button>
        
        <Button bsSize="xsmall" bsStyle="danger" style={{ outline: 0, opacity: '0.75' }}
                onClick={() => this.setState({displayDeleteModal: true})}>
          <span className="glyphicon glyphicon-trash"></span>
        </Button>
        
        <Modal show={this.state.displayDeleteModal} style={{padding: '15px', marginTop: '30vh'}}>
          <Modal.Body>
              <div style={{margin: '20px'}}>
                  Are you sure you want to destroy the {this.props.lang_name} language?
                  <br/><br/>
                  <Button bsStyle="danger" 
                          bsSize="xsmall"
                          onClick={() => this.setState({displayDeleteModal: false})}
                          href={ "/languages/" + this.props.lang_id }
                          data-method="delete"
                          >Yes
                  </Button>
                  <Button bsSize="xsmall" bsStyle="primary" style={{marginLeft: '30px'}} 
                          onClick={() => this.setState({displayDeleteModal: false})}>No</Button>
              </div>
          </Modal.Body>
        </Modal>

      </div>
    );
  }
};

const LanguageComponent = props => (
    <tr className="language-element">
        <td>{props.language.id}</td>
        <td>{props.language.name}</td>
        <td>{props.language.abbreviation}</td>
        <td><EditDeleteLanguage lang_id={props.language.id} lang_name={props.language.name} /></td>
    </tr>
);


class Languages extends React.Component {
    
      componentWillMount() {
        this.setState({ languages: [], display: "none" });
      }
    
      componentDidMount() {
        fetch('/languages.json', {credentials: 'same-origin'})
        .then(function(resp) {
          return resp.json();
        })
        .then(function(languages) {
          this.setState({ languages, display: "block" })
        }.bind(this))
      }
      
      render() {
        return (
          <div id="languages" style={{display: this.state.display}}>
            <div className="admin-page-title">
              Available languages <Button className="new-language-button" 
                                          bsStyle="success" 
                                          bsSize="xsmall" 
                                          style={{opacity: '0.75'}}
                                          href="/languages/new">
                                      <span className="glyphicon glyphicon-plus"></span>
                                  </Button>
            </div>
            <Table bordered condensed hover id="language-table">
              <thead>
                <tr>
                    <th style={{ textAlign: "center" }}>ID</th>
                    <th style={{ textAlign: "center" }}>Name</th>
                    <th style={{ textAlign: "center" }}>Abbreviation</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                { this.state.languages.map(lang => <LanguageComponent key={lang.id} language={lang}/>) }
              </tbody>
            </Table>

          </div>
        );
      }
    };
    
    export default Languages;