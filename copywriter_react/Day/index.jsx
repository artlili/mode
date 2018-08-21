import * as React from "react";
import { format, isToday, isThisMonth } from "date-fns";

export default class Day extends React.Component {
    state = {
        showProjects: 3
    };
    render() {
        const { date, children, openCreateProjectForm } = this.props;
        const { showProjects } = this.state;
        let showMore = false;
        if (children && children.length > showProjects) {
            showMore = true;
        }
        let day = date.getDate();
        if (day === 1 && !isToday(day)) {
            day = `${format(date, "MMM")} 1`;
        }
        return(
            <div className={`c_calendar-item c_calendar-item__day ${ isThisMonth(date) ? "" : "c_calendar-item__nextmonth" } ${ isToday(date) ? "c_calendar-item__today" : "" }`}>
                <div className="c_calendar-item__add" onClick={ () => openCreateProjectForm(date) }>Add</div>
                <div className="c_calendar-item__todaytitle">Today</div>
                <div className="c_calendar-item__num">{day}</div>
                {children && children.slice(0, showProjects)}
                {
                    showMore ?
                    <div className="c_calendar-item__more" onClick={this.showMoreProjects}>+{children && children.length - showProjects} more</div>
                    : null
                }
            </div>
        )
    }
    toggleModal = () => {
        this.setState({
            modalOpen: !this.state.modalOpen
        })
    };
    showMoreProjects = () => {
        this.setState({
            showProjects: this.props.children.length
        })
    }
}