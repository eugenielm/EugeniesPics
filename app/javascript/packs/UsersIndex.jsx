import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

const UserComponent = props => {
    const user = props.data;
    const admin = user.superadmin ? 'yes' : 'no';
    return (
        <tr>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.id}</td>
            <td>{admin}</td>
            <td><Link to={ "/users/" + user.id } >View user</Link></td>
            <td><a href={ "/users/" + user.id + "/edit" } >Edit user</a></td>
            <td><a data-method="delete" href={ "/users/" + user.id } >Delete user</a></td>
        </tr>
    );
};

class UsersIndex extends React.Component {
    componentWillMount() {
        this.setState({ users: [] })
    }

    componentDidMount() {
        fetch('/users.json', {credentials: 'same-origin'})
        .then(function(resp) {
            return resp.json()
        })
        .then(function(res) {
            this.setState({ users: res });
        }.bind(this))
    }

    render() {
        return (
            <div>
                <h1>Users</h1>
                <p id="new_user_link"><a href="/users/new">New user</a></p>
                <div id="all_users">
                    <table>
                        <tbody>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>ID</th>
                                <th>Admin</th>
                            </tr>
                            { this.state.users.map(user => <UserComponent key={user.id} data={user}/>) }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default UsersIndex;