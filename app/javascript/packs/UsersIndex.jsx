import React from 'react'
import ReactDOM from 'react-dom'

const UserComponent = props => {
    const user = props.data;
    const admin = user.superadmin ? 'yes' : 'no';
    return (
        <tr>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.id}</td>
            <td>{admin}</td>
            <td><a href={ "/users/" + user.id } >View user</a></td>
            <td><a href={ "/users/" + user.id + "/edit" } >Edit user</a></td>
            <td><a data-method="delete" href={ "/users/" + user.id } >Delete user</a></td>
        </tr>
    );
};

const UsersIndex = props => {
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
                        { props.data.map(user => <UserComponent key={user.id} data={user}/>) }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

document.addEventListener('turbolinks:load', () => {
    if (document.getElementById('users_data') && window.user && window.user.superadmin) {
        const users = JSON.parse(document.getElementById('users_data').getAttribute('data'));
        ReactDOM.render(
            <UsersIndex data={users} />,
            document.getElementById('users_index'),
        );
    }
});