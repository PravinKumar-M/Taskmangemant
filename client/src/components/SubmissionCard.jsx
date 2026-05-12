// SubmissionCard component - Display student submission with feedback
import '../styles/SubmissionCard.css';

export default function SubmissionCard({ submission, onGradeClick }) {
  return (
    <div className="submission-card">
      <div className="submission-header">
        <div>
          <h4 className="submission-title">{submission.task_title}</h4>
          <p className="student-info">
            Student: {submission.student_name} ({submission.student_email})
          </p>
        </div>
        {submission.marks !== null && (
          <span className="marks-badge">{submission.marks}/100</span>
        )}
      </div>

      <div className="submission-content">
        <div className="submission-answer">
          <strong>Answer:</strong>
          <p>{submission.answer}</p>
        </div>

        {submission.feedback && (
          <div className="submission-feedback">
            <strong>Feedback:</strong>
            <p>{submission.feedback}</p>
          </div>
        )}
      </div>

      {submission.marks === null && (
        <button className="grade-btn" onClick={() => onGradeClick(submission)}>
          Grade Submission
        </button>
      )}
    </div>
  );
}
