import React from 'react';
import { Button, Table, Popover, OverlayTrigger, Modal } from 'react-bootstrap';
import ErrorsComponent from './ErrorsComponent';


const unauthorizedActionPopover = (
    <Popover id="popover-trigger-click-hover" title="">
      You don't have the permissions to delete this category.
    </Popover>
);


class CategoryContent extends React.Component {
    componentWillMount() {
        this.setState({displayDeleteModal: false});
    }

    render() {
        const sentences = this.props.catDescription.content.split('\r\n');
        return (
            <Popover id="popover-positioned-bottom" 
                     positionLeft={this.props.positionLeft} 
                     positionTop={this.props.positionTop} 
                     placement="bottom" 
                     style={{textAlign: 'center'}}
                     title={this.props.catDescription.language_name + " description"}>
                {sentences.map((s, index) => <p key={index}>{s}</p>)}
                <Button bsStyle="primary" 
                        bsSize="xsmall"
                        href={"/categories/" + this.props.categoryId 
                            + "/cat_descriptions/" + this.props.catDescription.description_id 
                            + "/edit"}>
                    <span className="glyphicon glyphicon-edit"></span>
                </Button>
                <Button bsStyle="danger" 
                        bsSize="xsmall"
                        onClick={() => this.setState({displayDeleteModal: true})}
                        style={{marginLeft: '30px'}}>
                    <span className="glyphicon glyphicon-trash"></span>
                </Button>
                <Modal show={this.state.displayDeleteModal}>
                    <Modal.Body>
                        {this.props.user && this.props.user.superadmin ?
                            <div className="confirm_delete_modal">
                                Are you sure you want to destroy the {this.props.catDescription.language_name} description 
                                of {this.props.categoryName}?
                                <br/><br/>
                                <Button bsStyle="danger" 
                                        bsSize="xsmall"
                                        onClick={() => this.setState({displayDeleteModal: false})}
                                        href={"/categories/" + this.props.categoryId 
                                            + "/cat_descriptions/" + this.props.catDescription.description_id}
                                        data-method="delete"
                                        style={{marginLeft: '5px'}}
                                        >Yes
                                </Button>
                                <Button bsSize="xsmall" bsStyle="primary" style={{marginLeft: '30px'}} 
                                        onClick={() => this.setState({displayDeleteModal: false})}>No</Button>
                            </div>
                        :
                            <OverlayTrigger trigger={['hover', 'click']} placement="bottom" overlay={unauthorizedActionPopover}>
                                <div className="confirm_delete_modal">
                                    Are you sure you want to destroy the {this.props.catDescription.language_name} description 
                                    of {this.props.categoryName}?
                                    <br/><br/>
                                    <Button bsStyle="danger" 
                                            bsSize="xsmall"
                                            disabled={true}
                                            style={{marginLeft: '5px'}}
                                            >Yes
                                    </Button>
                                    <Button bsSize="xsmall" bsStyle="primary" style={{marginLeft: '30px'}} 
                                            onClick={() => this.setState({displayDeleteModal: false})}>No</Button>
                                </div>
                            </OverlayTrigger>
                        }
                    </Modal.Body>
                </Modal>
            </Popover>
        );
    }
};


class CategoryForm extends React.Component {

