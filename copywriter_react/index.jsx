import * as React from "react"
import { startOfWeek, subWeeks, format, addDays, subMonths, getYear, isThisMonth } from 'date-fns';
import Project from "./Project";
import Day from "./Day";
import "./calendar.css";
import CreateProjectForm from "../../containers/CreateProjectForm";
// import EditProjectForm from "../../containers/EditProjectForm";
import EditProjectForm from "./EditProjectForm";
import Select from "../Select";
import Modal from "../Modal";

export default class Main extends React.Component {
    state = {
        currentDate: this.getFirstCalendarDay(new Date()),
        showFilter: false,
        todayIsActive: false,
        rightButtonsStatus: "left",
        createProjectModal: false,
        dateForCreateProject: null,
        editProjectModal: false,
        editProjectId: null,
    };
    componentDidUpdate(prevProps, prevState) {
        const prevDate = prevState.currentDate;
        const currDate = this.state.currentDate;
        if (prevDate.getMonth() !== currDate.getMonth()) {
            if (isThisMonth(currDate)) {
                this.setState({ currentDate: this.getFirstCalendarDay(new Date()), todayIsActive: false })
            } else {
                currDate.setDate(1);
                this.setState({ currentDate: currDate, todayIsActive: true });
            }
        }
    }
    render() {
        const { currentDate, showFilter, rightButtonsStatus, createProjectModal, dateForCreateProject, editProjectId, editProjectModal, todayIsActive } = this.state;
        const calendarRows = this.buildCalendar(currentDate);
        const campaigns = [
            { value: "campaigns", text: "Campaigns" },
            { value: "campaigns", text: "Campaigns2" },
        ];
        const projectTypes = [
            { value: "blog", text: "Blog Post" },
            { value: "website", text: "Website Page" },
            { value: "article", text: "Article" },
            { value: "description", text: "Product description" },
            { value: "release", text: "Press release" },
            { value: "Sales", text: "Sales letter" },
            { value: "paper", text: "White paper" },
            { value: "custom", text: "Custom" },
        ];
        return (
           <div>
               <div className="m_box c_breadcrumbs">
                   <div className="m_inb">
                       <a href="">Editorial calendar</a>
                   </div>
               </div>


               <div className="m_box c_calendar">
                   <div className="m_inb">

                       <div className="c_calendar-line">

                           <div className="c_calendar-filtbox">
                               <div className={`c_calendar-filter ${showFilter ? "active" : ""}`} onClick={this.toggleFilter}>Filters</div>
                               <div className={`c_calendar-todaybtn ${todayIsActive ? "" : "disabled"}`} onClick={this.setToday}>Today</div>
                           </div>

                           <div className="c_calendar-month">
                               <div className="c_calendar-month__prev" onClick={this.previousMonth} />
                               <div className="c_calendar-month__name">{format(currentDate, "MMMM")} {getYear(currentDate)}</div>
                               <div className="c_calendar-month__next" onClick={this.nextMonth} />
                           </div>

                           <div className="c_calendar-btn">
                               <div className={`c_calendar-btn__item c_calendar-btn__curent ${rightButtonsStatus === "left" ? "active" : ""}`} onClick={ () => { this.setRightButtonStatus("left") } }>Current step</div>
                               <div className={`c_calendar-btn__item c_calendar-btn__publ ${rightButtonsStatus === "right" ? " active" : ""}`} onClick={ () => { this.setRightButtonStatus("right") } }>Publish date</div>
                           </div>

                       </div>
                       <div className={`c_calendar-line filter-line js-filter-line ${ showFilter ? "open" : "" }`}>

                           <div className="c_calendar-select">
                               <Select options={campaigns} title="Campaigns" />
                           </div>

                           <div className="c_calendar-select">
                               <Select options={projectTypes} title="Select type" multiple />
                           </div>

                           <div className="c_calendar-select">
                               <Select options={[ { value: "1", text: "item 1" },{ value: "1", text: "item 2" }, ]} title="Statuses" loading/>
                           </div>

                           <div className="c_calendar-select">
                               <Select options={[ { value: "1", text: "item 1" },{ value: "1", text: "item 2" }, ]} title="Creator" />
                           </div>

                           <div className="c_calendar-select">
                               <Select options={[ { value: "1", text: "item 1" },{ value: "1", text: "item 2" }, ]} title="Tags" />
                           </div>
                       </div>

                       <div className="c_calendar-list">
                           <div className="c_calendar-item c_calendar-item__week">Sunday</div>
                           <div className="c_calendar-item c_calendar-item__week">Monday</div>
                           <div className="c_calendar-item c_calendar-item__week">Tuesday</div>
                           <div className="c_calendar-item c_calendar-item__week">Wednesday</div>
                           <div className="c_calendar-item c_calendar-item__week">Thursday</div>
                           <div className="c_calendar-item c_calendar-item__week">Friday</div>
                           <div className="c_calendar-item c_calendar-item__week">Saturday</div>

                           {calendarRows}
                       </div>

                   </div>
               </div>
               <div className="c_calendar-add" onClick={this.toggleCreateProjectModal} />

               <Modal open={createProjectModal} close={this.toggleCreateProjectModal} title="Add project" formClass="add">
                   <CreateProjectForm date={dateForCreateProject} close={this.toggleCreateProjectModal}/>
               </Modal>

               <Modal open={editProjectModal} close={this.toggleEditProjectModal} formClass="edit" title="Recent Google Algorithm Updates, What They Do, and How to Adjust Your Website">
                   <EditProjectForm id={editProjectId} close={this.toggleEditProjectModal} />
               </Modal>
           </div>
        )
    }
    getFirstCalendarDay(date) {
        const firstDayOfWeek = startOfWeek(date);
        return subWeeks(firstDayOfWeek, 1);
    }
    buildCalendar(date) {
        const { projects } = this.props;
        const days = 6 * 7;
        let calendarDays = [];
        for( let n = 0; n < days; n++) {
            const year = getYear(date);
            const month = date.getMonth();
            let day = date.getDate();
            let calendarProjects = [];
            if (projects[year] && projects[year][month] && projects[year][month][day]) {
                const eventProjects = projects[year][month][day];
                if (eventProjects) {
                    calendarProjects = eventProjects.map( (project, n) => <Project project={project} key={"project-" + n} edit={this.toggleEditProjectModal} /> );
                }
            }
            calendarDays.push( <Day openCreateProjectForm={this.toggleCreateProjectModal} date={date} key={"calendar-day" + n}>{calendarProjects}</Day> );
            date = addDays(date, 1);
        }
        return calendarDays;
    }
    previousMonth = () => {
        this.setState({
            currentDate: subMonths(this.state.currentDate, 1),
        })
    };
    nextMonth = () => {
        this.setState({
            currentDate: subMonths(this.state.currentDate, -1),
        })
    };
    toggleFilter = () => {
        this.setState({ showFilter: !this.state.showFilter });
    };
    toggleCreateProjectModal = (date) => {
        this.setState({ createProjectModal: !this.state.createProjectModal, dateForCreateProject: date });
    };
    toggleEditProjectModal = (id) => {
        this.setState({ editProjectModal: !this.state.editProjectModal, editProjectId: id });
    };
    setRightButtonStatus = (value) => {
        this.setState({ rightButtonsStatus: value })
    };
    setToday = () => {
        if (this.state.todayIsActive) {
            this.setState({ currentDate: new Date() })
        }
    }
}