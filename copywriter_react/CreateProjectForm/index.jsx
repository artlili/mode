import * as React from "react";
import Select from "../../Select";
import { format, addDays, isDate } from "date-fns";

export default class createProjectForm extends React.Component {
    state = {
        topic: "",
        brief: "",
        format: "blog",
        industry: "finance",
        word_count: "00,000",
        formats: [
            {
                "value": "blog",
                "text": "Blog Posts"
            },
            {
                "value": "page",
                "text": "Website Pages"
            },
        ],
        industrials: [
            {
                "value": "finance",
                "industry_name": "Finance / Insurance: Tax, Banking, Economy",
                "text": "Finance / Insurance"
            },
            {
                "value": "im",
                "industry_name": "Internet Marketing: SEO, SEM, CRO, E-comm, Social, Blogging",
                "text": "Internet Marketing"
            },
        ]
    };
    render() {
        const { date } = this.props;
        const orderOnDate = isDate(date) ? format(date, "YYYY-MM-DD") : "";
        const plannedDate = isDate(date) ? format(addDays(date, 5), "YYYY-MM-DD") : "";
        const { formats, industrials, word_count } = this.state;
        // return (
        //     <div className="popup-add popup" style={{ display: open ? "block" : "none" }}>
        //         <div className="popup-inner">
        //             <div className="popup-close" onClick={close}></div>
        //             <div className="popup-title">Add project</div>
        //             <div className="popup-body">
        //                 <form onSubmit={this.onSubmit}>
        //                     <div className="form-input">
        //                         <label htmlFor="topic">Project topic*</label>
        //                         <input required type="text" id="topic" name="topic" placeholder="Lorem ipsum dolor" onChange={this.handleChange} />
        //                     </div>
        //                     <div className="form-input">
        //                         <label htmlFor="brief">Project brief</label>
        //                         <textarea required onChange={this.handleChange} name="brief" id="brief" defaultValue="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."/>
        //                     </div>
        //                     <div className="form-input form-input__file">
        //                         <input type="file" id="file" name="attach" placeholder="Lorem ipsum dolor" />
        //                         <label htmlFor="file">Attach files</label>
        //                     </div>
        //                     <div className="form-input form-input-flex">
        //                         <div className="form-input-3">
        //                             <label htmlFor="format">Format</label>
        //                             <select onChange={this.handleChange} name="format" id="format">
        //                                 <option value="blog">Blog Posts</option>
        //                                 <option value="page">Website Pages</option>
        //                             </select>
        //                         </div>
        //                         <div className="form-input-2">
        //                             <label htmlFor="word_count">Word count</label>
        //                             <input required onChange={this.handleChange} type="text" name="word_count"/>
        //                         </div>
        //                         <div className="form-input-5">
        //                             <label htmlFor="industry">Compaing</label>
        //                             <select name="industry" id="industry">
        //                                 <option value="finance">Finance / Insurance</option>
        //                                 <option value="im">Internet Marketing</option>
        //                             </select>
        //                         </div>
        //                     </div>
        //                     <div className="form-input form-input-flex">
        //                         <div className="form-input-33">
        //                             <label htmlFor="Order on">Order on</label>
        //                             <input type="date" name="Order on" id="Order on" defaultValue={date}/>
        //                         </div>
        //                         <div className="form-input-33">
        //                             <label htmlFor="Planned_publish">Planned publish</label>
        //                             <input type="date" name="Planned_publish" id="Planned_publish" />
        //                         </div>
        //                         <div className="form-input-33">
        //                             <label htmlFor="Time">Time</label>
        //                             <input type="date" name="Time" id="Time" />
        //                         </div>
        //                     </div>
        //                     <div className="form-input-flex form-input-submit">
        //                         <input type="submit" value="Save draft" />
        //                         <button type="submit" name="Order">Order</button >
        //                     </div>
        //                 </form>
        //             </div>
        //         </div>
        //     </div>
        // )
        return (
            <form onSubmit={this.onSubmit}>
                <div className="form-input">
                    <label htmlFor="topic">Project topic*</label>
                    <input type="text" id="topic" name="topic" placeholder="Lorem ipsum dolor"
                           className="error" onChange={this.handleChange} />
                </div>
                <div className="form-input">
                    <label htmlFor="brief">Project brief</label>
                    <textarea onChange={this.handleChange} name="brief" id="brief" defaultValue="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." />
                </div>
                <div className="form-input form-input__file">
                    <input type="file" id="file" name="attach" placeholder="Lorem ipsum dolor"/>
                        <label htmlFor="file">Attach files</label>
                </div>
                <div className="form-input form-input-flex">
                    <div className="form-input-3 dropdown-form-input">
                        <div className="label">Format</div>
                        <Select options={formats} />
                    </div>
                    <div className="form-input-2">
                        <label htmlFor="word_count">Word count</label>
                        <input value={word_count} name="word_count" onChange={this.onWordCountChange} />
                    </div>
                    <div className="form-input-5 dropdown-form-input">
                        <div className="label">Campaign</div>
                        <Select options={industrials}/>
                    </div>
                </div>
                <div className="form-input form-input-flex">
                    <div className="form-input-33">
                        <label htmlFor="Orderon">Order on</label>
                        <div className="input date">
                            <input type="text" className="js-date" name="Order_on" id="Order_on"
                                   value={orderOnDate} />
                        </div>
                    </div>
                    <div className="form-input-33">
                        <label htmlFor="Planned_publish">Planned publish</label>
                        <div className="input date">
                            <input type="text" className="js-date" name="Planned_publish"
                                   id="Planned_publish" value={plannedDate} />
                        </div>

                    </div>
                    <div className="form-input-33">
                        <label htmlFor="Time">Time</label>
                        <div className="input time">
                            <input type="text" className="js-time" name="Time" id="Time" defaultValue="12:00" />
                        </div>
                    </div>
                </div>
                <div className="form-input-help">
                    Too soon <img src="img/help.png" alt="help" />
                </div>
                <div className="form-input-flex form-input-submit">
                    <input type="submit" value="Save draft" className="button_filter" />
                        <button type="submit" name="Order">Order</button>
                </div>
            </form>
        )
    }
    handleChange = (ev) => {
        const target = ev.target;
        this.setState({ [target.name]: target.value })
    };
    onWordCountChange = (ev) => {
        const target = ev.target;
        let value = target.value.replace(",", "");
        if (+value || !value) {
            if (value.length > 3) {
                const startSlice = value.length - 3;
                value = value.slice(0, startSlice) + "," + value.slice(-3)
            }
            this.setState({ word_count: value })
        }
    };
    onSubmit = (ev) => {
        ev.preventDefault();
     //   const { topic, brief, format, industry, word_count  } = this.state;
        const { close } = this.props;
        // const data = {
        //     level: "standard",
        //     match: "no",
        //     turnaround: "regular",
        //     localization: "us",
        //     topic, brief, format, industry, word_count
        // };
     //   createProject(data);
        close();
    }
}