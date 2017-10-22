import React from 'react';
import ReactDOM from 'react-dom';
import { Table } from 'react-bootstrap';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: ''};
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value}); 
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value}); 
    }

    handleSubmit(event) {
        var alerts = "";
        if (!this.state.email || this.state.email.length > 255 || (this.state.email.match(/\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i)) !== null) {
            alerts += "Please enter a valid email address. ";
        }
        if (!this.state.password || this.state.password.length < 6) {
            alerts += "Your password must be at least 6 characters long. ";
        }
        if (alerts) {
            alert(alerts);
            event.preventDefault();
        }
    }

    render() {
        return (
            <div className="form-layout">
                <h3 id="login_title">Login</h3>
                <form action='/login' method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit}>
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.props.token} readOnly={true} />
                    
                    <Table id="login_table" responsive bordered>
                        <tbody>
                            <tr>
                                <td><label htmlFor="session_email">Email</label></td>
                                <td><input id="user_email" type="email" name="session[email]" value={this.state.email || ''} onChange={this.handleEmailChange} /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="session_password">Password</label></td>
                                <td><input id="user_password" type="password" name="session[password]" value={this.state.password || ''} onChange={this.handlePasswordChange} /></td>
                            </tr>
                        </tbody>
                    </Table>

                    <div className="actions">
                        <input type="submit" name="commit" value="Log in" />
                    </div>
                </form>
            </div>
        );
    }
}

export default LoginForm;