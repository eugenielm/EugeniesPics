import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Table, FormGroup, FormControl, OverlayTrigger, Popover, Modal } from 'react-bootstrap';
import ErrorsComponent from './ErrorsComponent';


const CategoryChoice = props => {
    return <option value={props.data.id}>{props.data.name}</option>
};

class PictureContent extends React.Component {
    componentWillMount() {
        this.setState({displayDeleteModal: false});
    }

    render() {
        const sentences = this.props.pic_description.content.split('\r\n');
        return (
            <Popover id="popover-positioned-bottom" 
                     positionLeft={this.props.positionLeft} 
                     positionTop={this.props.positionTop} 
                     placement="bottom" 
                     title={this.props.pic_description.language_name + " description"}>
                {sentences.map((s, index) => <p key={index}>{s}</p>)}
                <Button bsStyle="primary" 
                        bsSize="xsmall"
                        href={"/categories/" + this.props.category_id 
                            + "/pictures/" + this.props.picture_id
                            + "/pic_descriptions/" + this.props.pic_description.description_id 
                            + "/edit"}>
                    <span className="glyphicon glyphicon-edit"></span>
                </Button>
                <Button bsStyle="danger" 
                        bsSize="xsmall"
                        onClick={() => this.setState({displayDeleteModal: true})}
                        style={{marginLeft: 5 + 'px'}}>
                    <span className="glyphicon glyphicon-trash"></span>
                </Button>
                <Modal show={this.state.displayDeleteModal}>
                    <Modal.Body>
                        <div className="confirm_delete_modal">
                            Are you sure you want to destroy the {this.props.pic_description.language_name} description 
                            of {this.props.picture_title}?
                            <br/><br/>
                            <Button bsStyle="danger" 
                                    bsSize="xsmall"
                                    onClick={() => this.setState({displayDeleteModal: false})}
                                    href={"/categories/" + this.props.category_id 
                                        + "/pictures/" + this.props.picture_id
                                        + "/pic_descriptions/" + this.props.pic_description.description_id}
                                    data-method="delete"
                                    style={{marginLeft: '5px'}}
                                    >Yes
                            </Button>
                            <Button bsSize="xsmall" bsStyle="primary" style={{marginLeft: '30px'}} 
                                    onClick={() => this.setState({displayDeleteModal: false})}>No</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </Popover>
        );
    }
};


class PictureForm extends React.Component {

    componentWillMount() {
        this.setState({ category_id: this.props.match.params.category_id,
                        picture_id: this.props.match.params.picture_id,
                        picture_title: this.props.picture_data.title || '',
                        author: this.props.picture_data.author || '',
                        pic_descriptions: [],
                        pic_url: '',
                        prev_pic_url: '',
                        picfile_name: '',
                        all_categories: [],
                        user: this.props.user || null,
                        token: this.props.token,
                        errors: this.props.picture_errors || null });
        this.handleTitle = this.handleTitle.bind(this);
        this.handleAuthor = this.handleAuthor.bind(this);
        this.handlePicfile = this.handlePicfile.bind(this);
        this.handleCategoryId = this.handleCategoryId.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('/categories/' + this.state.category_id + '/pictures.json', {
            credentials: 'same-origin'
          })
        .then(function(resp) {
            return resp.json();
          })
          .then(function(category) {
            const all_categories = category.pop();
            this.setState({ all_categories });
          }.bind(this))

        if (this.state.picture_id) {
            fetch('/categories/' + this.state.category_id + '/pictures/' + this.state.picture_id + '.json',
                 {credentials: 'same-origin'}
                 )
            .then(function(resp) {
                return resp.json();
              })
              .then(function(pic) {
                const pic_info = pic.pop();
                this.setState({ pic_url: pic_info.picfile_url, 
                                prev_pic_url: pic_info.picfile_url, 
                                picfile_name: pic_info.picfile_name, 
                                picture_title: pic_info.picture_title, 
                                pic_descriptions: pic });
              }.bind(this))
        }
    }

