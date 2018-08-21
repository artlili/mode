import * as React from "react";

export default class EditProjectForm extends React.Component {
    render() {
       // const { project, loading } = this.props;
        return(
            <form action="/">
                <div className="edit-group">
                    <div className="form-input-flex edit edit-form">
                        <div className="form-input-name">Campaign:</div>
                        <div className="form-input-value">Dr Choy social</div>
                        <div className="edit-icon js-edit"></div>
                        <div className="editable-input">
                            <input type="text" defaultValue="Dr Choy social" />
                                <div className="save-icon js-save"></div>
                        </div>
                    </div>
                    <div className="form-input-flex edit edit-form">
                        <div className="form-input-name">Campaign:</div>
                        <div className="form-input-value">Facebook post</div>
                        <div className="edit-icon js-edit"></div>
                        <div className="editable-input">
                            <input type="text" defaultValue="Facebook post"/>
                                <div className="save-icon js-save"></div>
                        </div>
                    </div>
                    <div className="form-input-flex edit edit-form">
                        <div className="form-input-name">Tags:</div>
                        <div className="form-input-value">Awareness, SMB</div>
                        <div className="edit-icon js-edit"></div>
                        <div className="editable-input">
                            <input type="text" defaultValue="Awareness, SMB"/>
                                <div className="save-icon js-save"></div>
                        </div>
                    </div>
                    <div className="form-input-flex edit">
                        <div className="form-input-name">Created by:</div>
                        <div className="form-input-value value-img">Andy Z <img src="img/user.png" alt="user"/></div>
                    </div>
                    <div className="form-input-flex edit">
                        <div className="form-input-name">Writer:</div>
                        <div className="form-input-value value-img">Brenna C <img src="img/user.png" alt="user"/></div>
                    </div>
                    <div className="form-input-flex edit">
                        <div className="form-input-name">Status:</div>
                        <div className="form-input-value value-status">Draft</div>
                    </div>
                </div>
                <div className="edit-date-group">
                    <div className="form-input-flex edit-date">
                        <div className="form-input-name">Current step due:</div>
                        <div className="form-input-value">18/07/2018 4:00PM</div>
                        <div className="edit-icon js-date"></div>
                    </div>
                    <div className="form-input-flex edit-date">
                        <div className="form-input-name">Planed publish:</div>
                        <div className="form-input-value">28/07/2018 4:00PM</div>
                        <div className="edit-icon js-date"></div>
                    </div>
                </div>
                <div className="form-input-flex form-input-submit">
                    <input type="submit" defaultValue="Order" className="button_filter"/>
                        <button type="submit" name="Order">Edit</button>
                </div>

            </form>
        )
    }
}