    componentWillMount() {
        this.setState({ token: this.props.token,
                        errors: this.props.categoryErrors || null,
                        user: this.props.user || null,
                        categoryId: this.props.match.params ? this.props.match.params.category_id : '',
                        categoryName: '',
                        catpicUrl: '',
                        prevCatpicUrl: '',
                        catpicName: '',
                        catDescriptions: [] })
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCatpic = this.handleCatpic.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {

        if (this.state.categoryId) {
            fetch('/categories/' + this.state.categoryId + '.json',
                 {credentials: 'same-origin'}
                 )
            .then(function(resp) {
                return resp.json();
              })
              .then(function(category) {
                const catInfo = category.pop();
                this.setState({ categoryName: catInfo.category_name,
                                catpicUrl: catInfo.catpic_url, 
                                prevCatpicUrl: catInfo.catpic_url, 
                                catpicName: catInfo.catpic_name,
                                catDescriptions: category });
              }.bind(this))
        }
    }

    handleNameChange(event) {
        if (event.target.value.match(/^[\w\ \u00E0-\u00FC\-¨()[\]_&=+*ˆ@#%\^\']{0,20}$/)) {
            this.setState({categoryName: event.target.value});
        }  
    }

    handleCatpic(event) {
        if (event.target.files[0].size < 8000000) {
            this.setState({ catpicUrl: event.target.files[0], catpicName: event.target.files[0].name });
        } else {
            alert("The picture you uploaded exceeded the max size of 8Mb (" + (event.target.files[0].size / 1000) + "ko)");
        }
    }

    handleSubmit(event) {
        let alerts = "";
        if (!this.state.categoryName || this.state.categoryName.length < 2 || this.state.categoryName.length > 20) {
            alerts += "A category name must be at least 2 characters long and at most 20 characters. ";
        }
        if (this.state.user && !this.state.user.superadmin) {
            alerts += "You don't have the required permissions to create or edit a category.";
        }
        if (alerts) {
            alert(alerts);
            event.preventDefault();
        }
    }

    render() {
        const inputEdit = React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'});
        const catpicInfo = this.state.catpicUrl == this.state.prevCatpicUrl ? 
                                (<div>
                                    <p style={{color: 'white', fontSize: '14px', textShadow: '1px 1px 10px black'}}>Current picture:</p>
                                    <img src={this.state.catpicUrl} />
                                    <p style={{color: 'white', fontSize: '12px', textShadow: '1px 1px 10px black', marginTop: '5px', 
                                        MsWordBreak: "break-all", wordBreak: "break-all", wordBreak: "break-word"}}>
                                        ({this.state.catpicName})
                                    </p>
                                </div>)
                                : (<p style={{color: 'white', fontSize: '14px', textShadow: '1px 1px 10px black'}}>
                                    Picture about to be uploaded: {this.state.catpicName}
                                  </p>);

        const descriptionsPopovers = this.state.cat_descriptions.map((d, index) => 
                                        (<OverlayTrigger key={index} trigger="click" 
                                                         placement="bottom"
                                                         overlay={<CategoryContent {...this.props} 
                                                                                   catDescription={d} 
                                                                                   user={this.state.user}
                                                                                   categoryName={this.state.categoryName}
                                                                                   categoryId={this.state.categoryId} />}>
                                            <Button bsSize="xsmall" style={{marginLeft: '10px'}}>{d.language_abbr}</Button>
                                        </OverlayTrigger>));

        const catForm = this.state.categoryId ?
                            (<form encType="multipart/form-data" action={"/categories/" + this.state.categoryId} 
                                   method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit}
                                   style={{marginTop: '20px'}} >
                                <input name="utf8" type="hidden" value="✓" />
                                <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly={true} />
                                {inputEdit}
                                <Table bordered id="category_form_table">
                                    <tbody>
                                        <tr>
                                            <td><label htmlFor="category_name">Name</label></td>
                                            <td><input id="category_name" type="text" name="category[name]" 
                                                       value={this.state.categoryName} onChange={this.handleNameChange} /></td>
                                        </tr>
                                        <tr>
                                            <td><label htmlFor="category_descriptions">Category descriptions</label></td>
                                            <td><Button bsStyle="success" 
                                                        bsSize="xsmall"
                                                        style={{opacity: '0.75'}}
                                                        href={"/categories/" + this.props.match.params.category_id 
                                                             + "/cat_descriptions/new"}>
                                                    <span style={{paddingLeft: 2 + 'px'}} className="glyphicon glyphicon-plus"></span>
                                                </Button>
                                                {descriptionsPopovers}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><label htmlFor="category_file">Category picture</label></td>
                                            <td><input id="category_catpic" accept=".png, .jpg, .jpeg" type="file" 
                                                       name="category[catpic]" onChange={this.handleCatpic} /></td>
                                        </tr>
                                    </tbody>
                                </Table>
                                { catpicInfo }
                                <div className="actions">
                                    <input type="submit" name="commit" value="Submit changes" />
                                </div>
                            </form>)

                            :   (<form encType="multipart/form-data" action="/categories" style={{marginTop: '20px'}}
                                       method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                                    <input name="utf8" type="hidden" value="✓" />
                                    <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly={true} />                            
                                    <Table responsive bordered id="category_form_table">
                                        <tbody>
                                            <tr>
                                                <td><label htmlFor="category_name">Category name</label></td>
                                                <td><input id="category_name" type="text" name="category[name]" 
                                                           value={this.state.categoryName} onChange={this.handleNameChange} /></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <div className="actions">
                                        <input type="submit" name="commit" value="Create category" />
                                    </div>
                                </form>);
        
        return (
            <div className="form-layout" style={{display: this.state.display}}>
                
                <div className="admin-page-title">{ this.state.categoryId ? ("Edit '" + this.state.categoryName + "' category") : "New category"}
                    {this.state.categoryName && this.state.categoryId?
                        <Button bsStyle="primary" bsSize="xsmall" className="back-link" 
                                href={"/categories/" + this.state.categoryId} style={{marginLeft: 5 + 'px'}}>
                            <span className="glyphicon glyphicon-arrow-left"></span>
                        </Button>
                        : <Button bsStyle="primary" bsSize="xsmall" className="back-link" href="/categories" 
                                  style={{marginLeft: 5 + 'px'}}>
                            <span className="glyphicon glyphicon-arrow-left"></span>
                          </Button>
                    }
                </div>
                
                { this.state.errors ? (<ErrorsComponent errors={this.state.errors} model={"category"} />) : null }
                
                {catForm}
                
            </div>
        );
    }
}

export default CategoryForm;