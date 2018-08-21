import * as React from "react";
import { differenceInDays, differenceInHours } from "date-fns";
const mlLogo = require("./circle-plus.png");

export default class CalendarProject extends React.Component {
    render() {
        const { project, edit } = this.props;
        let title = "";
        if (project.deadline) {
            const date = new Date();
            const deadline = new Date(project.deadline);
            const diffInDays = differenceInDays(date, deadline);
            if (diffInDays <= 3 && diffInDays > 0) {
                title = `Publish in ${differenceInHours(date, deadline)}h`
            } else {
                title = `Overdue by ${differenceInHours(date, deadline)}h`;
            }
        }
        return (
            <div className={`c_calendar-item__task c_calendar-item__${project.status}`} onClick={ () => edit(project.project_id) }>
                <div className="c_calendar-item__title">{title}</div>
                <div className="c_calendar-item__desc">{project.topic}</div>
                <div className="c_calendar-item__option">
                    <div className="c_calendar-item__user">
                        <div className="c_calendar-item__thumb">
                            <img src={mlLogo} alt="ML" />
                        </div>
                        ML
                    </div>
                    <div className="c_calendar-item__status">{project.status}</div>
                </div>
            </div>
        )
    }
}