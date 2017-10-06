import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import ErrorsComponent from './ErrorsComponent';


class CategoryForm extends React.Component {

    componentWillMount() {
        this.setState({ token: this.props.token,
                        errors: this.props.category_errors || null,
                        user: this.props.user || null,
                        category_id: this.props.category_data.id || '',
                        cat_name: this.props.category_data.name || '',
                        catpic_url: '',
                        prev_catpic_url: '',
                        catpic_name: '' })
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCatpic = this.handleCatpic.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {

        if (this.state.category_id) {
            fetch('/categories/' + this.state.category_id + '.json',
                 {credentials: 'same-origin'}
                 )
            .then(function(resp) {
                return resp.json();
              })
              .then(function(category) {
                this.setState({ catpic_url: category.catpic_url.small, prev_catpic_url: category.catpic_url.small, catpic_name: category.catpic_file_name });
              }.bind(this))
        }
    }

    handleNameChange(event) {
        if (event.target.value.match(/^[0-9a-zA-Z -]*$/) !== null) {
            this.setState({cat_name: event.target.value});
        }  
    }

    handleCatpic(event) {
        if (event.target.files[0].size < 1000000) {
            this.setState({ catpic_url: event.target.files[0], catpic_name: event.target.files[0].name });
        } else {
            alert("The picture you uploaded exceeded the max size of 1Mb (" + (event.target.files[0].size / 1000) + "ko)");
        }
    }

    handleSubmit(event) {
        if (!this.state.cat_name || this.state.cat_name.length < 2 || this.state.cat_name.length > 30) {
            alert("A category name must be at least 2 characters long and at most 30 characters.")
            event.preventDefault();
        }
    }

    render() {
        const form_action = this.state.category_id ? ("/categories/" + this.state.category_id) : ("/categories");
        const input_edit = this.state.category_id ? React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'}) : null;
        const catpic_info = this.state.category_id ? (this.state.catpic_url == this.state.prev_catpic_url ? 
                                                        (<div><p>Current picture:</p><img src={this.state.catpic_url} /></div>) :
                                                        (<p>Picture about to be uploaded: {this.state.catpic_name}</p>)
                                                    ) :
                                                        (this.state.catpic_url ? (<p>Picture about to be uploaded: {this.state.catpic_name}</p>) : null);

        return (
            <div className="form-layout">
                <h2>{ this.state.category_id ? "Edit category" : "New category"} <Button bsStyle="primary" bsSize="xsmall" className="back-link" href="/categories">Back to categories</Button></h2>
                { this.state.errors ? (<ErrorsComponent errors={this.state.errors} model={"category"} />) : null }
                <form encType="multipart/form-data" action={form_action} method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly={true} />
                    {input_edit}
                    
                    <Table>
                        <tbody>
                            <tr>
                                <td><label htmlFor="category_name">Name</label></td>
                                <td><input id="category_name" type="text" name="category[name]" value={this.state.cat_name} onChange={this.handleNameChange} /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="category_file">Category picture</label></td>
                                <td><input id="category_catpic" accept=".png, .jpg, .jpeg" type="file" name="category[catpic]" onChange={this.handleCatpic} /></td>
                            </tr>
                            <tr><td></td><td></td></tr>
                        </tbody>
                    </Table>

                    { catpic_info }

                    <div className="actions">
                        <input type="submit" name="commit" value={ this.state.category_id ? "Edit category" : "Create category"} />
                    </div>
                </form>
            </div>
        );
    }
}

export default CategoryForm;