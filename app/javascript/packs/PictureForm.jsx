import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Table, FormGroup, FormControl, OverlayTrigger, Popover } from 'react-bootstrap';
import ErrorsComponent from './ErrorsComponent';


const CategoryChoice = props => {
    return <option value={props.data.id}>{props.data.name}</option>
};

const PictureContent = props => {
    const sentences = props.pic_description.content.split('\r\n');
    return (
        <Popover id="popover-positioned-bottom" 
                 positionLeft={props.positionLeft} 
                 positionTop={props.positionTop} 
                 placement="bottom" 
                 title={props.pic_description.language_name + " description"}>
            {sentences.map((s, index) => <p key={index}>{s}</p>)}
            <Button bsStyle="primary" 
                    bsSize="xsmall"
                    href={"/categories/" + props.category_id 
                        + "/pictures/" + props.picture_id
                        + "/pic_descriptions/" + props.pic_description.description_id 
                        + "/edit?redirect_to_pic_edit=" + props.current_url}>
                <span className="glyphicon glyphicon-edit"></span>
            </Button>
            <Button bsStyle="danger" 
                    bsSize="xsmall"
                    style={{marginLeft: 5 + 'px'}}
                    href={"/categories/" + props.category_id 
                        + "/pictures/" + props.picture_id
                        + "/pic_descriptions/" + props.pic_description.description_id
                        + "?redirect_to_pic_edit=" + props.current_url}
                    data-method="delete">
                <span className="glyphicon glyphicon-trash"></span>
            </Button>
        </Popover>
    )
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
        if (event.target.value.match(/^[\w\ \u00E0-\u00FC\-¨()[\]\^]{0,30}$/)) {
            this.setState({title: event.target.value});
        }  
    }

    handleAuthor(event) {
        if (event.target.value.match(/^[\w\ \u00E0-\u00FC\-¨()\^]{0,30}$/)) {
            this.setState({author: event.target.value});
      }
    }

    handlePicfile(event) {
        if (event.target.files[0].size < 1500000) {
            this.setState({ pic_url: event.target.files[0], picfile_name: event.target.files[0].name });
        } else {
            alert("The picture you uploaded exceeded the max size of 1.5Mb (" + (event.target.files[0].size / 1000) + "ko)");
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
                                                      picture_id={this.state.picture_id}
                                                      current_url={encodeURIComponent(this.props.match.url)} />}>
                <Button bsSize="xsmall" style={{marginLeft: 5 + 'px'}}>{d.language_abbr}</Button>
            </OverlayTrigger>));
        
        const input_edit = React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'});
        const newCatLink = (this.state.user && this.state.user.superadmin) ?
                           (<Button id="new_cat_link" bsSize="xsmall" bsStyle="success" 
                                    style={{marginLeft: 5 + 'px', paddingRight: 3 + 'px'}} 
                                    href={"/categories/new?redirect_to_pic_edit=" + encodeURIComponent(this.props.match.url)}>
                                    <span className="glyphicon glyphicon-plus"></span>
                           </Button>) 
                           : null;
        const pic_info = this.state.picture_id ?
            (this.state.pic_url == this.state.prev_pic_url ? (<div><p>Current picture:</p><img src={this.state.pic_url} /></div>) : (<p>Picture about to be uploaded: {this.state.picfile_name}</p>))
            : (this.state.pic_url ? (<p>Picture about to be uploaded: {this.state.picture_title}</p>) : null)

        const category_form = this.state.picture_id ?
            (<form encType="multipart/form-data" action={form_action} method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                <input name="utf8" type="hidden" value="✓" />
                <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly={true} />
                {input_edit}
                <Table striped bordered responsive>
                    <tbody>
                        <tr>
                            <td><label htmlFor="choose-cat">Category</label>{newCatLink}</td>
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
                                        href={"/categories/" + this.props.match.params.category_id
                                            + "/pictures/" + this.props.match.params.picture_id
                                            + "/pic_descriptions/new?redirect_to_pic_edit=" + encodeURIComponent(this.props.match.url)}>
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

            :   (<form encType="multipart/form-data" action={form_action} method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly={true} />                            
                    <Table responsive bordered>
                        <tbody>
                            <tr>
                                <td><label htmlFor="choose-cat">Category</label>{newCatLink}</td>
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
                                <td><input id="picture_title" type="text" name="picture[title]" maxLength="30" value={this.state.title || ''} onChange={this.handleTitle} /></td>
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
                <h3>{ this.state.picture_id ? ("Edit '" + this.state.picture_title + "'") : "New picture"} 
                    <Button bsStyle="primary" bsSize="xsmall" className="back-link" 
                            href={"/categories/" + this.props.match.params.category_id + "/pictures"} style={{marginLeft: 5 + 'px'}}>
                        Back to pictures
                    </Button>
                </h3>
                {this.state.errors ? (<ErrorsComponent errors={this.state.errors} />) : null}
                {category_form}
            </div>
        );
    }
}

export default PictureForm;