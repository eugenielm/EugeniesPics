import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Table, Popover, OverlayTrigger } from 'react-bootstrap';
import ErrorsComponent from './ErrorsComponent';


const CategoryContent = props => {
    const sentences = props.cat_description.content.split('\r\n');
    return (
        <Popover id="popover-positioned-bottom" 
                 positionLeft={props.positionLeft} 
                 positionTop={props.positionTop} 
                 placement="bottom" 
                 title={props.cat_description.language_name + " description"}>
            {sentences.map((s, index) => <p key={index}>{s}</p>)}
            <Button bsStyle="primary" 
                    bsSize="xsmall"
                    href={"/categories/" + props.category_id 
                        + "/cat_descriptions/" + props.cat_description.description_id 
                        + "/edit"}>
                <span className="glyphicon glyphicon-edit"></span>
            </Button>
            <Button bsStyle="danger" 
                    bsSize="xsmall"
                    style={{marginLeft: 5 + 'px'}}
                    href={"/categories/" + props.category_id 
                        + "/cat_descriptions/" + props.cat_description.description_id}
                    data-method="delete">
                <span className="glyphicon glyphicon-trash"></span>
            </Button>
        </Popover>
    )
};


class CategoryForm extends React.Component {

    componentWillMount() {
        this.setState({ token: this.props.token,
                        errors: this.props.category_errors || null,
                        user: this.props.user || null,
                        category_id: this.props.match.params ? this.props.match.params.category_id : '',
                        category_name: '',
                        catpic_url: '',
                        prev_catpic_url: '',
                        catpic_name: '',
                        cat_descriptions: [] })
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
                const cat_info = category.pop();
                this.setState({ category_name: cat_info.category_name,
                                catpic_url: cat_info.catpic_url, 
                                prev_catpic_url: cat_info.catpic_url, 
                                catpic_name: cat_info.catpic_name,
                                cat_descriptions: category });
              }.bind(this))
        }
    }

    handleNameChange(event) {
        if (event.target.value.match(/^[\w\ \u00E0-\u00FC\-¨()[\]_&=+*ˆ@#%\^]{0,30}$/)) {
            this.setState({category_name: event.target.value});
        }  
    }

    handleCatpic(event) {
        if (event.target.files[0].size < 4000000) {
            this.setState({ catpic_url: event.target.files[0], catpic_name: event.target.files[0].name });
        } else {
            alert("The picture you uploaded exceeded the max size of 4Mb (" + (event.target.files[0].size / 1000) + "ko)");
        }
    }

    handleSubmit(event) {
        if (!this.state.category_name || this.state.category_name.length < 2 || this.state.category_name.length > 30) {
            alert("A category name must be at least 2 characters long and at most 30 characters.")
            event.preventDefault();
        }
    }

    render() {
        const input_edit = React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'});
        const catpic_info = this.state.catpic_url == this.state.prev_catpic_url ? 
                                (<div><p>Current picture:</p><img src={this.state.catpic_url} /></div>)
                                : (<p>Picture about to be uploaded: {this.state.catpic_name}</p>);

        const descriptions_popovers = this.state.cat_descriptions.map((d, index) => 
                                        (<OverlayTrigger key={index} trigger="click" 
                                                         placement="bottom"
                                                         overlay={<CategoryContent {...this.props} 
                                                                                   cat_description={d} 
                                                                                   category_name={this.state.category_name}
                                                                                   category_id={this.state.category_id} />}>
                                            <Button bsSize="xsmall" style={{marginLeft: 5 + 'px'}}>{d.language_abbr}</Button>
                                        </OverlayTrigger>));

        const category_form = this.state.category_id ?
                            (<form encType="multipart/form-data" action={"/categories/" + this.state.category_id} 
                                   method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                                <input name="utf8" type="hidden" value="✓" />
                                <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly={true} />
                                {input_edit}
                                <Table striped bordered responsive>
                                    <tbody>
                                        <tr>
                                            <td><label htmlFor="category_name">Name</label></td>
                                            <td><input id="category_name" type="text" name="category[name]" 
                                                       value={this.state.category_name} onChange={this.handleNameChange} /></td>
                                        </tr>
                                        <tr>
                                            <td><label htmlFor="category_descriptions">Category descriptions</label></td>
                                            <td><Button bsStyle="success" 
                                                        bsSize="xsmall"
                                                        href={"/categories/" + this.props.match.params.category_id 
                                                             + "/cat_descriptions/new"}>
                                                    <span style={{paddingLeft: 2 + 'px'}} className="glyphicon glyphicon-plus"></span>
                                                </Button>
                                                {descriptions_popovers}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><label htmlFor="category_file">Category picture</label></td>
                                            <td><input id="category_catpic" accept=".png, .jpg, .jpeg" type="file" 
                                                       name="category[catpic]" onChange={this.handleCatpic} /></td>
                                        </tr>
                                    </tbody>
                                </Table>
                                { catpic_info }
                                <div className="actions">
                                    <input type="submit" name="commit" value="Submit changes" />
                                </div>
                            </form>)

                            :   (<form encType="multipart/form-data" action="/categories" 
                                       method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                                    <input name="utf8" type="hidden" value="✓" />
                                    <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly={true} />                            
                                    <Table responsive bordered>
                                        <tbody>
                                            <tr>
                                                <td><label htmlFor="category_name">Category name</label></td>
                                                <td><input id="category_name" type="text" name="category[name]" 
                                                           value={this.state.category_name} onChange={this.handleNameChange} /></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <div className="actions">
                                        <input type="submit" name="commit" value="Create category" />
                                    </div>
                                </form>);
        
        return (
            <div className="form-layout" style={{display: this.state.display}}>
                
                <h3>{ this.state.category_id ? ("Edit '" + this.state.category_name + "' category") : "New category"}
                    {this.state.category_name && this.state.category_id?
                        <Button bsStyle="primary" bsSize="xsmall" className="back-link" 
                                href={"/categories/" + this.state.category_id} style={{marginLeft: 5 + 'px'}}>
                            Back to {this.state.category_name}
                        </Button>
                        : <Button bsStyle="primary" bsSize="xsmall" className="back-link" href="/categories" style={{marginLeft: 5 + 'px'}}>
                            Back to categories
                          </Button>
                    }
                </h3>
                
                { this.state.errors ? (<ErrorsComponent errors={this.state.errors} model={"category"} />) : null }
                
                {category_form}
                
            </div>
        );
    }
}

export default CategoryForm;