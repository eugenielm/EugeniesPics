import React from 'react';
import ReactDOM from 'react-dom';
import { Alert } from 'react-bootstrap';

const SingleNotice = props => {
    return <p>{props.flash}</p>
};

class NoticeSuccess extends React.Component {
    componentWillMount() {
        this.setState({ alertVisible: true });
        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    }

    componentWillUnmount() {
        this.setState({ alertVisible: false });
    }

    handleAlertDismiss() {
        this.setState({ alertVisible: false });
    }

    render() {
        if (this.state.alertVisible) {
            return (
                <Alert bsStyle="success" onDismiss={this.handleAlertDismiss} className="notice">
                    {this.props.flash_success.map(f => <SingleNotice key={this.props.flash_success.indexOf(f)} flash={f}/>)}
                </Alert>
            );
        }
        return null;
    }
}

export default NoticeSuccess;