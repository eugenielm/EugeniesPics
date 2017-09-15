import React from 'react';
import ReactDOM from 'react-dom';
import ErrorsComponent from './ErrorsComponent';


const CategoryChoice = props => {
    return <option value={props.data.id}>{props.data.name}</option>
};

class PictureForm extends React.Component {

    componentWillMount() {
        this.setState({ category_id: this.props.picture_data.category_id || this.props.match.params.category_id,
                        picture_id: this.props.match.params.picture_id || null,
                        title: this.props.picture_data.title || '',
                        author: this.props.picture_data.author || '',
                        description: this.props.picture_data.description || '',
                        pic_url: '',
                        prev_pic_url: '',
                        pic_name: '',
                        all_categories: [],
                        user: this.props.user || null,
                        token: this.props.token,
                        errors: this.props.picture_errors || null });
        this.handleTitle = this.handleTitle.bind(this);
        this.handleAuthor = this.handleAuthor.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
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
              .then(function(picture) {
                this.setState({ pic_url: picture.pic_url.small, prev_pic_url: picture.pic_url.small });
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

    handleDescription(event) {
        if (event.target.value.match(/^[\w\ \u00E0-\u00FC\-¨().,;!/?:@#$&*[\]\^]{0,500}$/)) {
            this.setState({description: event.target.value});
      }
    }

    handlePicfile(event) {
        if (event.target.files[0].size < 1000000) {
            this.setState({ pic_url: event.target.files[0], pic_name: event.target.files[0].name });
        } else {
            alert("The picture you uploaded exceeded the max size of 1Mb (" + (event.target.files[0].size / 1000) + "ko)");
        }
    }

    handleCategoryId(event) {
        this.setState({category_id: event.target.value});
    }

    handleSubmit(event) {
        var alerts = "";
        if (!this.state.title) {
            alerts += "A picture title must be at least 1 character long (max 30 char). "
        }
        if (!this.state.author || this.state.author.length < 2) {
            alerts += "A picture author name must be at least 2 characters long (max 30 char). ";
        }
        if (!this.state.description || this.state.description.length < 4) {
            alerts += "A picture description must be at least 4 characters long (max 500 char). ";
        }
        if (!this.state.pic_url) {
            alerts += "You must upload a picture (max size = 1Mb).";
        }
        if (alerts) {
            alert(alerts);
            event.preventDefault();
        }
    }

    render() {
        console.log('this.state in render in PictureForm: ', this.state);
        const page_title = this.state.picture_id ? "Edit picture" : "New picture";
        const form_action = this.state.picture_id ?
                            ("/categories/" + (this.state.category_id) + "/pictures/" + this.state.picture_id) :
                            ("/categories/" + (this.state.category_id) + "/pictures");
        const input_edit = this.state.picture_id ? React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'}) : null;
        const newCatLink = (this.state.user && this.state.user.superadmin) ? (<p id="new_cat_link"><a href="/categories/new">New category</a></p>) : null;
        const pic_info = this.state.picture_id ? (
            this.state.pic_url == this.state.prev_pic_url ? (<div><p>Current picture:</p><img src={this.state.pic_url} /></div>) : (<p>Picture about to be uploaded: {this.state.pic_name}</p>)
        ) : (this.state.pic_url ? (<p>Picture about to be uploaded: {this.state.pic_name}</p>) : null)
        return (
            <div>
                <h1>{page_title}</h1>
                {this.state.errors ? (<ErrorsComponent errors={this.state.errors} />) : null}
                <form encType="multipart/form-data" action={form_action} method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.state.token} readOnly={true} />
                    {input_edit}
                    
                    <p>Choose a category:</p>
                    <select value={this.state.category_id} name="picture[category_id]" id="picture_category_id" onChange={this.handleCategoryId}>
                        { this.state.all_categories.map(c => <CategoryChoice key={c.id} data={c} />) }
                    </select>

                    {newCatLink}
                    
                    <p>
                        <label htmlFor="picture_title">Title</label>
                        <input id="picture_title" type="text" name="picture[title]" maxLength="30" value={this.state.title || ''} onChange={this.handleTitle} />
                    </p>

                    <p>
                        <label htmlFor="picture_author">Author</label>
                        <input id="picture_author" type="text" name="picture[author]" maxLength="30" value={this.state.author || ''} onChange={this.handleAuthor} />
                    </p>

                    <p>
                        <label htmlFor="picture_description">Description</label>
                        <textarea id="picture_description" type="text" name="picture[description]" value={this.state.description || ''} maxLength="500" rows="10" cols="50" onChange={this.handleDescription}></textarea>
                    </p>

                    {pic_info}
                    
                    <p>
                        <label htmlFor="picture_upload_picture">Upload picture</label>
                        <input id="picture_picfile" accept=".png, .jpg, .jpeg" type="file" name="picture[picfile]" onChange={this.handlePicfile} />
                    </p>
                    <div className="actions">
                        <input type="submit" name="commit" value={this.state.picture_id ? "Save changes" : "Create picture"} />
                    </div>
                </form>
            </div>
        );
    }
}

export default PictureForm;