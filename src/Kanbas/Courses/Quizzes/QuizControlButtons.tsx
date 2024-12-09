import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { FaTrash } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { BiNotepad } from "react-icons/bi";
import QuizDeleteConfirmation from "./QuizDeleteConfirmation";

export default function QuizControlButtons(
    {quizId, deleteQuiz} : 
    { 
        quizId: string, 
        deleteQuiz: (quizId: string) => void; 
    }
) {
    const modalId = `wd-delete-assignment-dialog-${quizId}`;
    return (
        <div>
            <div className="float-end">
                <GreenCheckmark />
                <IoEllipsisVertical className="fs-3" />
                <FaTrash className="text-danger me-2 mb-1" type="button" data-bs-toggle="modal" data-bs-target={`#${modalId}`}/>
            </div>

            <div className="float-start">
                <BsGripVertical className="fs-3"/>
                <BiNotepad style={{color: "lightgreen"}} className="fs-3"/>
            </div>
            <QuizDeleteConfirmation dialogTitle="Delete Quiz" quizId={quizId} deleteQuiz={deleteQuiz} modalId={modalId}/>
        </div>
    );
}