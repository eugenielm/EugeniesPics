import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import ErrorsComponent from './ErrorsComponent';

class UserForm extends React.Component {

    componentWillMount() {
        this.setState({ token: this.props.token,
                        errors: this.props.userErrors || null,
                        id: this.props.userData.id || null,
                        username: this.props.userData.username || '',
                        email: this.props.userData.email || '',
                        password: this.props.userData.password_digest || '',
                        passwordConfirmation: this.props.userData.password_digest || '',
                        user: this.props.user,
                        passwordFieldDisabled: true,
                        })
        this.handleUsername = this.handleUsername.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handlePasswordConfirmation = this.handlePasswordConfirmation.bind(this);
        this.handlePasswordField = this.handlePasswordField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsername(event) {
        if (event.target.value.match(/^[\w\ -]{0,72}$/)) {
            this.setState({username: event.target.value});
        }  
    }

    handleEmail(event) {
        this.setState({email: event.target.value});
    }

    handlePassword(event) {
        this.setState({password: event.target.value});
    }

    handlePasswordConfirmation(event) {
        this.setState({passwordConfirmation: event.target.value});
    }

    handleSubmit(event) {
        var alerts = "";
        if (!this.state.username || this.state.username.length < 4) {
            alerts += "A username must be at least 4 characters long (max 72 char).\n";
        }
        if (!this.state.email || this.state.email.length > 255 || (this.state.email.match(/\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i)) !== null) {
            alerts += "Please enter a valid email address.\n";
        }
        if (this.state.password !== this.state.password_confirmation) {
            alerts += "Your password doesn't match the confirmation.\n";
        }
        if (!this.state.password || this.state.password.length < 6) {
            alerts += "Your password must be at least 6 characters long.\n";
        }
        if (this.state.user && !this.state.user.superadmin && this.state.user.id != this.state.id) {
            alerts += "You don't have the required permissions for this action."
        }
        if (alerts) {
            alert(alerts);
            event.preventDefault();
        }
    }

    handlePasswordField() {
        this.setState({passwordFieldDisabled: false, password: '', passwordConfirmation: ''});
    }

    render() {
        const page_title = !this.state.id ? "Create user" : "Edit user";
        const form_action = this.state.id ? ("/users/" + this.state.id) : ("/users");
        const input_edit = this.state.id ? React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'}) : null;
        const back_to_users = this.state.user && this.state.user.superadmin ? 
            <Button bsStyle="primary" bsSize="xsmall" className="back-link" style={{marginLeft: "5px"}}>
                <Link to="/users">
                    <span className="glyphicon glyphicon-arrow-left"></span>
                </Link>
            </Button> 
            : null;

        return (
            <div className="form-layout">
                <div className="admin-page-title">{page_title} {back_to_users}</div>
                <ErrorsComponent errors={this.state.errors} model={"user"} />
                <form encType="multipart/form-data" action={form_action} method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.state.token} readOnly={true} />
                    {input_edit}

                    {this.state.passwordFieldDisabled && this.state.id ?

                        <Table bordered striped id="user_form_table">
                            <tbody>
                                <tr>
                                    <td><label htmlFor="user_username">Username</label></td>
                                    <td><input id="user_username" type="text" name="user[username]" maxLength="72" value={this.state.username || ''} onChange={this.handleUsername} /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="user_email">Email address</label></td>
                                    <td><input id="user_email" type="email" name="user[email]" maxLength="255" value={this.state.email || ''} onChange={this.handleEmail} /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="user_password">Password &nbsp;
                                            <a target="_blank" onClick={this.handlePasswordField} 
                                                               style={{fontWeight: 'normal', fontSize: '11px'}}>
                                                [Change]
                                            </a>
                                        </label>
                                    </td>
                                    <td>••••••••••••••••</td>
                                </tr>
                            </tbody>
                        </Table>
                    :
                        <Table bordered striped id="user_form_table">
                            <tbody>
                                <tr>
                                    <td><label htmlFor="user_username">Username</label></td>
                                    <td><input id="user_username" type="text" name="user[username]" maxLength="72" value={this.state.username || ''} onChange={this.handleUsername} /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="user_email">Email address</label></td>
                                    <td><input id="user_email" type="email" name="user[email]" maxLength="255" value={this.state.email || ''} onChange={this.handleEmail} /></td>
                                </tr>

                                <tr>
                                    <td><label htmlFor="user_password">Password</label></td>
                                    <td><input id="user_password" type="password" name="user[password]" 
                                               value={this.state.password || ''} 
                                               onChange={this.handlePassword} /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="user_password_confirmation">Password confirmation</label></td>
                                    <td><input id="user_password_confirmation" type="password" name="user[password_confirmation]" 
                                               value={this.state.passwordConfirmation || ''} 
                                               onChange={this.handlePasswordConfirmation} /></td>
                                </tr>
                            </tbody>
                        </Table>
                    }

                    <div className="actions">
                        <input type="submit" name="commit" value={this.state.id ? "Submit changes" : "Create user"} />
                    </div>
                </form>
            </div>
        );
    }
}

export default UserForm;