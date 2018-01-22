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
        this.handleIdPicture = this.handleIdPicture.bind(this);
        this.handleBackgroundColor = this.handleBackgroundColor.bind(this);
        this.handleDeleteBackground = this.handleDeleteBackground.bind(this);
        this.handleDeleteIdPicture = this.handleDeleteIdPicture.bind(this);
        this.handleMaintitle = this.handleMaintitle.bind(this);
        this.handleSubtitle = this.handleSubtitle.bind(this);
        this.handleNavbarcolor = this.handleNavbarcolor.bind(this);
        this.handleNavbarfont = this.handleNavbarfont.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.emptyFileLoaderBckgd = this.emptyFileLoaderBckgd.bind(this);
        this.emptyFileLoaderId = this.emptyFileLoaderId.bind(this);
        this.setState(this.initialState(this.props));
    }

    initialState(props) {
        return { token: props.token,
                 errors: props.setting_errors || null,
                 user: props.user || null,
                 backgroundImage: props.backgroundImage,
                 idPicture: props.idPicture,
                 deleteBackground: false,
                 deleteIdPicture: false,
                 backgroundColor: props.backgroundColor,
                 backgroundImageName: props.backgroundImageName,
                 idPictureName: props.idPictureName,
                 maintitle: props.maintitle,
                 subtitle: props.subtitle,
                 navbarcolor: props.navbarcolor,
                 navbarfont: props.navbarfont,
                 setting_id: props.settingId,
                 original_bckgd_pic: true,
                 original_id_pic: true,
                };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps) {
            this.setState(this.initialState(nextProps));
        }
    }

    handleBackgroundImage(event) {
        if (event.target.files[0] && event.target.files[0].size < 2000000) {
            this.setState({ backgroundImage: event.target.files[0],
                            backgroundImageName: event.target.files[0].name,
                            deleteBackground: false});
        } else {
            alert("The background picture you uploaded exceeded the max size of 2Mb (" + (event.target.files[0].size / 1000) + "ko)");
            event.target.value = "";
        }
    }

    handleIdPicture(event) {
        if (event.target.files[0] && event.target.files[0].size < 3000000) {
            this.setState({ idPicture: event.target.files[0],
                            idPictureName: event.target.files[0].name,
                            deleteIdPicture: false});
        } else {
            alert("The ID picture you uploaded exceeded the max size of 3Mb (" + (event.target.files[0].size / 1000) + "ko)");
            event.target.value = "";
        }
    }

    emptyFileLoaderBckgd(e) {
        // needed to be sure the form is up-to-date with the picture that's gonna be submitted
        e.target.value = "";
        this.setState({deleteBackground: true,
                       backgroundImage: null,
                       backgroundImageName: undefined});
    }

    emptyFileLoaderId(e) {
        // needed to be sure the form is up-to-date with the picture that's gonna be submitted
        e.target.value = "";
        this.setState({deleteIdPicture: true,
                       idPicture: null,
                       idPictureName: undefined});
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
                       backgroundImageName: null,
                       original_bckgd_pic: false});
        this.props.backgroundImage ? this.props.updateBackgroundImage(null) : null;
        this.props.backgroundImageName ? this.props.updateBackgroundImageName(null) : null;
    }

    handleDeleteIdPicture() {
        this.setState({deleteIdPicture: !this.state.deleteIdPicture,
                       idPicture: null,
                       idPictureName: null,
                       original_id_pic: false});
        this.props.idPicture ? this.props.updateIdPicture(null) : null;
        this.props.idPictureName ? this.props.updateIdPictureName(null) : null;
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

                    {this.state.original_bckgd_pic && this.state.backgroundImageName ? 
                        <input type="hidden" name="original_bckgd_pic" value={true}/>
                        : null}
                    {this.state.original_id_pic && this.state.idPictureName ? 
                        <input type="hidden" name="original_id_pic" value={true}/>
                        : null}
                    
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
                                <td><OverlayTrigger trigger="click" placement="bottom" 
                                                                    overlay={<PopoverColorPicker {...this.props}
                                                                                                 handleColorChange={this.handleNavbarfont}
                                                                                                 currentColor={this.state.navbarfont} />}
                                    >
                                        <Button id="setting_navbarfont" 
                                                style={{background: this.state.navbarfont, 
                                                        border: "solid thin #b3b3b3",
                                                        borderRadius: '3px', 
                                                        width: '30px', 
                                                        height: '25px'}}>
                                        </Button>
                                    </OverlayTrigger>
                                    <input hidden readonly type="text" name="setting[navbarfont]" value={this.state.navbarfont} />
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="setting_navbarcolor">Navigation bar background color</label></td>
                                <td><OverlayTrigger trigger="click" placement="bottom" 
                                                                overlay={<PopoverColorPicker {...this.props}
                                                                                             handleColorChange={this.handleNavbarcolor}
                                                                                             currentColor={this.state.navbarcolor} />}
                                    >
                                        <Button id="setting_navbarcolor" 
                                                style={{background: this.state.navbarcolor, 
                                                        border: "solid thin #b3b3b3",
                                                        borderRadius: '3px', 
                                                        width: '30px',
                                                        height: '25px'}}>
                                        </Button>
                                    </OverlayTrigger>
                                    <input hidden readonly type="text" name="setting[navbarcolor]" value={this.state.navbarcolor} />
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="background_file">Upload background image</label><br/>
                                (Current: {this.state.backgroundImage ? <p style={{margin: 0}}>{this.state.backgroundImageName})</p>
                                                                      : <span> none)</span>}</td>
                                <td><input id="background_file" accept=".png, .jpg, .jpeg" type="file" name="setting[background]"
                                                                                                       onClick={this.emptyFileLoaderBckgd}
                                                                                                       onChange={this.handleBackgroundImage}
                                                                                                       style={{color: "transparent"}} /></td>
                            </tr>
                            <tr>
                                <td><label>
                                    {this.state.backgroundImageName ? "Delete '" + this.state.backgroundImageName + "'" : "Background color"}
                                    {this.state.backgroundImageName ?
                                        <input type="checkbox" onChange={this.handleDeleteBackground}
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
                                            <Button bsSize="xsmall" style={{height: "23px", marginLeft: "5px", marginTop: "-4px", outline: 0}}>
                                                Pick a color
                                            </Button>
                                        </OverlayTrigger>
                                    </td>
                                    : <td></td>}
                            </tr>
                            <tr>
                                <td><label htmlFor="background_file">ID picture</label><br/>
                                    Current: {this.state.idPicture ? <p style={{margin: 0, display: "inline"}}>{this.state.idPictureName} </p> 
                                                                    : <span> none</span>}
                                    {this.state.idPictureName ? " > delete" : null}
                                    {this.state.idPictureName ? 
                                        <input type="checkbox" onChange={this.handleDeleteIdPicture}
                                                               style={{width: "auto", marginLeft: "8px"}} />
                                        : null}
                                </td>
                                <td><input id="id_picture_file" accept=".png, .jpg, .jpeg" type="file" name={this.state.idPicture ? "setting[id_picture]" : ""}
                                                                                                       onClick={this.emptyFileLoaderId}
                                                                                                       onChange={this.handleIdPicture}
                                                                                                       style={{color: "transparent", display: "inline", width: "85px"}} />
                                </td>
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