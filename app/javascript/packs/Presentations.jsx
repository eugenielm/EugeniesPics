import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';

const EditDeletePresentation = props => {
    return (
      <span>
        <Button bsSize="xsmall" bsStyle="info" style={{ margin: 0 + "px " + 5 + "px"}} 
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
      <h3>
        {props.presentation.language_name[0].toUpperCase() + props.presentation.language_name.slice(1)} presentation
        <EditDeletePresentation pres_id={props.presentation.id} />
      </h3>
      <div className="presentation-content">
        {sentences.map((s, index) => <p key={index}>{s}</p>)}
      </div>
    </div>
  )
};


class Presentations extends React.Component {
    
      componentWillMount() {
        this.setState({ presentations: [], display: "none" });
      }
    
      componentDidMount() {
        fetch('/presentations.json', {credentials: 'same-origin'})
        .then(function(resp) {
          return resp.json();
        })
        .then(function(presentations) {
          this.setState({ presentations, display: "block" })
        }.bind(this))
      }
      
      render() {
        return (
          <div id="presentations" style={{display: this.state.display}}>
            <div className="admin-page-title">'About me' presentations <Button bsStyle="success" bsSize="xsmall" href="/presentations/new"><span className="glyphicon glyphicon-plus"></span></Button></div>
            { this.state.presentations.map(pres => <PresentationComponent key={pres.id} presentation={pres}/>) }
          </div>
        );
      }
    };
    
    export default Presentations;