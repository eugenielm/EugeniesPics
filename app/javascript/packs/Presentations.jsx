import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';

const EditDeletePresentation = props => {
    return (
      <span>
        <Button bsSize="xsmall" bsStyle="info" style={{ marginRight: 5 + "px" }} 
                href={ "/presentations/" + props.pres_id + "/edit" }>
          <span className="glyphicon glyphicon-edit"></span>
        </Button>
        <Button bsSize="xsmall" bsStyle="danger" href={ "/presentations/" + props.pres_id } data-method="delete">
          <span className="glyphicon glyphicon-trash"></span>
        </Button>
      </span>
    );
};

const PresentationComponent = props => {
  const sentences = props.presentation.content.split('\r\n');
  return (
    <div className="single-presentation">
      <h3>{props.presentation.language_name} presentation <EditDeletePresentation pres_id={props.presentation.id} /></h3>
      <div className="presentation-content">
        {sentences.map(s => s ? <p key={props.presentation.id.toString() + sentences.indexOf(s).toString()}>{s}</p> : null)}
      </div>
    </div>
  )
};


class Presentations extends React.Component {
    
      componentWillMount() {
        this.setState({ presentations: [] });
      }
    
      componentDidMount() {
        fetch('/presentations.json', {credentials: 'same-origin'})
        .then(function(resp) {
          return resp.json();
        })
        .then(function(presentations) {
          this.setState({ presentations })
        }.bind(this))
      }
      
      render() {
        return (
          <div id="presentations">
            <div className="admin-page-title">'About me' presentations <Button bsStyle="success" bsSize="xsmall" href="/presentations/new">New presentation</Button></div>
            { this.state.presentations.map(pres => <PresentationComponent user={this.props.user} key={pres.id} presentation={pres}/>) }
          </div>
        );
      }
    };
    
    export default Presentations;