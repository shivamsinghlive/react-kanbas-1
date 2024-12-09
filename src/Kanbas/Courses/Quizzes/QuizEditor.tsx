import { RiArrowDropDownFill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { updateQuiz } from "./reducer";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import * as quizzesClient from "./client";
import QuestionCreator from "./QuestionCreator";
import { FaTrash } from "react-icons/fa";
export default function QuizEditor() {

    const { cid, qid } = useParams();
    const fetchQuizDetails = async (quizId: string) => {

        const quiz = await quizzesClient.getQuizById(quizId);
        console.log(quiz);
        const processedQuestions = quiz?.questions.map((q: any) => ({
            ...q,
            choices: q.choices || [], 
            blanks: q.blanks || [], 
        })) || [];
        setQuestions(processedQuestions);
        setQuizName(quiz.title);
        setPoints(quiz.points);
        setDescription(quiz.description);
        setDueDate(quiz.dueDate);
        setAvailabilityDate(quiz.availabilityDate);
        setQuizType(quiz.quizType);
        setTimeLimit(quiz.timeLimit);
        setAssignmentGroup(quiz.assignmentGroup);
        setShuffleForEachStudent(quiz.shuffleForEachStudent);
        setAllowMultipleAttempts(quiz.allowMultipleAttempts);
        setIsPublished(quiz.isPublished);
        setViewResponse(quiz.viewResponse);
        setShowCorrectAnswers(quiz.showCorrectAnswers);
        setAccessCode(quiz.accessCode);
        setSingleQuestionAtATime(quiz.singleQuestionAtATime);
        setCameraRequired(quiz.cameraRequired);
        setLockQuestionsAfterAnswering(quiz.lockQuestionsAfterAnswering);
        setLoading(false);
    };

  useEffect(() => {
    const loadQuiz = async () => {
      if (qid) {
        fetchQuizDetails(qid);
      }
    };
    loadQuiz();
  }, [qid]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [quizName, setQuizName] = useState("");
  const [points, setPoints] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [quizType, setQuizType] = useState("Graded Quiz");
  const [timeLimit, setTimeLimit] = useState("");
  const [assignmentGroup, setAssignmentGroup] = useState("Quizzes");
  const [shuffleForEachStudent, setShuffleForEachStudent] = useState(false);
  const [allowMultipleAttempts, setAllowMultipleAttempts] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [viewResponse, setViewResponse] = useState("Always");
  const [showCorrectAnswers, setShowCorrectAnswers] = useState("Immediately");
  const [accessCode, setAccessCode] = useState("");
  const [singleQuestionAtATime, setSingleQuestionAtATime] = useState(false);
  const [cameraRequired, setCameraRequired] = useState(false);
  const [lockQuestionsAfterAnswering, setLockQuestionsAfterAnswering] =
    useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [createQuestion, setCreateQuestion] = useState(false);

  const saveQuiz = async (quiz: any) => {
    await quizzesClient.updateQuiz(quiz);
    dispatch(updateQuiz(quiz));
  };
  if (loading) {
    return <div>Quiz not found</div>;
  }

  const calculateTotalPoints = () => {
    return questions.reduce(
      (sum, question) => sum + (Number(question.points) || 0),
      0
    );
  };

  return (
    <div id="wd-quizzes-editor" style={{ marginLeft: "2%", marginRight: "2%" }}>
      <label htmlFor="wd-name">Quiz Name</label>
      <br />
      <input
        id="wd-name"
        value={quizName}
        className="form-control mb-2"
        onChange={(e) => setQuizName(e.target.value)}
      />
      <br />
      <textarea
        id="wd-description"
        rows={10}
        cols={50}
        className="form-control mb-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <br />
      <br />
      <hr />

      {/*Questions*/}
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Questions</h3>
          <button
            className="btn btn-primary"
            onClick={() => setCreateQuestion(true)}
          >
            Add Question
          </button>
        </div>

        {/* Render AddQuestion Component */}
        {createQuestion && (
          <QuestionCreator
            dialogTitle="Add New Question"
            onAdd={(newQuestion) => {
              const updatedQuestions = [...questions, newQuestion];
              setQuestions(updatedQuestions);
            }}
            onClose={() => setCreateQuestion(false)}
          />
        )}

        {/* Render Existing Questions */}
        {questions.map((question, index) => (
          <div key={index} className="mb-3">
            {/* Question Points */}
            <label htmlFor={`question-${index}`} className="form-label">
              Question {index + 1} Points
            </label>
            <input
              id={`question-${index}`}
              className="form-control mb-3 w-25"
              value={question.points}
              onChange={(e) => {
                const updatedQuestions = [...questions];
                updatedQuestions[index].points = e.target.value;
                setQuestions(updatedQuestions);
              }}
            />

            {/* Question Type */}
            <label htmlFor={`questionType-${index}`} className="form-label">
              Question Type
            </label>
            <select
              id={`questionType-${index}`}
              className="form-select form-select-sm w-25"
              value={question.questionType}
              onChange={(e) => {
                const updatedQuestions = [...questions];
                updatedQuestions[index].questionType = e.target.value;
                setQuestions(updatedQuestions);
              }}
            >
              <option value="Multiple Choice">Multiple Choice</option>
              <option value="Multiple Select">Multiple Select</option>
              <option value="True/False">True/False</option>
              <option value="Fill in the Blanks">Fill in the Blanks</option>
            </select>
            <br />

            {/* Question Text */}
            <label htmlFor={`question-${index}`} className="form-label">
              Question {index + 1}
            </label>
            <FaTrash className="float-end me-2" type="button" onClick={() => {
                const updatedQuestions = questions.filter((_, i) => i !==index );
                setQuestions(updatedQuestions)
                setPoints(calculateTotalPoints());
            }}/>
            <input
              id={`question-${index}`}
              className="form-control mb-3"
              value={question.questionText}
              onChange={(e) => {
                const updatedQuestions = [...questions];
                updatedQuestions[index].questionText = e.target.value;
                setQuestions(updatedQuestions);
              }}
            />

                        {/* Display Answers */}
                        <div className="mt-2">
                            <label className="form-label">Answers</label>
                            {question.questionType === "Multiple Choice" || question.questionType === "Multiple Select" ? (
                                <ul>
                                    {question.choices && question.choices.length > 0 ? (
                                        question.choices.map((choice: any, choiceIndex: number) => (
                                            <li key={choiceIndex}>
                                                <input type="text" className="form-control d-inline-block me-2"
                                                    value={choice.text || ""} style={{ width: "80%" }}
                                                    onChange={(e) => {
                                                        const updatedQuestions = [...questions];
                                                        updatedQuestions[index].choices[choiceIndex].text = e.target.value;
                                                        setQuestions(updatedQuestions);
                                                    }}/>
                                                <input type="checkbox" checked={choice.isCorrect || false}
                                                    className="form-check-input mt-2" style={{ border: "1px solid black" }}
                                                    onChange={(e) => {
                                                        const updatedQuestions = [...questions];
                                                        updatedQuestions[index].choices[choiceIndex].isCorrect = e.target.checked;
                                                        setQuestions(updatedQuestions);
                                                    }}/>
                                                <span className="ms-2">Correct</span>
                                                <FaTrash className="mt-2 float-end"
                                                    onClick={() => {
                                                        const updatedQuestions = [...questions];
                                                        updatedQuestions[index].choices.splice(choiceIndex, 1);
                                                        setQuestions(updatedQuestions);
                                                    }}/>
                                            </li>
                                        ))
                                    ) : (
                                        <li>No choices available</li>
                                    )}

                                    <li>
                                        <button
                                            className="btn btn-primary btn-sm mt-2 mb-2"
                                            onClick={() => {
                                                const updatedQuestions = [...questions];
                                                updatedQuestions[index].choices.push({ text: "", isCorrect: false });
                                                setQuestions(updatedQuestions);
                                            }}>
                                            Add Option
                                        </button>
                                    </li>
                                </ul>
                            ) : question.questionType === "Fill in the Blanks" ? (
                                question.blanks && question.blanks.length > 0 ? (
                                    question.blanks.map((blank: any, blankIndex: number) => (
                                        <input key={blankIndex} type="text" className="form-control mb-2"
                                            value={blank.answer || ""}
                                            onChange={(e) => {
                                                const updatedQuestions = [...questions];
                                                updatedQuestions[index].blanks[blankIndex].answer = e.target.value;
                                                setQuestions(updatedQuestions);
                                            }}/>
                                    ))
                                ) : (
                                    <button className="btn btn-primary btn-sm"
                                        onClick={() => {
                                            const updatedQuestions = [...questions];
                                            updatedQuestions[index].blanks = [{ answer: "" }];
                                            setQuestions(updatedQuestions);
                                        }}>
                                            Add Blank
                                    </button>
                                )
                            ) : question.questionType === "True/False" ? (
                                <div>
                                    {/* True Option */}
                                    <div className="d-flex align-items-center mb-2">
                                        <input
                                        type="checkbox"
                                        id={`true-option-${index}`}
                                        className="form-check-input me-2"
                                        checked={question.choices[0]?.isCorrect}
                                        onChange={(e) => {
                                            const updatedQuestions = [...questions];
                                            updatedQuestions[index].choices = [
                                            { text: "True", isCorrect: e.target.checked },
                                            { text: "False", isCorrect: !e.target.checked },
                                            ];
                                            setQuestions(updatedQuestions);
                                        }}
                                        />
                                        <label htmlFor={`true-option-${index}`} className="form-label me-3">
                                        True
                                        </label>
                                    </div>

                                    {/* False Option */}
                                    <div className="d-flex align-items-center">
                                        <input
                                        type="checkbox"
                                        id={`false-option-${index}`}
                                        className="form-check-input me-2"
                                        checked={question.choices[1]?.isCorrect}
                                        onChange={(e) => {
                                            const updatedQuestions = [...questions];
                                            updatedQuestions[index].choices = [
                                            { text: "True", isCorrect: !e.target.checked },
                                            { text: "False", isCorrect: e.target.checked },
                                            ];
                                            setQuestions(updatedQuestions);
                                        }}
                                        />
                                        <label htmlFor={`false-option-${index}`} className="form-label me-3">
                                        False
                                        </label>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                ))}

            </div>




      <br />
      <br />
      <hr />

      <div>
        {/* Points */}
        <div className="d-flex">
          <div className="w-50 pe-5">
            <label
              htmlFor="wd-points"
              className="float-end"
              style={{ marginTop: "5px" }}
            >
              Points
            </label>
          </div>
          <div className="w-50 pe-3">
            <input
              id="wd-points"
              value={calculateTotalPoints()}
              className="form-control mb-2"
              readOnly
              onChange={(e) => setPoints(e.target.value)}
            />
          </div>
        </div>
        <br />

        {/* Quiz Type */}
        <div className="d-flex">
          <div className="w-50 pe-5">
            <label
              htmlFor="wd-quiz-type"
              className="float-end"
              style={{ marginTop: "5px" }}
            >
              Quiz Type
            </label>
          </div>
          <div className="w-50 pe-3" style={{ position: "relative" }}>
            <select
              name="quiz-type"
              id="wd-quiz-type"
              className="form-control mb-2"
              value={quizType}
              onChange={(e) => setQuizType(e.target.value)}
            >
              <option value="" disabled>
                Select Quiz Type
              </option>
              <option value="Graded Quiz">Graded Quiz</option>
              <option value="Ungraded Quiz">Ungraded Quiz</option>
            </select>
            <RiArrowDropDownFill
              className="fs-1"
              style={{
                position: "absolute",
                top: "1%",
                right: "3%",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
        <br />

        {/* Time Limit */}
        <div className="d-flex">
          <div className="w-50 pe-5">
            <label
              htmlFor="wd-time-limit"
              className="float-end"
              style={{ marginTop: "5px" }}
            >
              Time Limit
            </label>
          </div>
          <div className="w-50 pe-3">
            <input
              id="wd-time-limit"
              value={timeLimit}
              className="form-control mb-2"
              onChange={(e) => setTimeLimit(e.target.value)}
            />
          </div>
        </div>
        <br />

        {/* Assignment Group */}
        <div className="d-flex">
          <div className="w-50 pe-5">
            <label
              htmlFor="wd-assignment-group"
              className="float-end"
              style={{ marginTop: "5px" }}
            >
              Assignment Group
            </label>
          </div>
          <div className="w-50 pe-3" style={{ position: "relative" }}>
            <select
              name="assignment-group"
              id="wd-assignment-group"
              className="form-control mb-2"
              value={assignmentGroup}
              onChange={(e) => setAssignmentGroup(e.target.value)}
            >
              <option value="" disabled>
                Select Assignment Group
              </option>
              <option value="Quizzes">Quiz</option>
              <option value="Exams">Exam</option>
              <option value="Assignments">Assignment</option>
              <option value="Projects">Project</option>
            </select>
            <RiArrowDropDownFill
              className="fs-1"
              style={{
                position: "absolute",
                top: "1%",
                right: "3%",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
        <br />

        {/* Shuffle For Each Student */}
        <div className="d-flex">
          <div className="w-50 pe-5">
            <label htmlFor="wd-shuffle-each-student" className="float-end">
              Shuffle For Each Student
            </label>
          </div>
          <div className="w-50 pe-3">
            <input
              type="checkbox"
              id="wd-shuffle-each-student"
              checked={shuffleForEachStudent}
              className="form-check-input mb-2"
              onChange={(e) => setShuffleForEachStudent(e.target.checked)}
              style={{ border: "1px solid black" }}
            />
          </div>
        </div>
        <br />

        {/* Multiple Attempts */}
        <div className="d-flex">
          <div className="w-50 pe-5">
            <label htmlFor="wd-allow-multiple-attempts" className="float-end">
              Multiple Attempts
            </label>
          </div>
          <div className="w-50 pe-3">
            <input
              type="checkbox"
              id="wd-allow-multiple-attempts"
              checked={allowMultipleAttempts}
              className="form-check-input mb-2"
              onChange={(e) => setAllowMultipleAttempts(e.target.checked)}
              style={{ border: "1px solid black" }}
            />
          </div>
        </div>
        <br />

        {/* Published */}
        <div className="d-flex">
          <div className="w-50 pe-5">
            <label htmlFor="wd-is-published" className="float-end">
              Published
            </label>
          </div>
          <div className="w-50 pe-3">
            <input
              type="checkbox"
              id="wd-is-published"
              checked={isPublished}
              className="form-check-input mb-2"
              onChange={(e) => setIsPublished(e.target.checked)}
              style={{ border: "1px solid black" }}
            />
          </div>
        </div>
        <br />

        {/* View Responses */}
        <div className="d-flex">
          <div className="w-50 pe-5">
            <label
              htmlFor="wd-view-responses"
              className="float-end"
              style={{ marginTop: "5px" }}
            >
              View Responses
            </label>
          </div>
          <div className="w-50 pe-3" style={{ position: "relative" }}>
            <select
              name="view-responses"
              id="wd-view-responses"
              className="form-control mb-2"
              value={viewResponse}
              onChange={(e) => setViewResponse(e.target.value)}
            >
              <option value="" disabled>
                Select Response View
              </option>
              <option value="Always">Always</option>
              <option value="Never">Never</option>
              <option value="Once">Once</option>
            </select>
            <RiArrowDropDownFill
              className="fs-1"
              style={{
                position: "absolute",
                top: "1%",
                right: "3%",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
        <br />

        {/* Show Correct Answers */}
        <div className="d-flex">
          <div className="w-50 pe-5">
            <label
              htmlFor="wd-show-correct-answers"
              className="float-end"
              style={{ marginTop: "5px" }}
            >
              Correct Answers
            </label>
          </div>
          <div className="w-50 pe-3" style={{ position: "relative" }}>
            <select
              name="show-correct-answers"
              id="wd-show-correct-answers"
              className="form-control mb-2"
              value={showCorrectAnswers}
              onChange={(e) => setShowCorrectAnswers(e.target.value)}
            >
              <option value="" disabled>
                Select Correct Answers Visibility
              </option>
              <option value="Immediately">Immediately</option>
              <option value="After all attempts are graded">
                After all attempts are graded
              </option>
              <option value="After due date">After due date</option>
            </select>
            <RiArrowDropDownFill
              className="fs-1"
              style={{
                position: "absolute",
                top: "1%",
                right: "3%",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
        <br />

        {/* Access Code */}
        <div className="d-flex">
          <div className="w-50 pe-5">
            <label
              htmlFor="wd-access-code"
              className="float-end"
              style={{ marginTop: "5px" }}
            >
              Access Code
            </label>
          </div>
          <div className="w-50 pe-3">
            <input
              id="wd-access-code"
              type="password"
              value={accessCode}
              className="form-control mb-2"
              onChange={(e) => setAccessCode(e.target.value)}
            />
          </div>
        </div>
        <br />

        {/* Single Question At A Time */}
        <div className="d-flex">
          <div className="w-50 pe-5">
            <label htmlFor="wd-single-question" className="float-end">
              Single Question At A Time
            </label>
          </div>
          <div className="w-50 pe-3">
            <input
              type="checkbox"
              id="wd-single-question"
              checked={singleQuestionAtATime}
              className="form-check-input mb-2"
              onChange={(e) => setSingleQuestionAtATime(e.target.checked)}
              style={{ border: "1px solid black" }}
            />
          </div>
        </div>
        <br />

        {/* Camera Required */}
        <div className="d-flex">
          <div className="w-50 pe-5">
            <label htmlFor="wd-camera-required" className="float-end">
              Camera Required
            </label>
          </div>
          <div className="w-50 pe-3">
            <input
              type="checkbox"
              id="wd-camera-required"
              checked={cameraRequired}
              className="form-check-input mb-2"
              onChange={(e) => setCameraRequired(e.target.checked)}
              style={{ border: "1px solid black" }}
            />
          </div>
        </div>
        <br />

        {/* Lock Question After Answering */}
        <div className="d-flex">
          <div className="w-50 pe-5">
            <label htmlFor="wd-lock-question" className="float-end">
              Lock Question on Answering
            </label>
          </div>
          <div className="w-50 pe-3">
            <input
              type="checkbox"
              id="wd-lock-question"
              checked={lockQuestionsAfterAnswering}
              className="form-check-input mb-2"
              onChange={(e) => setLockQuestionsAfterAnswering(e.target.checked)}
              style={{ border: "1px solid black" }}
            />
          </div>
        </div>
        <br />
      </div>

      <hr />

      <div className="pe-3">
        <button
          id="wd-quiz-save"
          className="btn btn-danger float-end"
          onClick={() => {
            saveQuiz({
              _id: qid,
              title: quizName,
              points: calculateTotalPoints(),
              dueDate: dueDate,
              availabilityDate: availabilityDate,
              questions: questions,
              quizType: quizType,
              assignmentGroup: assignmentGroup,
              shuffleForEachStudent: shuffleForEachStudent,
              allowMultipleAttempts: allowMultipleAttempts,
              isPublished: isPublished,
              viewResponse: viewResponse,
              showCorrectAnswers: showCorrectAnswers,
              accessCode: accessCode,
              singleQuestionAtATime: singleQuestionAtATime,
              cameraRequired: cameraRequired,
              lockQuestionsAfterAnswering: lockQuestionsAfterAnswering,
            });
            navigate(`/Kanbas/Courses/${cid}/Quizzes`);
          }}
        >
          Save
        </button>
        <button
          id="wd-quiz-cancel"
          className="btn btn-secondary float-end me-2"
        >
          <a
            href={`#/Kanbas/Courses/${cid}/Quizzes`}
            className="text-decoration-none text-black"
          >
            Cancel
          </a>
        </button>
      </div>
    </div>
  );
}