    handleTitle(event) {
        if (event.target.value.match(/^[\w\ \u00E0-\u00FC\-¨()[\]_&=+*ˆ@#%\^]{0,30}$/)) {
            this.setState({picture_title: event.target.value});
        }  
    }

    handleAuthor(event) {
        if (event.target.value.match(/^[\w\ \u00E0-\u00FC\-¨()!?.\^]{0,30}$/)) {
            this.setState({author: event.target.value});
        }
    }

    handlePicfile(event) {
        if (event.target.files[0].size < 4000000) {
            this.setState({ pic_url: event.target.files[0], picfile_name: event.target.files[0].name });
        } else {
            alert("The picture you uploaded exceeded the max size of 4Mb (" + (event.target.files[0].size / 1000) + "ko)");
        }
    }

    handleCategoryId(event) {
        this.setState({category_id: event.target.value});
    }

    handleSubmit(event) {
        var alerts = "";
        if (!this.state.picture_title) {
            alerts += "A picture title must be at least 1 character long (max 30 char). "
        }
        if (!this.state.author || this.state.author.length < 2) {
            alerts += "A picture author name must be at least 2 characters long (max 30 char). ";
        }
        if (!this.state.pic_url) {
            alerts += "You must upload a picture (max size = 1.5Mb).";
        }
        if (alerts) {
            alert(alerts);
            event.preventDefault();
        }
    }

    render() {
        const form_action = this.state.picture_id ?
                            ("/categories/" + (this.state.category_id) + "/pictures/" + this.state.picture_id) :
                            ("/categories/" + (this.state.category_id) + "/pictures");
        
        const descriptions_popovers = this.state.pic_descriptions.map((d, index) => 
            (<OverlayTrigger key={index} trigger="click" 
                             placement="bottom"
                             overlay={<PictureContent {...this.props} 
                                                      pic_description={d} 
                                                      picture_title={this.state.picture_title}
                                                      category_id={this.state.category_id}
                                                      picture_id={this.state.picture_id} />}>
                <Button bsSize="xsmall" style={{marginLeft: '10px'}}>{d.language_abbr}</Button>
            </OverlayTrigger>));
        
        const input_edit = React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'});
        const pic_info = this.state.picture_id ?
            (this.state.pic_url == this.state.prev_pic_url ?
                    (<div><p style={{color: 'white'}}>Current picture:</p><img src={this.state.pic_url} /></div>)
                    : (<p style={{color: 'white'}}>Picture about to be uploaded: {this.state.picfile_name}</p>))
            : (this.state.pic_url ?
                (<p style={{color: 'white'}}>Picture about to be uploaded: {this.state.picture_title}</p>)
                : null)

        const category_form = this.state.picture_id ?
            (<form encType="multipart/form-data" action={form_action} method="post" 
                   acceptCharset="UTF-8" onSubmit={this.handleSubmit} style={{marginTop: '20px'}} >
                <input name="utf8" type="hidden" value="✓" />
                <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly={true} />
                {input_edit}
                <Table bordered condensed responsive id="picture_form_table">
                    <tbody>
                        <tr>
                            <td><label htmlFor="choose-cat">Category</label></td>
                            <td>
                                <FormGroup controlId="formControlsSelect">
                                    <FormControl componentClass="select" value={this.state.category_id} name="picture[category_id]" onChange={this.handleCategoryId}>
                                        { this.state.all_categories.map(c => <CategoryChoice key={c.id} data={c} />) }>
                                    </FormControl>
                                </FormGroup>
                            </td>
                        </tr>
                        <tr>
                            <td><label htmlFor="picture_title">Title</label></td>
                            <td><input id="picture_title" type="text" name="picture[title]" maxLength="30" value={this.state.picture_title || ''} onChange={this.handleTitle} /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="picture_author">Author</label></td>
                            <td><input id="picture_author" type="text" name="picture[author]" maxLength="30" value={this.state.author || ''} onChange={this.handleAuthor} /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="picture_descriptions">Picture descriptions</label></td>
                            <td><Button bsStyle="success" 
                                        bsSize="xsmall"
                                        style={{opacity: '0.75'}}
                                        href={"/categories/" + this.props.match.params.category_id
                                             + "/pictures/" + this.props.match.params.picture_id
                                             + "/pic_descriptions/new"}>
                                    <span style={{paddingLeft: 2 + 'px'}} className="glyphicon glyphicon-plus"></span>
                                </Button>
                                {descriptions_popovers}
                            </td>
                        </tr>
                        <tr>
                            <td><label htmlFor="picture_file">Picture</label></td>
                            <td><input id="picture_picfile" accept=".png, .jpg, .jpeg" type="file" name="picture[picfile]" onChange={this.handlePicfile} /></td>
                        </tr>
                    </tbody>
                </Table>
                { pic_info }
                <div className="actions">
                    <input type="submit" name="commit" value="Submit changes" />
                </div>
            </form>)

            :   (<form encType="multipart/form-data" action={form_action} method="post" 
                       acceptCharset="UTF-8" onSubmit={this.handleSubmit} style={{marginTop: '20px'}} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly={true} />                            
                    <Table responsive bordered id="picture_form_table">
                        <tbody>
                            <tr>
                                <td><label htmlFor="choose-cat">Category</label></td>
                                <td>
                                    <FormGroup controlId="formControlsSelect">
                                        <FormControl componentClass="select" value={this.state.category_id} name="picture[category_id]" onChange={this.handleCategoryId}>
                                            { this.state.all_categories.map(c => <CategoryChoice key={c.id} data={c} />) }>
                                        </FormControl>
                                    </FormGroup>
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="picture_title">Title</label></td>
                                <td><input id="picture_title" type="text" name="picture[title]" maxLength="30" value={this.state.picture_title || ''} onChange={this.handleTitle} /></td>
                            </tr>

                            <tr>
                                <td><label htmlFor="picture_author">Author</label></td>
                                <td><input id="picture_author" type="text" name="picture[author]" maxLength="30" value={this.state.author || ''} onChange={this.handleAuthor} /></td>
                            </tr>

                            <tr>
                                <td><label htmlFor="picture_file">Picture</label></td>
                                <td><input id="picture_picfile" accept=".png, .jpg, .jpeg" type="file" name="picture[picfile]" onChange={this.handlePicfile} /></td>
                            </tr>
                        </tbody>
                    </Table>
                    <div className="actions">
                        <input type="submit" name="commit" value="Create picture" />
                    </div>
                </form>);

        return (
            <div className="form-layout" style={{display: this.state.display}}>
                <div className="admin-page-title">{ this.state.picture_id ? ("Edit '" + this.state.picture_title + "'") : "New picture"} 
                    <Button bsStyle="primary" bsSize="xsmall" className="back-link" 
                            href={"/categories/" + this.props.match.params.category_id + "/pictures"} style={{marginLeft: 5 + 'px'}}>
                        <span className="glyphicon glyphicon-arrow-left"></span>
                    </Button>
                </div>
                {this.state.errors ? (<ErrorsComponent errors={this.state.errors} />) : null}
                {category_form}
            </div>
        );
    }
}

export default PictureForm;