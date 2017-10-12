import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Table } from 'react-bootstrap';

const EditDeleteLanguage = props => {
    return (
      <div id="edit-delete-lang" style={{ display: "inline" }}>
        <Button bsSize="xsmall" bsStyle="info" style={{ marginRight: 5 + "px" }} 
                href={ "/languages/" + props.lang_id + "/edit" }>
          <span className="glyphicon glyphicon-edit"></span>
        </Button>
        <Button bsSize="xsmall" bsStyle="danger" href={ "/languages/" + props.lang_id } data-method="delete">
          <span className="glyphicon glyphicon-trash"></span>
        </Button>
      </div>
    );
};

const LanguageComponent = props => (
    <tr className="language-element">
        <td>{props.language.id}</td>
        <td>{props.language.name}</td>
        <td>{props.language.abbreviation}</td>
        <td><EditDeleteLanguage lang_id={props.language.id} /></td>
    </tr>
);


class Languages extends React.Component {
    
      componentWillMount() {
        this.setState({ languages: [] });
      }
    
      componentDidMount() {
        fetch('/languages.json', {credentials: 'same-origin'})
        .then(function(resp) {
          return resp.json();
        })
        .then(function(languages) {
          this.setState({ languages })
        }.bind(this))
      }
      
      render() {
        return (
          <div id="languages">
            <div className="admin-page-title">
              Available languages <Button className="new-language-button" 
                                          bsStyle="success" 
                                          bsSize="xsmall" 
                                          href="/languages/new">New language</Button>
            </div>
            <Table striped bordered condensed hover id="language-table">
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