import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Table } from 'react-bootstrap';
import ErrorsComponent from './ErrorsComponent';


class SettingForm extends React.Component {

    componentWillMount() {
        this.initialState = this.initialState.bind(this);
        this.handleBackgroundImage = this.handleBackgroundImage.bind(this);
        this.handleBackgroundColor = this.handleBackgroundColor.bind(this);
        this.handleDeleteBackground = this.handleDeleteBackground.bind(this);
        this.handleMaintitle = this.handleMaintitle.bind(this);
        this.handleSubtitle = this.handleSubtitle.bind(this);
        this.handleNavbarcolor = this.handleNavbarcolor.bind(this);
        this.handleNavbarfont = this.handleNavbarfont.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.emptyFileLoader = this.emptyFileLoader.bind(this);
        this.setState(this.initialState(this.props));
    }

    initialState(props) {
        return { token: props.token,
                 errors: props.setting_errors || null,
                 user: props.user || null,
                 backgroundImage: props.backgroundImage,
                 deleteBackground: false,
                 backgroundColor: props.backgroundColor,
                 backgroundImageName: props.backgroundImageName,
                 maintitle: props.maintitle,
                 subtitle: props.subtitle,
                 navbarcolor: props.navbarcolor,
                 navbarfont: props.navbarfont,
                 setting_id: props.settingId,
                };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps) {
            this.setState(this.initialState(nextProps));
        }
    }

    handleBackgroundImage(event) {
        this.props.backgroundImage ? this.props.updateBackgroundImage(null) : null;
        this.props.backgroundImageName ? this.props.updateBackgroundImageName(null) : null;
        this.setState({deleteBackground: !this.state.deleteBackground,
                       backgroundImage: null,
                       backgroundImageName: null});

        if (event.target.files[0] && event.target.files[0].size < 2000000) {
            this.setState({ backgroundImage: event.target.files[0],
                            backgroundImageName: event.target.files[0].name,
                            deleteBackground: this.state.deleteBackground ? true : false});
        } else {
            event.target.value = "";
            alert("The picture you uploaded exceeded the max size of 2Mb (" + (event.target.files[0].size / 1000) + "ko)");
        }
    }

    emptyFileLoader(e) {
        if (e.target.files[0]) {
            e.target.value = "";
            this.props.updateBackgroundImage(null);
            this.props.updateBackgroundImageName(null);
            this.setState({deleteBackground: true,
                           backgroundImage: null,
                           backgroundImageName: null});
        }
    }

    handleMaintitle(event) {
        if (event.target.value.length <= 20) {
            this.setState({maintitle: event.target.value});
            this.props.updateMaintitle(event.target.value);
        }  
    }

    handleSubtitle(event) {
        if (event.target.value.length <= 40) {
            this.setState({subtitle: event.target.value});
            this.props.updateSubtitle(event.target.value);
        }  
    }

    handleNavbarcolor(event) {
        if (event.target.value.length > 0 && event.target.value.length <= 7) {
            this.setState({navbarcolor: event.target.value});
        }
        if (event.target.value.match(/#[0-9a-z]{6}/i)) {
            this.props.updateBackgroundImage(this.state.backgroundImage);
            this.props.updateBackgroundImageName(this.state.backgroundImageName);
            this.props.updateNavbarcolor(event.target.value);
        }
    }

    handleNavbarfont(event) {
        if (event.target.value.length > 0 && event.target.value.length <= 7) {
            this.setState({navbarfont: event.target.value});
        }
        if (event.target.value.match(/#[0-9a-z]{6}/i)) {
            this.props.updateBackgroundImage(this.state.backgroundImage);
            this.props.updateBackgroundImageName(this.state.backgroundImageName);
            this.props.updateNavbarfont(event.target.value);
        }
    }

    handleBackgroundColor(event) {
        if (event.target.value.length > 0 && event.target.value.length <= 7) {
            this.setState({backgroundColor: event.target.value});
        }
        if (event.target.value.match(/#[0-9a-z]{6}/i)) {
            this.props.updateBackgroundImage(this.state.backgroundImage);
            this.props.updateBackgroundImageName(this.state.backgroundImageName);
            this.props.updateBackgroundColor(event.target.value);
        }
    }

    handleDeleteBackground() {
        this.setState({deleteBackground: !this.state.deleteBackground,
                       backgroundImage: null,
                       backgroundImageName: null});
        this.props.backgroundImage ? this.props.updateBackgroundImage(null) : null;
        this.props.backgroundImageName ? this.props.updateBackgroundImageName(null) : null;
    }

    handleSubmit(event) {
        let alerts = '';
        if (!this.state.navbarcolor.match(/#[0-9a-z]{6}/i) || !this.state.navbarfont.match(/#[0-9a-z]{6}/i)) {
            alerts += "Colors units must have the HEX format: #xxxxxx (with either integers or letters from 'a' to 'f'). "
        }
        if (!this.state.backgroundImage && !this.state.backgroundColor.match(/#[0-9a-z]{6}/i)) {
            alerts += "Please provide a background color in the HEX format: #xxxxxx (with either integers or letters from 'a' to 'f'). "
        }
        if (this.props.user && !this.props.user.superadmin) {
            alerts += "You don't have the required permissions to create or edit a presentation."
        }
        if (alerts) {
            alert(alerts);
            event.preventDefault();
        }
    }

    render() {
        const form_action = this.props.settingId ? ("/settings/" + this.props.settingId) : ("/settings");
        const input_edit = this.props.settingId ? React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'}) : null;
        const page_title = this.props.settingId ? "Edit settings" : "New settings";

        return (
            <div className="form-layout">
                <div className="admin-page-title">{page_title}</div>

                { this.state.errors ? (<ErrorsComponent errors={this.state.errors} model={"setting"} />) : null }
                <form encType="multipart/form-data" action={form_action} method="post" acceptCharset="UTF-8" onSubmit={this.handleSubmit} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.state.token || ''} readOnly />
                    {input_edit}
                    
                    <Table bordered responsive id="setting_form_table">
                        <tbody>
                            <tr>
                                <td><label htmlFor="setting_maintitle">Website main title</label></td>
                                <td><input id="setting_maintitle" type="text" name="setting[maintitle]" 
                                                                              value={this.state.maintitle || ''} 
                                                                              onChange={this.handleMaintitle} /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="setting_subtitle">Website sub-title</label></td>
                                <td><input id="setting_subtitle" type="text" name="setting[subtitle]" 
                                                                             value={this.state.subtitle || ''} 
                                                                             onChange={this.handleSubtitle} /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="setting_navbarfont">Main title and sub-title color</label></td>
                                <td><input id="setting_navbarfont" type="text" name="setting[navbarfont]" 
                                                                               placeholder="HEX format only (#789def)" 
                                                                               value={this.state.navbarfont || '#'} 
                                                                               onChange={this.handleNavbarfont} /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="setting_navbarcolor">Navigation bar background color</label></td>
                                <td><input id="setting_navbarcolor" type="text" name="setting[navbarcolor]" 
                                                                                placeholder="HEX format only (#789def)" 
                                                                                value={this.state.navbarcolor || '#'} 
                                                                                onChange={this.handleNavbarcolor} /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="background_file">Upload background image</label>
                                <p>(Current/to be uploaded: {this.state.backgroundImage ? this.state.backgroundImageName : "none"})</p></td>
                                <td><input id="background_file" accept=".png, .jpg, .jpeg" type="file" name={this.state.backgroundImage ? "setting[background]" : ""} 
                                                                                                       onClick={this.emptyFileLoader}
                                                                                                       onChange={this.handleBackgroundImage}
                                                                                                       style={{color: "transparent"}} /></td>
                            </tr>
                            <tr>
                                <td><label>
                                        {this.state.backgroundImageName ? "Delete '" + this.state.backgroundImageName + "'" : ""}
                                        {this.state.backgroundImageName ?
                                            <input type="checkbox" onChange={this.handleDeleteBackground}
                                                                   disabled={!this.props.backgroundImage && !this.state.backgroundImage ? true : false}
                                                                   style={{width: "auto", marginLeft: "10px"}} />
                                            : null}
                                    </label>
                                </td>
                                {!this.state.backgroundImage || this.state.deleteBackground ?
                                    <td>
                                        Background color: <input type="text" name="setting[background_color]"
                                                                             value={this.state.backgroundColor || "#"}
                                                                             onChange={this.handleBackgroundColor}
                                                                             style={{width: "80px"}}/>
                                    </td>
                                    : <td></td>}
                            </tr>
                        </tbody>
                    </Table>

                    <div className="actions">
                        <input type="submit" name="commit" value={this.props.settingId ? "Submit changes" : "Submit settings"} />
                    </div>
                </form>
            </div>
        );
    }
}

export default SettingForm;