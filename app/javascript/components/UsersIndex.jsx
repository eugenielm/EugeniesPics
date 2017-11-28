import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Table, Modal } from 'react-bootstrap';

class UserComponent extends React.Component {
    componentWillMount() {
        this.setState({displayDeleteModal: false});
    }

    render() {
        const user = this.props.data;
        const admin = user.superadmin ? 'yes' : 'no';
        return (
            <tr>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.id}</td>
                <td>{admin}</td>
                <td style={{textAlign: "center"}}>
                    <Link to={ "/users/" + user.id } style={{color: 'black'}} >
                        <span className="glyphicon glyphicon-eye-open"></span>
                    </Link>
                </td>
                <td style={{textAlign: "center"}}>
                    <a href={ "/users/" + user.id + "/edit" } style={{color: '#439ce8'}} >
                        <span className="glyphicon glyphicon-edit"></span>
                    </a>
                </td>                
                <td style={{textAlign: "center"}}>
                    <a style={{cursor: 'pointer', color: '#bb0707'}} 
                       onClick={() => this.setState({displayDeleteModal: true})} >
                        <span className="glyphicon glyphicon-trash"></span>
                    </a>
                </td>

                <Modal show={this.state.displayDeleteModal} style={{padding: '15px', marginTop: '30vh'}}>
                    <Modal.Body>
                        <div style={{margin: '20px'}}>
                            Are you sure you want to destroy {user.username}'s profile?
                            <br/><br/>
                            <Button bsStyle="danger" 
                                    bsSize="xsmall"
                                    onClick={() => this.setState({displayDeleteModal: false})}
                                    href={ "/users/" + user.id }
                                    data-method="delete"
                                    >Yes
                            </Button>
                            <Button bsSize="xsmall" bsStyle="primary" style={{marginLeft: '30px'}} 
                                    onClick={() => this.setState({displayDeleteModal: false})}>No</Button>
                        </div>
                    </Modal.Body>
                </Modal>

            </tr>
        );
    }
};

class UsersIndex extends React.Component {
    componentWillMount() {
        this.setState({ users: [], display: "none" })
    }

    componentDidMount() {
        fetch('/users.json', {credentials: 'same-origin'})
        .then(function(resp) {
            return resp.json()
        })
        .then(function(res) {
            this.setState({ users: res, display: "block" });
        }.bind(this))
    }

    render() {
        return (
            <div className="user-info" style={{display: this.state.display}}>
                <div className="admin-page-title" style={{textAlign: 'center'}}>
                    Users <Button href="/users/new" bsSize="xsmall" bsStyle="success" style={{opacity: '0.75'}}>
                            <span className="glyphicon glyphicon-plus"></span>
                          </Button>
                </div>
                <br/>

                <Table bordered condensed hover responsive id="users_table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>ID</th>
                            <th>Admin</th>
                            <th style={{textAlign: "center"}}>View User</th>
                            <th style={{textAlign: "center"}}>Edit User</th>
                            <th style={{textAlign: "center"}}>Delete User</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.users.map(user => <UserComponent key={user.id} data={user}/>) }
                    </tbody>
                </Table>
            
            </div>
        );
    }
}

export default UsersIndex;