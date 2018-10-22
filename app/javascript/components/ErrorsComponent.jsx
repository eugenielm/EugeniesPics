import React from 'react';
import 'babel-polyfill'; // needed for the generator IndexMaker()

function* IndexMaker(){
    let i = 0;
    while (true) {
        yield i++;
    }
}

const gen = IndexMaker();

const ErrorListElement = props => {
    return (<li>{props.err}</li>)
};

const ErrorsComponent = props => {
    const obj = props.model;
    if (props.errors) {
        return (
            <div id="error_explanation">
                <h2>The following error(s) prohibited this {obj} from being saved:</h2>
                <ul>
                    {props.errors.map(e => <ErrorListElement err={e} key={gen.next().value} />)}
                </ul>
            </div>
        );
    }
    return null;
};

export default ErrorsComponent;