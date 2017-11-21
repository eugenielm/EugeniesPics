import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';

class HomePage extends React.Component {

    componentWillMount() {
        this.setState({ picsSelection: [], display: "none" });
        this.triggerShareDialog = this.triggerShareDialog.bind(this);
    }

    componentDidMount() {
        fetch('/index.json')
        .then(function(resp) {
            return resp.json();
        })
        .then(function(picsSelection) {
        this.setState({ picsSelection, display: "block" })
        }.bind(this))
    }

    triggerShareDialog() {
        FB.ui({
            method: 'share',
            href: window.location.origin + "/",
        }, function(response) {
            if (response && !response.error_message) {
                alert('Posting completed!');
            } else {
                alert('Error while posting :\\');
            }
        });
    }

    render() {
        return (
            <div id="home-page" style={{display: this.state.display}}>

            <button id="fb_share_btn" onClick={this.triggerShareDialog}>
                <i className="fa fa-facebook-official"></i>
                <span>Share</span>
            </button>

                {this.state.picsSelection.length > 0 ?
                    (<Carousel>
                        {this.state.picsSelection.map(p => (<Carousel.Item key={p.selectionPicCatId ? p.selectionPicCatId : 0}>
                                                                <Link to={"/categories/" + p.selectionPicCatId + "/pictures"}>
                                                                    <img src={p.selectionPicUrl}
                                                                        alt={p.selectionPicCatName ? p.selectionPicCatName : 'no category'} />
                                                                </Link>
                                                                <Carousel.Caption>
                                                                    <p>{p.selectionPicCatName ? p.selectionPicCatName : 'no category yet'}</p>
                                                                </Carousel.Caption>
                                                            </Carousel.Item>)
                        )}
                    </Carousel>)
                    : null
                }
            </div>
        )
    }
}

export default HomePage;