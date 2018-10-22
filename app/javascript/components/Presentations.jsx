import React from 'react';
import { Button, Modal, Popover, OverlayTrigger } from 'react-bootstrap';


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
        <Button bsSize="xsmall" bsStyle="info" style={{ marginLeft: '17px', opacity: '0.75' }} 
                href={ "/presentations/" + this.props.presId + "/edit" }>
          <span className="glyphicon glyphicon-edit"></span>
        </Button>

        <Button bsSize="xsmall" bsStyle="danger" style={{ marginLeft: '20px', outline: 0, opacity: '0.75' }}
                onClick={() => this.setState({displayDeleteModal: true})}>
            <span className="glyphicon glyphicon-trash"></span>
        </Button>

        <Modal show={this.state.displayDeleteModal}>
            <Modal.Body>
              {this.props.user && this.props.user.superadmin ?
                <div className="confirm_delete_modal">
                    Are you sure you want to destroy {this.props.presLang} presentation?
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
                    Are you sure you want to destroy {this.props.presLang} presentation?
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


const PresentationComponent = props => {
  // props.presentation = ['LANG_ABBREV1', [pres_content1, language_name1, pres_id1, lang_id1]]]
  // remove the first line because it's the page title
  const sentences = props.presentation[1][0].split('\r\n');
  return (
    <div className="single-presentation">
      <h4>
        {props.presentation[1][1][0].toUpperCase() + props.presentation[1][1].slice(1)} presentation
        <EditDeletePresentation user={props.user}
                                presId={props.presentation[1][2]} 
                                presLang={props.presentation[1][1]} />
      </h4>
      <div className="presentation-content">
        {sentences.map((s, index) => <p key={index}>{s}</p>)}
      </div>
    </div>
  )
};


class Presentations extends React.Component {
    
      componentWillMount() {
        this.setState({ presentations: {}, display: "none" });
        // presentations = {'LANG_ABBREV1': [pres_content1, language_name1, pres_id1, lang_id1], 'LANG2': [etc.]}
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
            <div className="admin-page-title">'About me' presentations <Button bsStyle="success" 
                                                                               bsSize="xsmall" 
                                                                               style={{opacity: '0.75', paddingLeft: '6px'}}
                                                                               href="/presentations/new">
                                                                          <span className="glyphicon glyphicon-plus"></span>
                                                                      </Button>
            </div>
            { Object.entries(this.state.presentations).map((pres, i) => <PresentationComponent key={i} presentation={pres}/>) }
            {/* presentations = {'LANG_ABBREV1': [pres_content1, language_name1, pres_id1, lang_id1], 'LANG2': [etc.]}, 
                so Object.entries(presentations) returns: [['LANG_ABBREV1', [pres_content1, language_name1, pres_id1, lang_id1]], ['LANG2', [etc.]]] */}
          </div>
        );
      }
    };
    
    export default Presentations;