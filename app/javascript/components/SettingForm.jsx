import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Table, OverlayTrigger, Popover } from 'react-bootstrap';
import ErrorsComponent from './ErrorsComponent';
import { SketchPicker } from 'react-color';


const PopoverColorPicker = (props) => {
    return (
        <Popover id="popover-trigger-click" placement="bottom" 
                                            positionLeft={props.positionLeft} 
                                            positionTop={props.positionTop}>
            <SketchPicker
                color={props.currentColor}
                onChangeComplete={props.handleColorChange}
            />
        </Popover>
    )
};


class SettingForm extends React.Component {

    componentWillMount() {
        if (!this.props.previewing) {
            this.props.updatePreviewMode(true);
        }
        this.setState({
            deleteBackgroundPic: false,
            deleteIdPic: false,
        });
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
        
    }

    componentWillUnmount() {
        this.props.updatePreviewMode(false);
        this.props.reinitializePreviewSettings();
    }

    handleBackgroundImage(event) {
        if (event.target.files[0] && event.target.files[0].size < 2000000 && this.props.user.superadmin) {
            document.getElementById("settingForm").submit();
        } else {
            if (event.target.files[0] && event.target.files[0].size >= 2000000) {
                alert("The background picture you uploaded exceeded the max size of 2Mb ("
                + (event.target.files[0].size / 1000) + "ko)");
                event.target.value = "";
            } else {
                this.props.updatePreviewSettings(["backgroungImage", event.target.files[0]]);
                this.props.updatePreviewSettings(["backgroundImageName", event.target.files[0].name]);
            }
        }
    }

    handleIdPicture(event) {
        if (event.target.files[0] && event.target.files[0].size < 3000000 && this.props.user.superadmin) {
            document.getElementById("settingForm").submit();
        } else {
            if (event.target.files[0] && event.target.files[0].size >= 3000000) {
                alert("The ID picture you uploaded exceeded the max size of 3Mb ("
                + (event.target.files[0].size / 1000) + "ko)");
                event.target.value = "";
            } else {
                this.props.updatePreviewSettings(["idPicture", event.target.files[0]]);
                this.props.updatePreviewSettings(["idPictureName", event.target.files[0].name]);
            }
        }
    }

    handleMaintitle(event) {
        if (event.target.value.length <= 20) {
            this.props.updatePreviewSettings(["maintitle", event.target.value]);
        }  
    }

    handleSubtitle(event) {
        if (event.target.value.length <= 40) {
            this.props.updatePreviewSettings(["subtitle", event.target.value]);
        }  
    }

    handleNavbarcolor(col) {
        this.props.updatePreviewSettings(["navbarcolor", col.hex]);
    }

    handleNavbarfont(col) {
        this.props.updatePreviewSettings(["navbarfont", col.hex]);
    }

    handleBackgroundColor(col) {
        this.props.updatePreviewSettings(["backgroundColor", col.hex]);
    }

    handleDeleteBackground() {
        if (document.getElementById("delBackgroundPic").checked) {
            this.props.updatePreviewSettings(["backgroundImage", null]);
            this.props.updatePreviewSettings(["backgroundImageName", null]);
            this.setState({deleteBackgroundPic: true});
        } else {
            if (this.props.settings.originalBackgroundImage) {
                this.props.updatePreviewSettings(["backgroundImage", this.props.settings.originalBackgroundImage]);
                this.props.updatePreviewSettings(["backgroundImageName", this.props.settings.originalBackgroundImageName]);
                this.setState({deleteBackgroundPic: false});
            }
        }
    }

    handleDeleteIdPicture() {
        if (document.getElementById("delIdPic").checked) {
            this.props.updatePreviewSettings(["idPicture", null]);
            this.props.updatePreviewSettings(["idPictureName", null]);
            this.setState({deleteIdPic: true});
        } else {
            if (this.props.settings.originalIdImage) {
                this.props.updatePreviewSettings(["idPicture", this.props.settings.originalIdPicture]);
                this.props.updatePreviewSettings(["idPictureName", this.props.settings.originalIdPictureName]);
                this.setState({deleteIdPic: false});
            }
        }
    }

