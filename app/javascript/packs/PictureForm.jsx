import React from 'react'
import ReactDOM from 'react-dom'
import CategorySelect from './CategorySelect'
import NewCategoryLink from './NewCategoryLink'


const ErrorListElement = props => {
    return (<li>{props.err}</li>)
};

const ErrorsComponent = props => {
    if (props.errors) {
        return (
            <div id="error_explanation">
                <h2>The following error(s) prohibited this picture from being saved:</h2>
                <ul>
                    {props.errors.map(e => <ErrorListElement err={e} key={props.errors.indexOf(e)} />)}
                </ul>
            </div>
        );
    }
    return null;
};

class PictureForm extends React.Component {
    constructor(props) {
        super(props);
        this.token = props.token;
        this.categories = props.cats;
        this.category = props.cat;
        this.picture = props.pic.id ? props.pic : null;
        this.errors = props.errs ? props.errs : null;
        this.state = {title: props.pic.title, category_id: props.pic.category_id, author: props.pic.author, description: props.pic.description, picfile_file_name: ""};
        this.handleTitle = this.handleTitle.bind(this);
        this.handleAuthor = this.handleAuthor.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handlePicfile = this.handlePicfile.bind(this);
        this.handleCategoryId = this.handleCategoryId.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
            this.setState({picfile_file_name: event.target.files[0]});
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
        if (this.state.author.length < 2) {
            alerts += "A picture author name must be at least 2 characters long (max 30 char). ";
        }
        if (this.state.description.length < 4) {
            alerts += "A picture description must be at least 4 characters long (max 500 char). ";
        }
        if (!this.state.picfile_file_name) {
            alerts += "You must upload a picture (max size = 1Mb).";
        }
        if (alerts) {
            alert(alerts);
            event.preventDefault();
        }
    }

    render() {
        const page_title = (!this.picture) ? "New picture" : "Edit picture";
        const form_action = this.picture ? ("/categories/" + this.category.id + "/pictures/" + this.picture.id) : ("/categories/" + this.category.id + "/pictures")
        const input_edit = (this.picture) ? React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'}) : null;
        return (
            <div>
                <h1>{page_title}</h1>
                <ErrorsComponent errors={this.errors} />
                <form encType="multipart/form-data" action={form_action} method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.token} readOnly={true} />
                    {input_edit}
                    
                    <p>Choose a category:</p>
                    <CategorySelect cat_id={this.category.id} data={this.categories}/>

                    <NewCategoryLink />
                    
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

                    <p>
                        <label htmlFor="picture_upload_picture">Upload picture</label>
                        <input id="picture_picfile" accept=".png, .jpg, .jpeg" type="file" name="picture[picfile]" onChange={this.handlePicfile} />
                    </p>
                    <div className="actions">
                        <input type="submit" name="commit" value="Submit" />
                    </div>
                </form>
            </div>
        );
    }
}

document.addEventListener('turbolinks:load', () => {
  if (document.getElementById('picture_form')) {
    const categories = JSON.parse(document.getElementById('all_categories').getAttribute('data'));
    const category = JSON.parse(document.getElementById('category_instance').getAttribute('data'));
    const picture = document.getElementById('picture_instance') ?
                    JSON.parse(document.getElementById('picture_instance').getAttribute('data')) : null;
    const errors = JSON.parse(document.getElementById('picture_errors').getAttribute('data')).length > 0 ? JSON.parse(document.getElementById('picture_errors').getAttribute('data')) : null;
    const csrf_token = document.getElementById('csrf_token').getAttribute('data').split('content=')[2].slice(1, -4);
    ReactDOM.render(
        <PictureForm cats={categories} cat={category} pic={picture} token={csrf_token} errs={errors} />,
        document.getElementById('picture_form')
    )
  }
})