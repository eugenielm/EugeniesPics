import React from 'react';
import { Alert } from 'react-bootstrap';

const SingleNotice = props => {
    return <p>{props.flash}</p>
};

class NoticeInfo extends React.Component {
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
                <Alert bsStyle="info" onDismiss={this.handleAlertDismiss} className="notice">
                    {this.props.flashInfo.map(f => <SingleNotice key={this.props.flashInfo.indexOf(f)} flash={f}/>)}
                </Alert>
            );
        }
        return null;
    }
}

export default NoticeInfo;