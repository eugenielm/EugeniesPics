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
  // props.presentation = ['LANG1', [content1, language1, id1]]
  // remove the first line because it's the page title
  const sentences = props.presentation[1][0].split('\r\n').slice(1);
  return (
    <div className="single-presentation">
      <h3>
        {props.presentation[1][1][0].toUpperCase() + props.presentation[1][1].slice(1)} presentation
        <EditDeletePresentation pres_id={props.presentation[1][2]} />
      </h3>
      <div className="presentation-content">
        {sentences.map((s, index) => <p key={index}>{s}</p>)}
      </div>
    </div>
  )
};


class Presentations extends React.Component {
    
      componentWillMount() {
        this.setState({ presentations: {}, display: "none" });
        // presentations = {'LANG1': [content1, language1, id1], 'LANG2': [content2, language2, id2]}
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
            { Object.entries(this.state.presentations).map((pres, i) => <PresentationComponent key={i} presentation={pres}/>) }
            {/* presentations = {'LANG1': [content1, language1, id1], 'LANG2': [content2, language2, id2]}, 
                so Object.entries(presentations) returns: [['LANG1', [content1, language1, id1]], ['LANG2', [content2, language2, id2]]] */}
          </div>
        );
      }
    };
    
    export default Presentations;