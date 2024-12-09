import React, { useState } from "react";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
export default function WorkingWithObjects() {
    const [assignment, setAssignment] = useState({
        id: 1, title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-10-10", completed: false, score: 0
    });
    const ASSIGNMENT_API_URL = `${REMOTE_SERVER}/lab5/assignment`;
    const [module, setModule] = useState({
        id: 1, name: "Applied Statistics",
        description: "Understanding probability distributions for real world examples",
        course: "AS101"
    });
    const MODULE_API_URL = `${REMOTE_SERVER}/lab5/module`;
    return (
        <div id="wd-working-with-objects">
            <h3>Working With Objects</h3>
            <h4>Modifying Properties</h4>
            <a id="wd-update-assignment-title" className="btn btn-primary float-end"
            href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
                Update Assignment Title
            </a>
            <input className="form-control w-75" id="wd-assignment-title"
                    value={assignment.title} onChange={(e) => setAssignment({...assignment, title: e.target.value})}/>
            <hr />

            <a id="wd-update-assignment-score" className="btn btn-primary float-end"
            href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
                Update Assignment Score
            </a>
            <input className="form-control w-75" id="wd-assignment-score" type="number"
                    value={assignment.score} onChange={(e) => setAssignment({...assignment, score: parseInt(e.target.value)})}/>
            <hr />

            <a id="wd-update-assignment-completed" className="btn btn-primary float-end"
            href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}>
                Update Assignment Completed
            </a>
            <input className="form-check" id="wd-assignment-completed" type="checkbox"
                    checked={assignment.completed} onChange={(e) => setAssignment({...assignment, completed: e.target.checked})}/>
            <hr />


            <a id="wd-update-module-name" className="btn btn-primary float-end"
            href={`${MODULE_API_URL}/name/${module.name}`}>
                Update Module Name
            </a>
            <input className="form-control w-75" id="wd-module-name"
                    value={module.name} onChange={(e) => setModule({...module, name: e.target.value})}/>
            <hr />

            <a id="wd-update-module-description" className="btn btn-primary float-end"
            href={`${MODULE_API_URL}/description/${module.description}`}>
                Update Module Description
            </a>
            <input className="form-control w-75" id="wd-module-description"
                    value={module.description} onChange={(e) => setModule({...module, description: e.target.value})}/>
            <hr />

            <h4>Retrieving Objects</h4>
            <a id="wd-retrieve-assignments" className="btn btn-primary"
            href={`${REMOTE_SERVER}/lab5/assignment`}>
                Get Assignment
            </a>
            <hr />

            <a id="wd-retrieve-modules" className="btn btn-primary"
            href={`${REMOTE_SERVER}/lab5/module`}>
                Get Module
            </a>
            <hr />

            <h4>Retrieving Properties</h4>
            <a id="wd-retrieve-assignment-title" className="btn btn-primary"
            href={`${REMOTE_SERVER}/lab5/assignment/title`}>
                Get Assignment Title
            </a>
            <hr />

            <a id="wd-retrieve-module-name" className="btn btn-primary"
            href={`${REMOTE_SERVER}/lab5/module/name`}>
                Get Module Name
            </a>
            <hr />
            
        </div>
    )
}