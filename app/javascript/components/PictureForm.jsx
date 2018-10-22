import React from 'react';
import { Button, Table, FormGroup, FormControl, OverlayTrigger, Popover, Modal } from 'react-bootstrap';
import ErrorsComponent from './ErrorsComponent';


const unauthorizedActionPopover = (
    <Popover id="popover-trigger-click-hover" title="">
      You don't have the permissions to destroy this description.
    </Popover>
);

const CategoryChoice = props => {
    return <option value={props.data.id}>{props.data.name}</option>
};

class PictureContent extends React.Component {
    componentWillMount() {
        this.setState({displayDeleteModal: false});
    }

    render() {
        const sentences = this.props.picDescription.content.split('\r\n');
        return (
            <Popover id="popover-positioned-bottom" 
                     positionLeft={this.props.positionLeft} 
                     positionTop={this.props.positionTop} 
                     placement="bottom" 
                     style={{textAlign: 'center'}}
                     title={this.props.picDescription.language_name + " description"}>
                {sentences.map((s, index) => <p key={index}>{s}</p>)}
                <Button bsStyle="primary" 
                        bsSize="xsmall"
                        href={"/categories/" + this.props.categoryId 
                            + "/pictures/" + this.props.pictureId
                            + "/pic_descriptions/" + this.props.picDescription.description_id 
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
                                Are you sure you want to destroy the {this.props.picDescription.language_name} description 
                                of {this.props.pictureTitle}?
                                <br/><br/>
                                <Button bsStyle="danger" 
                                        bsSize="xsmall"
                                        onClick={() => this.setState({displayDeleteModal: false})}
                                        href={"/categories/" + this.props.categoryId 
                                            + "/pictures/" + this.props.pictureId
                                            + "/pic_descriptions/" + this.props.picDescription.description_id}
                                        data-method="delete"
                                        >Yes
                                </Button>
                                <Button bsSize="xsmall" bsStyle="primary" style={{marginLeft: '30px'}} 
                                        onClick={() => this.setState({displayDeleteModal: false})}>No</Button>
                            </div>
                        :
                        <OverlayTrigger trigger={['hover', 'click']} placement="bottom" overlay={unauthorizedActionPopover}>
                            <div className="confirm_delete_modal">
                                Are you sure you want to destroy the {this.props.picDescription.language_name} description 
                                of {this.props.pictureTitle}?
                                <br/><br/>
                                <Button bsStyle="danger" 
                                        bsSize="xsmall"
                                        disabled={true}
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


class PictureForm extends React.Component {

    componentWillMount() {
        this.setState({ categoryId: this.props.match.params.category_id,
                        pictureId: this.props.match.params.picture_id,
                        pictureTitle: this.props.pictureData.title || '',
                        author: this.props.demoMode ? this.props.pictureData.author || 'Eugénie Le Moulec (*demo*)' : this.props.pictureData.author || 'Eugénie Le Moulec',
                        picDescriptions: [],
                        picUrl: '',
                        prevPicUrl: '',
                        picfileName: '',
                        all_categories: [],
                        user: this.props.user || null,
                        token: this.props.token,
                        errors: this.props.pictureErrors || null });
        this.handleTitle = this.handleTitle.bind(this);
        this.handleAuthor = this.handleAuthor.bind(this);
        this.handlePicfile = this.handlePicfile.bind(this);
        this.handleCategoryId = this.handleCategoryId.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('/categories/' + this.state.categoryId + '/pictures.json', {
            credentials: 'same-origin'
          })
        .then(function(resp) {
            return resp.json();
          })
          .then(function(category) {
            const all_categories = category.pop();
            this.setState({ all_categories });
          }.bind(this))

        if (this.state.pictureId) {
            fetch('/categories/' + this.state.categoryId + '/pictures/' + this.state.pictureId + '.json',
                 {credentials: 'same-origin'}
                 )
            .then(function(resp) {
                return resp.json();
              })
              .then(function(pic) {
                const pic_info = pic.pop();
                this.setState({ picUrl: pic_info.picfile_url, 
                                prevPicUrl: pic_info.picfile_url, 
                                picfileName: pic_info.picfile_name, 
                                pictureTitle: pic_info.picture_title, 
                                picDescriptions: pic });
              }.bind(this))
        }
    }

    handleTitle(event) {
        if (event.target.value.match(/^[\w\ \u00E0-\u00FC\-¨()[\]_&=+*ˆ@#%\^\']{0,30}$/)) {
            this.setState({pictureTitle: event.target.value});
        }  
    }

    handleAuthor(event) {
        if (event.target.value.match(/^[\w\ \u00E0-\u00FC\-¨()!?*.\^]{0,30}$/)) {
            this.setState({author: event.target.value});
        }
    }

    handlePicfile(event) {
        if (event.target.files[0].size < 8000000) {
            this.setState({ picUrl: event.target.files[0], picfileName: event.target.files[0].name });
        } else {
            alert("The picture you uploaded exceeded the max size of 8Mb (" + (event.target.files[0].size / 1000) + "ko)");
        }
    }

    handleCategoryId(event) {
        this.setState({categoryId: event.target.value});
    }

    handleSubmit(event) {
        var alerts = "";
        if (!this.state.pictureTitle) {
            alerts += "A picture title must be at least 1 character long (max 30 char). "
        }
        if (!this.state.author || this.state.author.length < 2) {
            alerts += "A picture author name must be at least 2 characters long (max 30 char). ";
        }
        if (!this.state.picUrl) {
            alerts += "You must upload a picture (max size = 4Mb). ";
        }
        if (this.state.user && !this.state.user.superadmin) {
            alerts += "You don't have the required permissions to create or edit a picture."
        }
        if (alerts) {
            alert(alerts);
            event.preventDefault();
        }
    }

    render() {
        const form_action = this.state.pictureId ?
                            ("/categories/" + (this.state.categoryId) + "/pictures/" + this.state.pictureId) :
                            ("/categories/" + (this.state.categoryId) + "/pictures");
        
        const descriptions_popovers = this.state.picDescriptions.map((d, index) => 
            (<OverlayTrigger key={index}
                             trigger="click" 
                             placement="bottom"
                             overlay={<PictureContent {...this.props}
                                                      user={this.state.user}
                                                      picDescription={d} 
                                                      pictureTitle={this.state.pictureTitle}
                                                      categoryId={this.state.categoryId}
                                                      pictureId={this.state.pictureId} />}>
                <Button bsSize="xsmall" style={{margin: "3px 10px 3px 0"}}>{d.language_abbr}</Button>
            </OverlayTrigger>));
        
        const input_edit = React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'});
        const pic_info = this.state.pictureId ?
            (this.state.picUrl == this.state.prevPicUrl ?
                    (<div>
                        <p style={{color: 'white', fontSize: '14px', textShadow: '1px 1px 10px black'}}>Current picture:</p>
                        <img src={this.state.picUrl} />
                        <p style={{color: 'white', fontSize: '12px', textShadow: '1px 1px 10px black', marginTop: '5px', 
                           MsWordBreak: "break-all", wordBreak: "break-all", wordBreak: "break-word"}}>
                           ({this.state.picfileName})
                        </p>
                    </div>)
                    : (<p style={{color: 'white', fontSize: '14px', textShadow: '1px 1px 10px black',
                                  MsWordBreak: "break-all", wordBreak: "break-all", wordBreak: "break-word"}}>
                            Picture about to be uploaded: {this.state.picfileName}
                       </p>))
            : (this.state.picUrl ?
                (<p style={{color: 'white', fontSize: '14px', textShadow: '1px 1px 10px black',
                    MsWordBreak: "break-all", wordBreak: "break-all", wordBreak: "break-word"}}>
                    Picture about to be uploaded: {this.state.picfileName}
                 </p>)
                : null)

        const category_form = this.state.pictureId ?
            (<form encType="multipart/form-data" action={form_action} method="post" 
                   acceptCharset="UTF-8" onSubmit={this.handleSubmit} style={{marginTop: '20px'}} >
                <input name="utf8" type="hidden" value="✓" />
                <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly={true} />
                {input_edit}
                <Table bordered id="picture_form_table">
                    <tbody>
                        <tr>
                            <td><label htmlFor="choose-cat">Category</label></td>
                            <td>
                                <FormGroup controlId="formControlsSelect">
                                    <FormControl componentClass="select" value={this.state.categoryId} name="picture[category_id]" onChange={this.handleCategoryId}>
                                        { this.state.all_categories.map(c => <CategoryChoice key={c.id} data={c} />) }>
                                    </FormControl>
                                </FormGroup>
                            </td>
                        </tr>
                        <tr>
                            <td><label htmlFor="picture_title">Title</label></td>
                            <td><input id="picture_title" type="text" name="picture[title]" maxLength="30" value={this.state.pictureTitle || ''} onChange={this.handleTitle} /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="picture_author">Author</label></td>
                            <td><input id="picture_author" type="text" name="picture[author]" maxLength="30" value={this.state.author || ''} onChange={this.handleAuthor} /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="picture_descriptions">Picture descriptions</label></td>
                            <td><Button bsStyle="success" 
                                        bsSize="xsmall"
                                        style={{opacity: '0.75', marginRight: "10px"}}
                                        href={"/categories/" + this.props.match.params.category_id
                                             + "/pictures/" + this.props.match.params.picture_id
                                             + "/pic_descriptions/new"}>
                                    <span style={{paddingLeft: '2px'}} className="glyphicon glyphicon-plus"></span>
                                </Button>
                                {descriptions_popovers}
                            </td>
                        </tr>
                        <tr>
                            <td><label htmlFor="picture_file">Picture</label></td>
                            <td><input id="picture_picfile" accept=".png, .jpg, .jpeg" type="file" name="picture[picfile]" 
                                       onChange={this.handlePicfile} style={{color: "transparent"}} /></td>
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
                                        <FormControl componentClass="select" value={this.state.categoryId} name="picture[category_id]" onChange={this.handleCategoryId}>
                                            { this.state.all_categories.map(c => <CategoryChoice key={c.id} data={c} />) }>
                                        </FormControl>
                                    </FormGroup>
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="picture_title">Title</label></td>
                                <td><input id="picture_title" type="text" name="picture[title]" maxLength="30" value={this.state.pictureTitle || ''} onChange={this.handleTitle} /></td>
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
                <div className="admin-page-title">{ this.state.pictureId ? ("Edit '" + this.state.pictureTitle + "'") : "New picture"} 
                    <Button bsStyle="primary" bsSize="xsmall" className="back-link" 
                            href={"/categories/" + this.props.match.params.category_id + "/pictures"} style={{marginLeft: '5px'}}>
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