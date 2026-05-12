// Student Dashboard - Main page for student
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import { taskAPI, submissionAPI } from '../services/api';
import '../styles/Dashboard.css';

export default function StudentDashboard() {
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [answer, setAnswer] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, submissionsRes] = await Promise.all([
        taskAPI.getAllTasks(),
        submissionAPI.getStudentSubmissions()
      ]);

      setTasks(tasksRes.data.tasks || []);
      setSubmissions(submissionsRes.data.submissions || []);
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (taskId) => {
    setSelectedTaskId(taskId);
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      alert('Please enter an answer');
      return;
    }

    setSubmitLoading(true);
    try {
      await submissionAPI.submitTask({
        task_id: selectedTaskId,
        answer
      });
      setAnswer('');
      setSelectedTaskId(null);
      fetchData();
      alert('Task submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit task');
    } finally {
      setSubmitLoading(false);
    }
  };

  const submittedTaskIds = new Set(submissions.map(s => s.task_id));
  const availableTasks = tasks.filter(t => !submittedTaskIds.has(t.id));

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>📋 My Tasks</h2>
          <p>Manage and submit your tasks</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available Tasks ({availableTasks.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'submitted' ? 'active' : ''}`}
            onClick={() => setActiveTab('submitted')}
          >
            Submitted Tasks ({submissions.length})
          </button>
        </div>

        {activeTab === 'available' && (
          <div className="tasks-grid">
            {availableTasks.length === 0 ? (
              <p className="no-data">No available tasks at the moment</p>
            ) : (
              availableTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onSubmit={handleSubmit}
                  isSubmitted={false}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'submitted' && (
          <div className="submissions-list">
            {submissions.length === 0 ? (
              <p className="no-data">No submitted tasks yet</p>
            ) : (
              submissions.map(submission => (
                <div key={submission.id} className="submission-item">
                  <h4>{submission.task_title}</h4>
                  <p className="submission-answer">
                    <strong>Your Answer:</strong> {submission.answer}
                  </p>
                  {submission.marks !== null ? (
                    <div className="submission-feedback">
                      <div className="marks-info">
                        <strong>Marks:</strong> {submission.marks}/100
                      </div>
                      <div className="feedback-info">
                        <strong>Feedback:</strong> {submission.feedback}
                      </div>
                    </div>
                  ) : (
                    <p className="pending-badge">Pending Review</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {selectedTaskId && (
          <div className="modal-overlay" onClick={() => setSelectedTaskId(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Submit Your Answer</h3>
              <form onSubmit={handleSubmitAnswer}>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter your answer here..."
                  rows="8"
                  required
                />
                <div className="modal-buttons">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setSelectedTaskId(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn" disabled={submitLoading}>
                    {submitLoading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
