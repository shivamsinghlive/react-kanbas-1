import { FaUserCircle } from "react-icons/fa";
import PeopleDetails from "./Details";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import * as courseClient from "../client";
import { useEffect, useState } from "react";
// import * as db from "../../Database";

export default function PeopleTable({ users = [] }: { users?: any[] }) {
    const { cid } = useParams();
    const [userss, setUserss] = useState<any[]>([]);
    
    useEffect(() => {
        const fetchEnrollmentsForCourse = async () => {
            if (cid) {
                try {
                    const enrolledUsers = await courseClient.findUsersForCourse(cid)
                    setUserss(enrolledUsers);
                } catch (error) {
                    console.error(error);
                }
            }
        };
        fetchEnrollmentsForCourse();
    }, [cid]);
    
    const displayUsers = cid ? userss : users
    // const { users, enrollments } = db;
    return (
        <div id="wd-people-table">
            <PeopleDetails />
            <table className="table table-striped">
                <thead>
                <tr><th>Name</th><th>Login ID</th><th>Section</th><th>Role</th><th>Last Activity</th><th>Total Activity</th></tr>
                </thead>
                <tbody>
                    {displayUsers
                        // .filter((usr) => 
                        //     enrollments.some((enrollment) => enrollment.user === usr._id && enrollment.course === cid))
                            .map((user: any) => (
                                <tr><td className="wd-full-name text-nowrap">
                                    <Link to={`/Kanbas/Account/Users/${user._id}`} className="text-decoration-none">
                                        <FaUserCircle className="me-2 fs-1 text-secondary" />
                                        <span className="wd-first-name">{user.firstName}</span>{" "}
                                        <span className="wd-last-name">{user.lastName}</span>                                   
                                    </Link>
                                    </td> 
                                    <td className="wd-login-id">{user.loginId}</td>
                                    <td className="wd-section">{user.section}</td>
                                    <td className="wd-role">{user.role}</td>
                                    <td className="wd-last-activity">{user.lastActivity}</td>
                                    <td className="wd-total-activity">{user.totalActivity}</td> 
                                </tr>
                            ))
                    }
                </tbody>
            </table>
        </div> 
    );
}