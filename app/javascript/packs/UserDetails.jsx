import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

class UserDetails extends React.Component {
    componentWillMount() {
        this.setState({ user: undefined });
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
                    <div>
                        <h1>Profile details of '{this.state.user.username}'</h1>
                        <p>{ this.props.user.superadmin ? <Link to="/users">Back to all users</Link> : null }</p>
                        <p><strong>Username:</strong> {this.state.user.username}</p>
                        <p><strong>Email:</strong> {this.state.user.email}</p>
                        <p><strong>Admin:</strong> {admin}</p>
                        <p><strong>Created:</strong> {this.state.user.created_at}</p>
                        <p><strong>Updated:</strong> {this.state.user.updated_at}</p>
                        <p><a href={ "/users/" + this.state.user.id + "/edit" } >Edit user </a>
                            <a data-method="delete" href={ "/users/" + this.state.user.id } >Delete user</a>
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