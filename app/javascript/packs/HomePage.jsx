import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

class HomePage extends React.Component {

    componentWillMount() {
        this.setState({ picsSelection: [], picIndex: 0 });
        this.changePic = this.changePic.bind(this);
        this.changeSlides = this.changeSlides.bind(this);
        this.timer = setInterval(this.changePic, 3000);
    }

    changePic() {
        if (this.state.picIndex < this.state.picsSelection.length - 1) {
            this.setState({ picIndex: this.state.picIndex + 1 })
        } else {
            this.setState({ picIndex: 0 })
        }
    }

    changeSlides(n) {
        clearInterval(this.timer);
        if (n == 1) {
            if (this.state.picIndex < this.state.picsSelection.length - 1) {
                this.setState({ picIndex: this.state.picIndex + 1 });
            } else {
                this.setState({ picIndex: 0 });
            }
        } else {
            if (this.state.picIndex == 0) {
                this.setState({ picIndex: this.state.picsSelection.length - 1 });
            } else {
                this.setState({ picIndex: this.state.picIndex - 1 });
            }
        }
        this.timer = setInterval(this.changePic, 3000);
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
                <div className="page-title">Welcome!</div>
                
                {this.state.picsSelection.length > 0 ?
                    (<div id="pic-element">
                        <Link to={"/categories/" + (this.state.picsSelection[this.state.picIndex].selectionPicCatId) + "/pictures"}>
                            <img src={this.state.picsSelection[this.state.picIndex].selectionPicUrl} />
                            <div id="category-name">{this.state.picsSelection[this.state.picIndex].selectionPicCatName.toUpperCase()}</div>
                        </Link>
                        <div className="prev" onClick={() => this.changeSlides(-1)}><span className="glyphicon glyphicon-chevron-left"></span></div>
                        <div className="next" onClick={() => this.changeSlides(1)}><span className="glyphicon glyphicon-chevron-right"></span></div>
                    </div>)
                    : null
                }
            </div>
        );
    }
}

export default HomePage;