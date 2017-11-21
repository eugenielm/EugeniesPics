import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';

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
                        <br/>
                        <p><strong>Username:</strong> {this.state.user.username}</p>
                        <p><strong>Email:</strong> {this.state.user.email}</p>
                        <p><strong>Admin:</strong> {admin}</p>
                        <p><strong>Created:</strong> {this.state.user.created_at}</p>
                        <p><strong>Updated:</strong> {this.state.user.updated_at}</p>
                        <p>
                            <Button bsSize="xsmall" bsStyle="success" href={ "/users/" + this.state.user.id + "/edit" } style={{marginRight: 10 + 'px'}} >
                                <span className="glyphicon glyphicon-edit"></span>
                            </Button>
                            <Button bsSize="xsmall" bsStyle="danger" onClick={() => this.setState({displayDeleteModal: true})}>
                                <span className="glyphicon glyphicon-trash"></span>
                            </Button>
                            
                            <Modal show={this.state.displayDeleteModal} style={{padding: '15px'}}>
                                <Modal.Body>
                                    <div style={{margin: '20px'}}>
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
                                        <Button bsSize="xsmall" bsStyle="primary" style={{marginLeft: '5px'}} 
                                                onClick={() => this.setState({displayDeleteModal: false})}>No</Button>
                                    </div>
                                </Modal.Body>
                            </Modal>
                        </p>
                    </div>
                );
            }
            return null;   
        }
        return null;
    }
}

export default UserDetails;