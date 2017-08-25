import React from 'react'
import ReactDOM from 'react-dom'
import ErrorsComponent from './ErrorsComponent'

class CategoryForm extends React.Component {
    constructor(props) {
        super(props);
        this.token = props.token;
        this.category = props.data.id ? props.data : null;
        this.errors = props.errs ? props.errs : null;
        this.state = {name: props.data.name};
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleNameChange(event) {
        if (event.target.value.match(/^[0-9a-zA-Z -]*$/) !== null) {
            this.setState({name: event.target.value});
        }  
    }

    handleSubmit(event) {
        if (!this.state.name || this.state.name.length < 2 || this.state.name.length > 30) {
            alert("A category name must be at least 2 characters long and at most 30 characters.")
            event.preventDefault();
        }
    }

    render() {
        const page_title = (!this.category) ? "New category" : "Edit category";
        const form_action = (this.category) ? ("/categories/" + this.category.id) : ("/categories");
        const input_edit = (this.category) ? React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'}) : null;
        return (
            <div>
                <h1>{page_title}</h1>
                <ErrorsComponent errors={this.errors} model={"category"} />
                <form action={form_action} method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.token} readOnly={true} />
                    {input_edit}
                    <div className="field">
                        <label htmlFor="category_name">Name</label>
                        <input id="category_name" type="text" name="category[name]" value={this.state.name || ''} onChange={this.handleNameChange} />
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
    const errors = JSON.parse(document.getElementById('category_errors').getAttribute('data')).length > 0 ? JSON.parse(document.getElementById('category_errors').getAttribute('data')) : null;
    ReactDOM.render(
        <CategoryForm data={category} token={csrf_token} errs={errors} />,
        document.getElementById('category_form')
    )
  }
})