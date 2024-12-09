import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";

export default function QuestionCreator(
    {onAdd, onClose, dialogTitle}:
    {onAdd: (newQuestion: any) => void;
    onClose: () => void;
    dialogTitle: string
    }) 
    {
    const [newQuestion, setNewQuestion] = useState({
        questionType: "Multiple Choice",
        questionText: "",
        points: "10",
        choices: [{ text: "", isCorrect: false }],
        blanks: [{ answer: "" }]
    });

    const addOption = () => {
        setNewQuestion({...newQuestion, choices: [...newQuestion.choices, {text: "", isCorrect: false}]});
    };

    const handleSubmit = () => {
        onAdd(newQuestion);
        onClose();
    };

    return (
        <div id="wd-add-question-dialog" className="modal fade show" data-bs-backdrop="static" style={{ display: "block" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{dialogTitle}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        <h5>Create Question</h5>

                        <label className="form-label">Points</label>
                        <input
                            type="text"
                            value={newQuestion.points}
                            className="form-control mb-3 w-25"
                            onChange={(e) => setNewQuestion({ ...newQuestion, points: e.target.value })}/>

                        
                        <label htmlFor="quiz-question-type" className="form-label">Question Type</label>
                        <select className="form-select mb-3 w-25" id="wd-question-type"
                            value={newQuestion.questionType} 
                            onChange={(e) => setNewQuestion({...newQuestion, questionType: e.target.value})}>
                                <option disabled>Select an Option</option>
                                <option value="Multiple Choice">Multiple Choice</option>
                                <option value="Multiple Select">Multiple Select</option>
                                <option value="True/False">True/False</option>
                                <option value="Fill in the Blanks">Fill in the Blanks</option>
                        </select>

                        <label className="form-label">Question Text</label>
                        <input
                            type="text"
                            value={newQuestion.questionText}
                            className="form-control mb-3"
                            onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}/>
                        {newQuestion.questionType === "Multiple Choice" || newQuestion.questionType === "Multiple Select" ? (
                            <div>
                                <label className="form-label">Options</label>
                                {
                                    newQuestion.choices.map((option: any, index: any) => (
                                        <div key={index} className="d-flex align-items-center mb-2">
                                            <input type="text" className="form-control me-2 w-50" placeholder={`Option ${index + 1}`}
                                                onChange={(e) => {
                                                    const updatedOptions = [...newQuestion.choices];
                                                    updatedOptions[index].text = e.target.value;
                                                    setNewQuestion({ ...newQuestion, choices: updatedOptions });
                                                }}/>

                                            <input type="checkbox" checked={option.isCorrect} className="form-check-input me-2"
                                                id={`correct-answer-${index}`}
                                                style={{border: "1px solid black"}}
                                                onChange={(e) => {
                                                    const updatedOptions = [...newQuestion.choices];
                                                    updatedOptions[index].isCorrect = e.target.checked;
                                                    setNewQuestion({ ...newQuestion, choices: updatedOptions });
                                                }}/>
                                            <label htmlFor={`correct-answer-${index}`} className="me-3">Correct Answer</label>
                                            <FaTrash type="button" onClick={() => {
                                                const updatedOptions = [...newQuestion.choices];
                                                updatedOptions.splice(index, 1);
                                                setNewQuestion({ ...newQuestion, choices: updatedOptions });
                                            }}/>
                                        </div>
                                    ))
                                }
                                <button className="btn btn-primary btn-sm" onClick={addOption}>
                                    Add Option
                                </button>
                            </div>        
                        ): newQuestion.questionType === "Fill in the Blanks" ? (
                            <div>
                                <label className="form-label">Answer</label>
                                <input type="text" value={newQuestion.blanks[0].answer} className="form-control mb-3"
                                    onChange={(e) => {
                                        const updatedBlanks = [...newQuestion.blanks];
                                        updatedBlanks[0].answer = e.target.value;
                                        setNewQuestion({ ...newQuestion, blanks: updatedBlanks });
                                    }}/>
                            </div>
                        ): newQuestion.questionType === "True/False" ? (
                            <div className="mb-3">
                                    <label className="form-label">Answer</label>
                                    <div>
                                        {/* True Option */}
                                        <div className="d-flex align-items-center mb-2">
                                        <input
                                            type="checkbox"
                                            id="true-option"
                                            className="form-check-input me-2"
                                            checked={newQuestion.choices[0]?.isCorrect}
                                            onChange={(e) => {
                                            const updatedChoices = [
                                                { text: "True", isCorrect: e.target.checked },
                                                { text: "False", isCorrect: !e.target.checked },
                                            ];
                                            setNewQuestion({ ...newQuestion, choices: updatedChoices });
                                            }}
                                        />
                                        <label htmlFor="true-option" className="form-label me-3">
                                            True
                                        </label>
                                        </div>

                                        {/* False Option */}
                                        <div className="d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            id="false-option"
                                            className="form-check-input me-2"
                                            checked={newQuestion.choices[1]?.isCorrect}
                                            onChange={(e) => {
                                            const updatedChoices = [
                                                { text: "True", isCorrect: !e.target.checked },
                                                { text: "False", isCorrect: e.target.checked },
                                            ];
                                            setNewQuestion({ ...newQuestion, choices: updatedChoices });
                                            }}
                                        />
                                        <label htmlFor="false-option" className="form-label me-3">
                                            False
                                        </label>
                                        </div>
                                    </div>
                                </div>
                        ): null}
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                            Add Question
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
