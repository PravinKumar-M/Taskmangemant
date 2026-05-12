// Admin Dashboard - Main page for admin
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SubmissionCard from '../components/SubmissionCard';
import { taskAPI, submissionAPI } from '../services/api';
import '../styles/Dashboard.css';

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('create-task');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gradeLoading, setGradeLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, submissionsRes] = await Promise.all([
        taskAPI.getAllTasks(),
        submissionAPI.getAllSubmissions()
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

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill all fields');
      return;
    }

    setCreateLoading(true);
    try {
      await taskAPI.createTask({ title, description });
      setTitle('');
      setDescription('');
      fetchData();
      alert('Task created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    if (marks === '' || !feedback.trim()) {
      alert('Please enter marks and feedback');
      return;
    }

    setGradeLoading(true);
    try {
      await submissionAPI.updateSubmission(selectedSubmission.id, {
        marks: parseInt(marks),
        feedback
      });
      setSelectedSubmission(null);
      setMarks('');
      setFeedback('');
      fetchData();
      alert('Submission graded successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to grade submission');
    } finally {
      setGradeLoading(false);
    }
  };

  const pendingSubmissions = submissions.filter(s => s.marks === null);
  const gradedSubmissions = submissions.filter(s => s.marks !== null);

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setDeleteLoading(true);
    try {
      await taskAPI.deleteTask(taskId);
      fetchData();
      alert('Task deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setDeleteLoading(false);
    }
  };

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
          <h2>📊 Admin Dashboard</h2>
          <p>Create tasks and grade submissions</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'create-task' ? 'active' : ''}`}
            onClick={() => setActiveTab('create-task')}
          >
            Create Task
          </button>
          <button
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Submissions ({pendingSubmissions.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'graded' ? 'active' : ''}`}
            onClick={() => setActiveTab('graded')}
          >
            Graded Submissions ({gradedSubmissions.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'all-tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('all-tasks')}
          >
            All Tasks ({tasks.length})
          </button>
        </div>

        {activeTab === 'create-task' && (
          <div className="create-task-section">
            <div className="form-container">
              <h3>Create New Task</h3>
              <form onSubmit={handleCreateTask} className="task-form">
                <div className="form-group">
                  <label>Task Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Task Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description"
                    rows="6"
                    required
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={createLoading}>
                  {createLoading ? 'Creating...' : 'Create Task'}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="submissions-grid">
            {pendingSubmissions.length === 0 ? (
              <p className="no-data">No pending submissions</p>
            ) : (
              pendingSubmissions.map(submission => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  onGradeClick={() => setSelectedSubmission(submission)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'graded' && (
          <div className="submissions-grid">
            {gradedSubmissions.length === 0 ? (
              <p className="no-data">No graded submissions yet</p>
            ) : (
              gradedSubmissions.map(submission => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  onGradeClick={() => {}}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'all-tasks' && (
          <div className="tasks-grid">
            {tasks.length === 0 ? (
              <p className="no-data">No tasks created yet</p>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="task-summary">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <small>Created: {new Date(task.created_at).toLocaleDateString()}</small>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDeleteTask(task.id)}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete Task'}
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {selectedSubmission && (
          <div className="modal-overlay" onClick={() => setSelectedSubmission(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Grade Submission</h3>
              <div className="submission-details">
                <p><strong>Student:</strong> {selectedSubmission.student_name}</p>
                <p><strong>Task:</strong> {selectedSubmission.task_title}</p>
                <p><strong>Answer:</strong></p>
                <p className="answer-text">{selectedSubmission.answer}</p>
              </div>

              <form onSubmit={handleGradeSubmission}>
                <div className="form-group">
                  <label>Marks (out of 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    placeholder="Enter marks"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Feedback</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter feedback for student"
                    rows="5"
                    required
                  />
                </div>

                <div className="modal-buttons">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setSelectedSubmission(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn" disabled={gradeLoading}>
                    {gradeLoading ? 'Submitting...' : 'Submit Grades'}
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
