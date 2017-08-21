import React from 'react'
import ReactDOM from 'react-dom'

class CategoryForm extends React.Component {
    constructor(props) {
        super(props);
        this.token = props.token;
        this.state = this.props.data ? {name: this.props.data.name} : {name: ''};
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleNameChange(event) {
        const isAlphaNum = string => {
            return string.match(/^[0-9a-zA-Z -]+$/) !== null}; 
        if (isAlphaNum(event.target.value)) {
            this.setState({name: event.target.value});
        }  
    }

    handleSubmit(event) {
        if (this.state.name.length < 2 || this.state.name.length > 30) {
            alert("A category name must be at least 2 characters long and at most 30 characters.")
            event.preventDefault();
        }
    }

    render() {
        const page_title = window.location.pathname.split('/').pop() == 'new' ? "New category" : "Edit category";
        return (
            <div>
                <h1>{page_title}</h1>
                <form action="/categories" method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.token} readOnly={true} />
                    <div className="field">
                        <label htmlFor="category_name">Name</label>
                        <input id="category_name" type="text" name="category[name]" value={this.state.name} onChange={this.handleNameChange} />
                    </div>
                    <div className="actions">
                        <input type="submit" name="commit" value="Submit" />
                    </div>
                </form>
            </div>
        );
    }
}

document.addEventListener('turbolinks:load', () => {
  if (document.getElementById('category_form')) {
    const category = document.getElementById('category_instance') ?
                     JSON.parse(document.getElementById('category_instance').getAttribute('data')) : null;
    const csrf_token = document.getElementById('csrf_token').getAttribute('data').split('content=')[2].slice(1, -4);
    ReactDOM.render(
        <CategoryForm data={category} token={csrf_token} />,
        document.getElementById('category_form')
    )
  }
})