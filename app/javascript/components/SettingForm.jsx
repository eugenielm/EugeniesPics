import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Table, OverlayTrigger, Popover } from 'react-bootstrap';
import ErrorsComponent from './ErrorsComponent';
import { SketchPicker } from 'react-color';


const PopoverColorPicker = (props) => {
    return (
        <Popover id="popover-trigger-click" placement="bottom" positionLeft={props.positionLeft} positionTop={props.positionTop}>
            <SketchPicker
                color={props.currentColor}
                onChangeComplete={props.handleColorChange}
            />
        </Popover>
    )
};


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

    handleNavbarcolor(col) {
        this.props.updateNavbarcolor(col.hex);
    }

    handleNavbarfont(col) {
        this.props.updateNavbarfont(col.hex);
    }

    handleBackgroundColor(col) {
        this.props.updateBackgroundColor(col.hex);
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
        if (!this.state.navbarcolor.match(/#[0-9a-z]{6}/i)) {
            alerts += "Please provide a background color for the navigation bar. "
        }
        if (!this.state.navbarfont.match(/#[0-9a-z]{6}/i)) {
            alerts += "Please provide a background color for the website main title and subtitle fonts. "
        }
        if (!this.state.backgroundImage && !this.state.backgroundColor.match(/#[0-9a-z]{6}/i)) {
            alerts += "Please provide a background color for the website body. "
        }
        if (this.props.user && !this.props.user.superadmin) {
            alerts += "You don't have the required permissions to edit the website layout."
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
                    
                    <Table bordered responsive striped id="setting_form_table">
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
                                <td><input id="setting_navbarfont" readOnly type="text" name="setting[navbarfont]" 
                                                                                        value={this.state.navbarfont}
                                                                                        style={{width: "70px"}} />
                                <OverlayTrigger trigger="click" placement="bottom" 
                                                                overlay={<PopoverColorPicker {...this.props}
                                                                                             handleColorChange={this.handleNavbarfont}
                                                                                             currentColor={this.state.navbarfont} />}
                                >
                                    <Button bsSize="xsmall" style={{height: "23px", marginLeft: "5px", marginTop: "-2px", outline: 0}}>Pick a color</Button>
                                </OverlayTrigger>
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="setting_navbarcolor">Navigation bar background color</label></td>
                                <td><input id="setting_navbarcolor" readOnly type="text" name="setting[navbarcolor]" 
                                                                                         value={this.state.navbarcolor}
                                                                                         style={{width: "70px"}} />
                                <OverlayTrigger trigger="click" placement="bottom" 
                                                                overlay={<PopoverColorPicker {...this.props}
                                                                                             handleColorChange={this.handleNavbarcolor}
                                                                                             currentColor={this.state.navbarcolor} />}
                                >
                                    <Button bsSize="xsmall" style={{height: "23px", marginLeft: "5px", marginTop: "-2px", outline: 0}}>Pick a color</Button>
                                </OverlayTrigger>
                                </td>
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
                                        {this.state.backgroundImageName ? "Delete '" + this.state.backgroundImageName + "'" : "Background color"}
                                        {this.state.backgroundImageName ?
                                            <input type="checkbox" onChange={this.handleDeleteBackground}
                                                                   disabled={!this.props.backgroundImage && !this.state.backgroundImage ? true : false}
                                                                   style={{width: "auto", marginLeft: "10px"}} />
                                            : null}
                                    </label>
                                </td>
                                {!this.state.backgroundImage || this.state.deleteBackground ?
                                    <td><input readOnly type="text" name="setting[background_color]" 
                                                                    value={this.state.backgroundColor}
                                                                    style={{width: "70px"}} />
                                        <OverlayTrigger trigger="click" placement="bottom" 
                                                                        overlay={<PopoverColorPicker {...this.props}
                                                                                                     handleColorChange={this.handleBackgroundColor}
                                                                                                     currentColor={this.state.backgroundColor} />}
                                        >
                                            <Button bsSize="xsmall" style={{height: "23px", marginLeft: "5px", marginTop: "-2px", outline: 0}}>
                                                Pick a color
                                            </Button>
                                        </OverlayTrigger>
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