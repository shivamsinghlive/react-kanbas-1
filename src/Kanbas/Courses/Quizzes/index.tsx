import { BsGripVertical } from "react-icons/bs";
import { RiArrowDropDownFill } from "react-icons/ri";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import QuizControlButtons from "./QuizControlButtons";
import { useNavigate, useParams } from "react-router";
import QuizControls from "./QuizControls";
import * as quizzesClient from "./client";
import { useDispatch, useSelector } from "react-redux";
import { setQuizzes, deleteQuiz, addQuiz } from "./reducer";

export default function Quizzes() {
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })} at ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  }

  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const { cid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    const quizzes = await quizzesClient.getQuizzesForCourse(cid as string);
    dispatch(setQuizzes(quizzes));
  };
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const createQuizForCourse = async () => {
    if (!cid) return;
    const newQuiz = {
      title: quizName,
      courseId: cid,
      description: description,
      points: points,
      dueDate: dueDate,
      availabilityDate: availabilityDate,
      quizType: quizType,
      timeLimit: timeLimit,
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
    };
    const quiz = await quizzesClient.createQuiz(cid, newQuiz);
    dispatch(addQuiz(quiz));
  };

  const removeQuiz = async (quizId: string) => {
    await quizzesClient.deleteQuiz(quizId);
    dispatch(deleteQuiz(quizId));
  };

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

  return (
    <div id="wd-quizzes" style={{ marginLeft: "20px", marginRight: "20px" }}>
      {currentUser.role === "FACULTY" ? (
        <QuizControls
          quizName={quizName}
          setQuizName={setQuizName}
          points={points}
          setPoints={setPoints}
          description={description}
          setDescription={setDescription}
          dueDate={dueDate}
          setDueDate={setDueDate}
          availabilityDate={availabilityDate}
          setAvailabilityDate={setAvailabilityDate}
          quizType={quizType}
          setQuizType={setQuizType}
          timeLimit={timeLimit}
          setTimeLimit={setTimeLimit}
          assignmentGroup={assignmentGroup}
          setAssignmentGroup={setAssignmentGroup}
          shuffleForEachStudent={shuffleForEachStudent}
          setShuffleForEachStudent={setShuffleForEachStudent}
          allowMultipleAttempts={allowMultipleAttempts}
          setAllowMultipleAttempts={setAllowMultipleAttempts}
          isPublished={isPublished}
          setIsPublished={setIsPublished}
          viewResponse={viewResponse}
          setViewResponse={setViewResponse}
          showCorrectAnswers={showCorrectAnswers}
          setShowCorrectAnswers={setShowCorrectAnswers}
          accessCode={accessCode}
          setAccessCode={setAccessCode}
          singleQuestionAtATime={singleQuestionAtATime}
          setSingleQuestionAtATime={setSingleQuestionAtATime}
          cameraRequired={cameraRequired}
          setCameraRequired={setCameraRequired}
          lockQuestionsAfterAnswering={lockQuestionsAfterAnswering}
          setLockQuestionsAfterAnswering={setLockQuestionsAfterAnswering}
          addQuiz={createQuizForCourse}
        />
      ) : (
        ""
      )}

      <br />
      <br />
      <br />
      <ul id="wd-quiz-title" className="list-group rounded-0">
        <li className="wd-quiz-title list-group-item p-0 mb-5 fs-5 border-gray">
          <div className="wd-quiz-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-1 fs-3" />
            <RiArrowDropDownFill className="me-2 fs-1" type="button" />
            QUIZZES
            <IoEllipsisVertical className="float-end fs-3" />
            <FaPlus className="float-end" type="button" />
          </div>
          <ul className="wd-quiz-list list-group rounded-0">
            {quizzes.map((quiz: any) => (
              <li className="wd-quiz-list-item list-group-item p-3 ps-1 wd-lesson">
                {currentUser.role === "FACULTY" ? (
                  <QuizControlButtons
                    quizId={quiz._id}
                    deleteQuiz={(quizId) => removeQuiz(quizId)}
                  />
                ) : (
                  ""
                )}{" "}
                <div style={{ marginLeft: "75px" }}>
                  {currentUser.role === "FACULTY" ? (
                    <a
                      className="wd-quiz-link text-black"
                      style={{ textDecoration: "none" }}
                      onClick={() =>
                        navigate(`/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`)
                      }
                    >
                      <strong>{quiz.title}</strong>
                    </a>
                  ) : (
                    <a
                      className="wd-quiz-link text-black"
                      style={{ textDecoration: "none" }}
                      onClick={() =>
                        navigate(
                          `/Kanbas/Courses/${cid}/QuizAttempt/${quiz._id}`
                        )
                      }
                    >
                      <strong>{quiz.title}</strong>
                    </a>
                  )}

                  <br />
                  <span>
                    <a
                      className="wd-quiz-list-link text-danger"
                      href="https://www.google.com"
                      style={{ textDecoration: "none" }}
                    >
                      Multiple Modules
                    </a>{" "}
                    | <strong>Not available until</strong>{" "}
                    {formatDate(quiz.availabilityDate)} |{" "}
                  </span>
                  <br />
                  <span>
                    <strong>Due</strong> {formatDate(quiz.dueDate)} |
                    {" Total Points - "}
                    {quiz.points} pts{" "}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}
