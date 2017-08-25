import React from 'react'
import ReactDOM from 'react-dom'

const AllUsersLink = props => {
    if (window.user && window.user.superadmin) {
        return (<a href="/users">Back to all users</a>);
    }
    return null;
}

const UserComponent = props => {
    if (window.user && (window.user.superadmin || (window.user.id == window.location.pathname.split('/').pop())) ) {
        const user = props.data;
        const admin = props.data.superadmin ? 'yes' : 'no';
        return (
            <div>
                <h1>Profile details of '{user.username}'</h1>
                <p><AllUsersLink /></p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Admin:</strong> {admin}</p>
                <p><strong>Created:</strong> {user.created_at}</p>
                <p><strong>Updated:</strong> {user.updated_at}</p>
                <p><a href={ "/users/" + user.id + "/edit" } >Edit user </a>
                   <a data-method="delete" href={ "/users/" + user.id } >Delete user</a>
                </p>
            </div>
        );
    }
    return null;
};

document.addEventListener('turbolinks:load', () => {
    if (document.getElementById('user_data')) {
        ReactDOM.render(
            <UserComponent data={JSON.parse(document.getElementById('user_data').getAttribute('data'))} />,
            document.getElementById('user_page'),
        );
    }
});