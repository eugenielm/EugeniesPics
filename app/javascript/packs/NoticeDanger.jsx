import React from 'react';
import ReactDOM from 'react-dom';

const SingleNotice = props => {
    return <p>{props.flash}</p>
};

class NoticeDanger extends React.Component {
    componentWillMount() {
        this.setState({ flash_danger: this.props.flash_danger,
                        display: true })
    }

    componentDidMount() {
        window.setTimeout(function() {
            this.setState({ flash_danger: null, display: false })
        }.bind(this), 10000)
    }

    render() {
        if (this.state.display) {
            return (
                <div id="notice_danger">
                    {this.state.flash_danger.map(f => <SingleNotice key={this.state.flash_danger.indexOf(f)} flash={f}/>)}
                </div>
            );
        }
        return null;
    }
}

export default NoticeDanger;