// TaskCard component - Display individual task
import '../styles/TaskCard.css';

export default function TaskCard({ task, onSubmit, isSubmitted }) {
  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        {isSubmitted && <span className="submitted-badge">✓ Submitted</span>}
      </div>
      <p className="task-description">{task.description}</p>
      <div className="task-footer">
        <small className="task-date">
          Created: {new Date(task.created_at).toLocaleDateString()}
        </small>
        {!isSubmitted && (
          <button className="submit-btn" onClick={() => onSubmit(task.id)}>
            Submit Answer
          </button>
        )}
      </div>
    </div>
  );
}
