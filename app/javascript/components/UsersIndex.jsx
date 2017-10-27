import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';

const UserComponent = props => {
    const user = props.data;
    const admin = user.superadmin ? 'yes' : 'no';
    return (
        <tr>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.id}</td>
            <td>{admin}</td>
            <td style={{textAlign: "center"}}><Link to={ "/users/" + user.id } ><span className="glyphicon glyphicon-eye-open"></span></Link></td>
            <td style={{textAlign: "center"}}><a href={ "/users/" + user.id + "/edit" } ><span className="glyphicon glyphicon-edit"></span></a></td>
            <td style={{textAlign: "center"}}><a data-method="delete" href={ "/users/" + user.id } ><span className="glyphicon glyphicon-trash"></span></a></td>
        </tr>
    );
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
                <div className="admin-page-title" style={{textAlign: 'center'}}>Users <Button href="/users/new" bsSize="xsmall" bsStyle="success">
                                                        <span className="glyphicon glyphicon-plus"></span>
                                                      </Button>
                </div>
                <br/>

                <Table striped bordered condensed hover responsive>
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