import { useParams } from "react-router";
import * as quizzesClient from "./client";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function QuizAttempt() {
  const { qid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [latestAttempt, setLatestAttempt] = useState<any>({});
  const [currentQuiz, setCurrentQuiz] = useState<any>({});
  const [startAttempt, setStartAttempt] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState<any>({});
  // Add state for access code input
  const [enteredAccessCode, setEnteredAccessCode] = useState("");
  const [clickedAccessSubmit, setClickedAccessSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle access code input
  const handleAccessCodeSubmit = () => {
    if (enteredAccessCode === currentQuiz.accessCode) {
      setErrorMessage("");
      setClickedAccessSubmit(true);
      //   startQuiz(); // Proceed to start the quiz if the code matches
    } else {
      setErrorMessage("Incorrect access code. Please try again.");
    }
  };

  const getLatestAttempt = async () => {
    const response = await quizzesClient.getLatestAttempt(qid, currentUser._id);
    setLatestAttempt(response);

    // Update currentAttempt with latestAttempt if it exists
    if (response) {
      setCurrentAttempt(response);
    }
    return response;
  };

  const calculateScore = () => {
    let points = 0;

    // Ensure questions and answers are available
    const questions = currentQuiz?.questions || [];
    const answers = currentAttempt?.answers || [];

    if (answers.length === 0) {
      return points;
    }

    // Iterate through each answer provided by the user
    answers.forEach((answer: any) => {
      const question = questions?.find(
        (ques: any) => String(ques._id) === String(answer.questionId)
      );

      // If the question is not found, skip this answer
      if (!question) return;

      // Determine correctness and calculate points based on the question type
      switch (question.questionType) {
        case "Multiple Choice":
          // Check if the selected choice is correct
          if (
            answer.selectedChoices?.length === 1 &&
            answer.selectedChoices[0].isCorrect
          ) {
            points += question.points;
          }
          break;

        case "Multiple Select":
          // Check if all selected choices match the correct choices
          const correctChoices = question.choices.filter(
            (choice: any) => choice.isCorrect
          );
          const selectedCorrectChoices = answer.selectedChoices.filter(
            (choice: any) => choice.isCorrect && choice.isSelected
          );

          if (
            correctChoices.length === selectedCorrectChoices.length &&
            correctChoices.every((correctChoice: any) =>
              selectedCorrectChoices.some(
                (selected: any) => selected.text === correctChoice.text
              )
            )
          ) {
            points += question.points;
          }
          break;

        case "True/False":
          // Find the correct choice based on isCorrect
          const correctChoice = question.choices?.find(
            (choice: any) => choice.isCorrect
          );
          const correctAnswer = correctChoice
            ? correctChoice.text.toLowerCase() === "true"
            : null;

          // Compare the user's answer with the correct answer
          if (answer.trueFalseAnswer === correctAnswer) {
            points += question.points;
          }
          break;

        case "Fill in the Blanks":
          // Check if all blank answers are correct
          const correctBlanks = question.blanks.map(
            (blank: any) => blank.answer
          );
          const providedAnswers = answer.fillInAnswers.map((ans: any) =>
            ans.answer.trim()
          );

          if (
            correctBlanks.length === providedAnswers.length &&
            correctBlanks.every(
              (correct: any, index: any) =>
                correct.toLowerCase() === providedAnswers[index]?.toLowerCase()
            )
          ) {
            points += question.points;
          }
          break;

        default:
          console.warn(`Unknown question type: ${question.questionType}`);
      }
    });

    return points;
  };

  const getQuiz = async () => {
    const quiz = await quizzesClient.getQuizById(qid);
    setCurrentQuiz(quiz);
    return quiz;
  };

  const handleSubmitQuiz = async () => {
    if (latestAttempt) {
      alert("Quiz is already submitted! You can only view the last attempt.");
    } else {
      const points = calculateScore();
      const finishedAttempt = {
        ...currentAttempt,
        completedAt: new Date().toISOString(),
        score: points,
      };
      await quizzesClient.submitQuiz(finishedAttempt);
      getLatestAttempt();
    }
  };

  const startQuiz = () => {
    getLatestAttempt();
    if (latestAttempt) {
      alert("Quiz is already submitted! You can only view the last attempt.");
    } else {
      setStartAttempt(true);
      setCurrentAttempt({
        quizId: qid,
        studentId: currentUser._id,
        attemptNumber: 1,
        startedAt: Date.now(),
        answers: [],
      });
    }
  };

  const handleAnswerChange = (questionId: any, answer: any) => {
    setCurrentAttempt((prevAttempt: any) => {
      const existingAnswerIndex = prevAttempt.answers?.findIndex(
        (ques: any) => ques.questionId === questionId
      );

      let updatedAnswers;
      if (existingAnswerIndex !== -1) {
        updatedAnswers = [...prevAttempt.answers];
        updatedAnswers[existingAnswerIndex] = {
          ...updatedAnswers[existingAnswerIndex],
          ...answer,
        };
      } else {
        updatedAnswers = [...prevAttempt.answers, { questionId, ...answer }];
      }

      return {
        ...prevAttempt,
        answers: updatedAnswers,
      };
    });
  };

  useEffect(() => {
    getQuiz();
    getLatestAttempt();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card p-4">
        <h3 className="card-title">Quiz Details</h3>
        <div className="mb-3">
          <strong>Title:</strong> {currentQuiz.title}
        </div>
        <div className="mb-3">
          <strong>Description:</strong> {currentQuiz.description}
        </div>
        <div className="mb-3">
          <strong>Total Points:</strong> {currentQuiz.points}
        </div>
        <div className="mb-3">
          <strong>Due Date:</strong> {currentQuiz.dueDate}
        </div>
        <div className="mb-3">
          <strong>Available Date:</strong> {currentQuiz.availabilityDate}
        </div>
        <div className="mb-3">
          <strong>Time Limit:</strong> {currentQuiz.timeLimit} minutes
        </div>
      </div>

      <div className="card mt-4 p-4">
        <h4 className="card-title">Quiz Status</h4>
        <div className="mb-3">
          <strong>Points Scored:</strong>{" "}
          {latestAttempt ? latestAttempt.score : "Not Submitted"}
        </div>
        <div className="mb-3">
          <strong>Submitted On:</strong>{" "}
          {latestAttempt ? latestAttempt.completedAt : "Not Submitted"}
        </div>
      </div>

      {/* Access Code Section */}
      {currentQuiz.accessCode && !latestAttempt && (
        <div className="card mt-4 p-4">
          <h4 className="card-title">Enter Access Code</h4>
          <div className="form-group">
            <input
              type="text"
              className="form-control mb-3"
              value={enteredAccessCode}
              onChange={(e) => setEnteredAccessCode(e.target.value)}
              placeholder="Enter access code"
            />
            <button
              className="btn btn-primary"
              onClick={handleAccessCodeSubmit}
            >
              Submit
            </button>
            {errorMessage && (
              <div className="text-danger mt-2">{errorMessage}</div>
            )}
          </div>
        </div>
      )}

      {/* Start Quiz Button */}
      {!currentQuiz.accessCode || clickedAccessSubmit ? (
        <div className="text-center mt-4">
          <button
            className="btn btn-success"
            onClick={startQuiz}
            disabled={!!latestAttempt}
          >
            Start Quiz
          </button>
        </div>
      ) : null}

      {/* Questions Section */}
      {(latestAttempt || startAttempt) && currentQuiz.questions && (
        <div className="card mt-4 p-4">
          <h4 className="card-title">Questions</h4>
          {currentQuiz.questions.map((question: any, index: number) => (
            <div key={index} className="mb-4">
              <p>
                <strong>
                  {index + 1}. {question.questionText}
                </strong>
              </p>

              {/* Multiple Choice */}
              {question.questionType === "Multiple Choice" &&
                question.choices.map((choice: any, idx: number) => (
                  <div key={idx} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question-${index}`}
                      value={choice.text}
                      checked={
                        (currentAttempt.answers &&
                          currentAttempt.answers
                            .find((ans: any) => ans.questionId === question._id)
                            ?.selectedChoices.find(
                              (opt: any) => opt.text === choice.text
                            )?.isSelected) ||
                        false
                      }
                      onChange={() => {
                        if (!latestAttempt) {
                          handleAnswerChange(question._id, {
                            answerType: "Multiple Choice",
                            selectedChoices: [{ ...choice, isSelected: true }],
                          });
                        }
                      }}
                      disabled={!!latestAttempt}
                    />
                    <label className="form-check-label">{choice.text}</label>
                  </div>
                ))}

              {/* Correct Answer for Multiple Choice */}
              {latestAttempt && question.questionType === "Multiple Choice" && (
                <div className="mt-2 text-success">
                  <strong>Correct Answer:</strong>{" "}
                  {question.choices
                    ?.filter((choice: any) => choice.isCorrect)
                    .map((choice: any, idx: number) => (
                      <span key={idx}>{choice.text}, </span>
                    ))}
                </div>
              )}

              {/* True/False */}
              {question.questionType === "True/False" && (
                <div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question-${index}`}
                      value="true"
                      checked={
                        currentAttempt.answers?.find(
                          (ans: any) => ans.questionId === question._id
                        )?.trueFalseAnswer === true
                      }
                      onChange={() => {
                        if (!latestAttempt) {
                          handleAnswerChange(question._id, {
                            answerType: "True/False",
                            trueFalseAnswer: true,
                          });
                        }
                      }}
                      disabled={!!latestAttempt}
                    />
                    <label className="form-check-label">True</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question-${index}`}
                      value="false"
                      checked={
                        currentAttempt.answers?.find(
                          (ans: any) => ans.questionId === question._id
                        )?.trueFalseAnswer === false
                      }
                      onChange={() => {
                        if (!latestAttempt) {
                          handleAnswerChange(question._id, {
                            answerType: "True/False",
                            trueFalseAnswer: false,
                          });
                        }
                      }}
                      disabled={!!latestAttempt}
                    />
                    <label className="form-check-label">False</label>
                  </div>
                </div>
              )}

              {/* Correct Answer for True/False */}
              {latestAttempt && question.questionType === "True/False" && (
                <div className="mt-2 text-success">
                  <strong>Correct Answer:</strong>{" "}
                  {question.choices
                    ?.filter((choice: any) => choice.isCorrect)
                    .map((choice: any) => (
                      <>{choice.text},</>
                    ))}
                </div>
              )}

              {/* Fill in the Blanks */}
              {question.questionType === "Fill in the Blanks" && (
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your answer"
                  value={
                    currentAttempt.answers?.find(
                      (ans: any) => ans.questionId === question._id
                    )?.fillInAnswers?.[0]?.answer || ""
                  }
                  onChange={(e) => {
                    if (!latestAttempt) {
                      handleAnswerChange(question._id, {
                        answerType: "Fill in the Blanks",
                        fillInAnswers: [{ answer: e.target.value }],
                      });
                    }
                  }}
                  disabled={!!latestAttempt}
                />
              )}

              {/* Correct Answer for Fill in the Blanks */}
              {latestAttempt &&
                question.questionType === "Fill in the Blanks" && (
                  <div className="mt-2 text-success">
                    <strong>Correct Answer:</strong>{" "}
                    {question.blanks.map((a: any) => (
                      <>{a.answer},</>
                    ))}
                  </div>
                )}

              {/* Multiple Select */}
              {question.questionType === "Multiple Select" &&
                question.choices.map((choice: any, idx: number) => (
                  <div key={idx} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name={`question-${index}`}
                      value={choice.text}
                      checked={
                        (currentAttempt &&
                          currentAttempt.answers &&
                          currentAttempt.answers
                            .find((ans: any) => ans.questionId === question._id)
                            ?.selectedChoices.find(
                              (opt: any) => opt.text === choice.text
                            )?.isSelected) ||
                        false
                      }
                      onChange={(e) => {
                        if (!latestAttempt) {
                          const isSelected = e.target.checked;

                          const currentSelectedChoices =
                            currentAttempt.answers?.find(
                              (ans: any) => ans.questionId === question._id
                            )?.selectedChoices || [];

                          const updatedSelectedChoices =
                            currentSelectedChoices.map((opt: any) =>
                              opt.text === choice.text
                                ? { ...opt, isSelected }
                                : opt
                            );

                          if (
                            !updatedSelectedChoices?.find(
                              (opt: any) => opt.text === choice.text
                            )
                          ) {
                            updatedSelectedChoices.push({
                              ...choice,
                              isSelected,
                            });
                          }

                          handleAnswerChange(question._id, {
                            answerType: "Multiple Select",
                            selectedChoices: updatedSelectedChoices,
                          });
                        }
                      }}
                      disabled={!!latestAttempt}
                    />
                    <label className="form-check-label">{choice.text}</label>
                  </div>
                ))}

              {/* Correct Answer for Multiple Select */}
              {latestAttempt && question.questionType === "Multiple Select" && (
                <div className="mt-2 text-success">
                  <strong>Correct Answer(s):</strong>{" "}
                  {question.choices
                    ?.filter((choice: any) => choice.isCorrect)
                    .map((choice: any, idx: number) => (
                      <span key={idx}>{choice.text}, </span>
                    ))}
                </div>
              )}

              <hr />
            </div>
          ))}
          <div className="text-center">
            <button
              className="btn btn-primary"
              onClick={handleSubmitQuiz}
              disabled={!!latestAttempt}
            >
              Submit Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
