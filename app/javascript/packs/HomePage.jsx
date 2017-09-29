import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';


const PicElement = props => {
    return  (
            <div id="pic-element">
                <div id="displayed-pic">
                    <Link to={"/categories/" + (props.picture.selectionPicCatId) + "/pictures"}>
                        <img src={props.picture.selectionPicUrl} />
                    </Link>
                </div>
                <div id="catname">{props.picture.selectionPicCatName}</div>
            </div>
            );
};

class HomePage extends React.Component {

    componentWillMount() {
        this.setState({ picsSelection: [], picIndex: 0 });
        this.changePic = this.changePic.bind(this);
        this.timer = setInterval(this.changePic, 5000);
    }

    changePic() {
        if (this.state.picIndex < this.state.picsSelection.length - 1) {
            this.setState({ picIndex: this.state.picIndex + 1 })
        } else {
            this.setState({ picIndex: 0 })
        }
    }

    componentDidMount() {
        fetch('/index.json')
        .then(function(resp) {
            return resp.json();
        })
        .then(function(picsSelection) {
        this.setState({ picsSelection })
        }.bind(this))
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        return (
            <div id="home-page">
                <div id="home-page-title">Welcome to Eugénie's photography gallery!</div>
                {this.state.picsSelection.length > 0 ?
                    <PicElement picture={this.state.picsSelection[this.state.picIndex]} />
                    : null
                }
            </div>
        );
    }
}

export default HomePage;