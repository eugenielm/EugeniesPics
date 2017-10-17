import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class UserDetails extends React.Component {
    componentWillMount() {
        this.setState({ user: undefined, display: "none" });
    }

    componentDidMount() {
        const url = '/users/' + this.props.match.params.user_id + '.json';
        fetch(url, { credentials: 'same-origin' })
        .then(function(resp) {
            return resp.json();
        })
        .then(function(user) {
            this.setState({ user, display: "block" })
        }.bind(this))
    }

    render() {
        if (this.state.user) {
            if (this.props.user && this.props.user.superadmin || this.state.user.id == this.props.match.params.user_id) {
                const admin = this.state.user.superadmin ? 'yes' : 'no';
                return (
                    <div className="user-info" style={{display: this.state.display}}>
                        <h2>
                            Profile details of '{this.state.user.username}' 
                            { this.props.user.superadmin ?
                                (<Button bsSize="xsmall" bsStyle="primary" className="back-link" style={{marginLeft: 10 + 'px'}}>
                                    <Link to="/users">Back to all users</Link>
                                </Button>)
                            : null }
                        </h2>
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
                            <Button bsSize="xsmall" bsStyle="danger" data-method="delete" href={ "/users/" + this.state.user.id } >
                                <span className="glyphicon glyphicon-trash"></span>
                            </Button>
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