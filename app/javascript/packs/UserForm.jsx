import React from 'react'
import ReactDOM from 'react-dom'
import ErrorsComponent from './ErrorsComponent'

class UserForm extends React.Component {
    constructor(props) {
        super(props);
        this.token = props.token;
        this.user = props.u.id ? props.u : null;
        this.errors = props.errs ? props.errs : null;
        this.state = {username: props.u.username,
                      email: props.u.email,
                      password: "",
                      password_confirmation: "",
                      superadmin: false};
        this.handleUsername = this.handleUsername.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handlePasswordConfirmation = this.handlePasswordConfirmation.bind(this);
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
        this.setState({password_confirmation: event.target.value});
    }

    handleSubmit(event) {
        var alerts = "";
        if (!this.state.username || this.state.username.length < 4) {
            alerts += "A username must be at least 4 characters long (max 72 char). ";
        }
        if (!this.state.email || this.state.email.length > 255 || (this.state.email.match(/\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i)) !== null) {
            alerts += "Please enter a valid email address. ";
        }
        if (this.state.password !== this.state.password_confirmation) {
            alerts += "Your password doesn't match the confirmation. ";
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
        const page_title = !this.user ? "New user" : "Edit user";
        const form_action = this.user ? ("/users/" + this.user.id) : ("/users");
        const input_edit = this.user ? React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'}) : null;
        return (
            <div>
                <h1>{page_title}</h1>
                <ErrorsComponent errors={this.errors} model={"user"} />
                <form encType="multipart/form-data" action={form_action} method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.token} readOnly={true} />
                    {input_edit}

                    <p>
                        <label htmlFor="user_username">Username</label>
                        <input id="user_username" type="text" name="user[username]" maxLength="72" value={this.state.username || ''} onChange={this.handleUsername} />
                    </p>

                    <p>
                        <label htmlFor="user_email">Email address</label>
                        <input id="user_email" type="email" name="user[email]" maxLength="255" value={this.state.email || ''} onChange={this.handleEmail} />
                    </p>

                    <p>
                        <label htmlFor="user_password">Password</label>
                        <input id="user_password" type="password" name="user[password]" value={this.state.password || ''} onChange={this.handlePassword} />
                    </p>

                    <p>
                        <label htmlFor="user_password_confirmation">Password confirmation</label>
                        <input id="user_password_confirmation" type="password" name="user[password_confirmation]" value={this.state.password_confirmation || ''} onChange={this.handlePasswordConfirmation} />
                    </p>
                    <div className="actions">
                        <input type="submit" name="commit" value="Submit" />
                    </div>
                </form>
            </div>
        );
    }
}

document.addEventListener('turbolinks:load', () => {
  if (document.getElementById('user_form')) {
    const user = document.getElementById('user_instance') ?
                 JSON.parse(document.getElementById('user_instance').getAttribute('data')) : null;
    const errors = JSON.parse(document.getElementById('user_errors').getAttribute('data')).length > 0 ? JSON.parse(document.getElementById('user_errors').getAttribute('data')) : null;
    const csrf_token = document.getElementById('csrf_token').getAttribute('data').split('content=')[2].slice(1, -4);
    ReactDOM.render(
        <UserForm u={user} token={csrf_token} errs={errors} />,
        document.getElementById('user_form')
    )
  }
});