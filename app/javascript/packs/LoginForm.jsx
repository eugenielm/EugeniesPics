import React from 'react'
import ReactDOM from 'react-dom'

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.token = props.token;
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
            <div>
                <h1>Login</h1>
                <form action='/login' method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.token} readOnly={true} />
                    <div className="field">
                        <label htmlFor="session_email">Email</label>
                        <input id="user_email" type="email" name="session[email]" value={this.state.email || ''} onChange={this.handleEmailChange} />
                    </div>
                    <div className="field">
                        <label htmlFor="session_password">Password</label>
                        <input id="user_password" type="password" name="session[password]" value={this.state.password || ''} onChange={this.handlePasswordChange} />
                    </div>
                    <div className="actions">
                        <input type="submit" name="commit" value="Log in" />
                    </div>
                </form>
            </div>
        );
    }
}



document.addEventListener('turbolinks:load', () => {
    if (document.getElementById('login_form')) {
        const csrf_token = document.getElementById('csrf_token').getAttribute('data').split('content=')[2].slice(1, -4);
        ReactDOM.render(
            <LoginForm token={csrf_token} />,
            document.getElementById('login_form'),
        );
    }
});