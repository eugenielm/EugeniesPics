import React from 'react';
import ReactDOM from 'react-dom';

const SingleNotice = props => {
    return <p>{props.flash}</p>
};

class NoticeInfo extends React.Component {
    componentWillMount() {
        this.setState({ flash_info: this.props.flash_info,
                        display: true })
    }

    componentDidMount() {
        window.setTimeout(function() {
            this.setState({ flash_info: null, display: false })
        }.bind(this), 10000)
    }

    render() {
        if (this.state.display) {
            return (
                <div id="notice_info">
                    {this.state.flash_info.map(f => <SingleNotice key={this.state.flash_info.indexOf(f)} flash={f}/>)}
                </div>
            );
        }
        return null;
    }
}

export default NoticeInfo;