import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';


const CustomCarousel = props => {
    return (
        <Carousel.Item>
            <img width={1000} height={800} src={props.url} alt={props.catname ? props.catname : 'no category'} />
            <Carousel.Caption>
                <h4>{props.catname ? props.catname : 'no category yet'}</h4>
            </Carousel.Caption>
        </Carousel.Item>
    )
};

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
        return (
            <div id="home-page">
                <div className="page-title">Welcome!</div>
                
                {this.state.picsSelection.length > 0 ?
                    (<Carousel>
                        {/* {this.state.picsSelection.map(p => <CustomCarousel url={p.selectionPicUrl}
                                                                           catname={p.selectionPicCatName}
                                                                           key={p.selectionPicCatId ? p.selectionPicCatId : 0} />)} */}
                        {this.state.picsSelection.map(p => (<Carousel.Item key={p.selectionPicCatId ? p.selectionPicCatId : 0}>
                                                                <img src={p.selectionPicUrl}
                                                                     alt={p.selectionPicCatName ? p.selectionPicCatName : 'no category'} />
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