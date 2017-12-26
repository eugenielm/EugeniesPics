import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Modal, Table, OverlayTrigger, Popover } from 'react-bootstrap';

const unauthorizedActionPopover = (
    <Popover id="popover-trigger-click-hover" title="">
      You don't have the permissions to delete this user.
    </Popover>
);

class UserDetails extends React.Component {
    componentWillMount() {
        this.setState({ user: undefined, displayDeleteModal: false });
    }

    componentDidMount() {
        const url = '/users/' + this.props.match.params.user_id + '.json';
        fetch(url, { credentials: 'same-origin' })
        .then(function(resp) {
            return resp.json();
        })
        .then(function(user) {
            this.setState({ user })
        }.bind(this))
    }

    render() {
        if (this.state.user) {
            if (this.props.user && this.props.user.superadmin || this.state.user.id == this.props.match.params.user_id) {
                const admin = this.state.user.superadmin ? 'yes' : 'no';
                return (
                    <div className="user-info" style={{display: this.state.display}}>
                        <div className="admin-page-title">
                            Profile details of '{this.state.user.username}' 
                            { this.props.user.superadmin ?
                                (<Button bsSize="xsmall" bsStyle="primary" className="back-link" style={{marginLeft: 10 + 'px'}}>
                                    <Link to="/users">Back to all users</Link>
                                </Button>)
                            : null }
                        </div>


                        <Table responsive bordered striped id="user_details_table">
                            <tbody>
                                <tr>
                                    <td><label>Username</label></td>
                                    <td>{this.state.user.username}</td>
                                </tr>
                                <tr>
                                    <td><label>Email address</label></td>
                                    <td>{this.state.user.email}</td>
                                </tr>
                                <tr>
                                    <td><label>Admin</label></td>
                                    <td>{admin}</td>
                                </tr>
                                <tr>
                                    <td><label>Created</label></td>
                                    <td>{this.state.user.created_at}</td>
                                </tr>
                                <tr>
                                    <td><label>Updated</label></td>
                                    <td>{this.state.user.updated_at}</td>
                                </tr>
                            </tbody>
                        </Table>

                        <Button bsSize="xsmall" bsStyle="success" href={ "/users/" + this.state.user.id + "/edit" } style={{marginRight: 10 + 'px'}} >
                            <span className="glyphicon glyphicon-edit"></span>
                        </Button>

                        <Button bsSize="xsmall" bsStyle="danger" onClick={() => this.setState({displayDeleteModal: true})}>
                            <span className="glyphicon glyphicon-trash"></span>
                        </Button>
                            
                        <Modal show={this.state.displayDeleteModal}>
                            <Modal.Body>
                                {this.props.user.superadmin ?
                                    <div className="confirm_delete_modal">
                                        Are you sure you want to destroy {this.state.user.username}'s profile?
                                        <br/><br/>
                                
                                        <Button bsStyle="danger" 
                                                bsSize="xsmall"
                                                onClick={() => this.setState({displayDeleteModal: false})}
                                                href={ "/users/" + this.state.user.id }
                                                data-method="delete"
                                                style={{marginLeft: '5px'}}
                                                >Yes
                                        </Button>
                                    
                                        <Button bsSize="xsmall" bsStyle="primary" style={{marginLeft: '30px'}} 
                                                onClick={() => this.setState({displayDeleteModal: false})}>No</Button>
                                    </div>
                                :
                                <OverlayTrigger trigger={['hover', 'click']} placement="bottom" overlay={unauthorizedActionPopover}>
                                    <div className="confirm_delete_modal">
                                        Are you sure you want to destroy {this.state.user.username}'s profile?
                                        <br/><br/>
                                    
                                        <Button bsStyle="danger" 
                                                bsSize="xsmall"
                                                disabled={true}
                                                style={{marginLeft: '5px'}}
                                                >Yes
                                        </Button>
                                    
                                        <Button bsSize="xsmall" bsStyle="primary" style={{marginLeft: '30px'}} 
                                                onClick={() => this.setState({displayDeleteModal: false})}>No</Button>
                                    </div>
                                </OverlayTrigger>
                                }
                            </Modal.Body>
                        </Modal>
                    </div>
                );
            }
            return null;   
        }
        return null;
    }
}

export default UserDetails;