    handleSubmit(event) {
        let alerts = '';
        if (!this.props.settings.navbarcolor.match(/#[0-9a-z]{6}/i)) {
            alerts += "Please provide a background color for the navigation bar. "
        }
        if (!this.props.settings.navbarfont.match(/#[0-9a-z]{6}/i)) {
            alerts += "Please provide a background color for the website main title and subtitle fonts. "
        }
        if (!this.props.settings.backgroundImage && !this.props.settings.backgroundColor.match(/#[0-9a-z]{6}/i)) {
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
        const form_action = this.props.settings.settingId ? 
                            ("/settings/" + this.props.settingId) 
                            : ("/settings");
        const input_edit = this.props.settings.settingId ? 
                            React.createElement('input', {type: 'hidden', name: '_method', value: 'patch'}) 
                            : null;
        const page_title = this.props.settings.settingId ? "Edit settings" : "New settings";

        return (
            <div className="form-layout">
                <div className="admin-page-title">{page_title}</div>

                { this.props.setting_errors ? (<ErrorsComponent errors={this.props.setting_errors} model={"setting"} />) : null }
                <form encType="multipart/form-data" 
                      action={form_action} 
                      method="post" 
                      acceptCharset="UTF-8" 
                      id="settingForm"
                      onSubmit={this.handleSubmit} >
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value={this.props.token || ''} readOnly />

                    {this.state.deleteBackgroundPic ? 
                        <input type="hidden" name="deleteBackgroundPic" value={true}/>
                        : null}
                    {this.state.deleteIdPic ? 
                        <input type="hidden" name="deleteIdPic" value={true}/>
                        : null}
                    
                    {input_edit}
                    
                    <Table bordered responsive striped id="setting_form_table">
                        <tbody>
                            <tr>
                                <td><label htmlFor="setting_maintitle">Website main title</label></td>
                                <td><input id="setting_maintitle" type="text" name="setting[maintitle]" 
                                                                              value={this.props.settings.maintitle || ''} 
                                                                              onChange={this.handleMaintitle} /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="setting_subtitle">Website sub-title</label></td>
                                <td><input id="setting_subtitle" type="text" name="setting[subtitle]" 
                                                                             value={this.props.settings.subtitle || ''} 
                                                                             onChange={this.handleSubtitle} /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="setting_navbarfont">Main title and sub-title color</label></td>
                                <td><OverlayTrigger trigger="click" placement="bottom" 
                                                                    overlay={<PopoverColorPicker {...this.props}
                                                                                handleColorChange={this.handleNavbarfont}
                                                                                currentColor={this.props.settings.navbarfont} />}
                                    >
                                        <Button id="setting_navbarfont" style={{background: this.props.settings.navbarfont}}>
                                        </Button>
                                    </OverlayTrigger>
                                    <input hidden readOnly type="text" name="setting[navbarfont]" value={this.props.settings.navbarfont} />
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="setting_navbarcolor">Navigation bar background color</label></td>
                                <td><OverlayTrigger trigger="click"
                                                    placement="bottom" 
                                                    overlay={<PopoverColorPicker {...this.props}
                                                                handleColorChange={this.handleNavbarcolor}
                                                                currentColor={this.props.settings.navbarcolor} />}
                                    >
                                        <Button id="setting_navbarcolor" style={{background: this.props.settings.navbarcolor}}>
                                        </Button>
                                    </OverlayTrigger>
                                    <input hidden readOnly type="text" name="setting[navbarcolor]" value={this.props.settings.navbarcolor} />
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="background_file">Upload background image</label><br/>
                                {this.props.settings.backgroundImageName ? 
                                    this.props.settings.backgroundImageName == this.props.settings.originalBackgroundImageName ?
                                        <p style={{margin: 0}}>(Current: {this.props.settings.backgroundImageName})</p>
                                        : <p style={{margin: 0}}>(To be uploaded: {this.props.settings.backgroundImageName})</p>
                                    : <span>(Current: none)</span>}
                                </td>
                                <td><input id="background_file" accept=".png, .jpg, .jpeg" 
                                                                type="file" 
                                                                name="setting[background]"
                                                                onChange={this.handleBackgroundImage}
                                                                style={{color: "transparent"}} />
                                </td>
                            </tr>
                            
                            {this.props.settings.originalBackgroundImage ?
                                <tr>
                                    <td>Delete background picture</td>
                                    <td><input type="checkbox" 
                                               id="delBackgroundPic"
                                               onChange={this.handleDeleteBackground}
                                               style={{width: "auto", marginLeft: "10px"}} /></td>
                                </tr>
                                : null }
                                
                            {!this.props.settings.backgroundImage ?
                                <tr>
                                    <td><label>Choose background color</label></td>
                                    <td><input hidden readOnly type="text" 
                                                               name="setting[background_color]" 
                                                               value={this.props.settings.backgroundColor} />
                                        <OverlayTrigger trigger="click" placement="bottom" 
                                                                        overlay={<PopoverColorPicker {...this.props}
                                                                                    handleColorChange={this.handleBackgroundColor}
                                                                                    currentColor={this.props.settings.backgroundColor} />}
                                        >
                                            <Button id="setting_backgroundcolor" 
                                                    style={{background: this.props.settings.backgroundColor}}>
                                            </Button>
                                        </OverlayTrigger>
                                    </td>
                                </tr>
                                : null }
                            
                            <tr>
                                <td><label htmlFor="idpicture_file">ID picture in contact page</label><br/>
                                    {this.props.settings.idPictureName ? 
                                        this.props.settings.idPictureName == this.props.settings.originalIdPictureName ?
                                            <p style={{margin: 0, display: "inline"}}>Current: {this.props.settings.idPictureName}</p> 
                                            : <p style={{margin: 0, display: "inline"}}>To be uploaded: {this.props.settings.idPictureName}</p>
                                        : <span>Current: none</span>}
                                    {this.props.settings.idPictureName ? " - delete" : null}
                                    {this.props.settings.idPictureName ? 
                                        <input type="checkbox" onChange={this.handleDeleteIdPicture}
                                                               id="delIdPic"
                                                               style={{width: "auto", marginLeft: "8px"}} />
                                        : null}
                                </td>
                                <td><input id="id_picture_file" accept=".png, .jpg, .jpeg" 
                                                                type="file" 
                                                                name="setting[id_picture]"
                                                                onChange={this.handleIdPicture}
                                                                style={{color: "transparent", display: "inline", width: "85px"}} />
                                </td>
                            </tr>
                        </tbody>
                    </Table>

                    <div className="actions">
                        <input type="submit" name="commit" value={this.props.settings.settingId ? "Submit changes" : "Submit settings"} />
                    </div>
                </form>
            </div>
        );
    }
}

export default SettingForm;