import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Glyphicon } from 'react-bootstrap';

class HomePage extends React.Component {

    componentWillMount() {
        this.setState({ picsSelection: [] });
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

    render() {
        window.scrollTo(0, 0);
        return (
            <div id="home-page">

                {this.state.picsSelection.length > 0 ?
                    (<Carousel prevIcon={<Glyphicon glyph="glyphicon glyphicon-menu-left" />}
                               nextIcon={<Glyphicon glyph="glyphicon glyphicon-menu-right" />}>
                        {this.state.picsSelection.map(p => 
                            (<Carousel.Item key={p.selectionPicCatId ? p.selectionPicCatId : 0}>
                                <Link to={"/categories/" + p.selectionPicCatId + "/pictures"}>
                                    <img src={p.selectionPicUrl}
                                            alt={p.selectionPicCatName ? p.selectionPicCatName : 'no gallery available'} />
                                </Link>
                                <Carousel.Caption>
                                    <Link to={"/categories/" + p.selectionPicCatId + "/pictures"}>
                                        <p>{p.selectionPicCatName ? p.selectionPicCatName : 'no gallery yet'}</p>
                                    </Link>
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