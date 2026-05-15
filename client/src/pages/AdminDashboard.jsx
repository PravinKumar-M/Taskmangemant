// Admin Dashboard - Main page for admin
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SubmissionCard from '../components/SubmissionCard';
import { taskAPI, submissionAPI, feedbackAPI } from '../services/api';
import '../styles/Dashboard.css';

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('create-task');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskType, setTaskType] = useState('general');
  const [mcqList, setMcqList] = useState([{ question: '', options: ['', '', '', ''], correctOption: '' }]);
  const [createLoading, setCreateLoading] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
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
      const [tasksRes, submissionsRes, feedbacksRes] = await Promise.all([
        taskAPI.getAllTasks(),
        submissionAPI.getAllSubmissions(),
        feedbackAPI.getAllFeedbacks()
      ]);

      setTasks(tasksRes.data.tasks || []);
      setSubmissions(submissionsRes.data.submissions || []);
      setFeedbacks(feedbacksRes.data.feedbacks || []);
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
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }
    if (taskType !== 'mcq' && !description.trim()) {
      alert('Please enter a task description');
      return;
    }

    if (taskType === 'mcq') {
      for (let i = 0; i < mcqList.length; i++) {
        const q = mcqList[i];
        if (!q.question.trim()) {
          alert(`Please fill the question text for Question ${i + 1}`);
          return;
        }
        if (q.options.some(opt => !opt.trim())) {
          alert(`Please fill all 4 options for Question ${i + 1}`);
          return;
        }
        if (!q.correctOption) {
          alert(`Please select the correct answer for Question ${i + 1}`);
          return;
        }
      }
    }

    setCreateLoading(true);
    try {
      await taskAPI.createTask({ 
        title, 
        description: taskType === 'mcq' ? 'Multiple Choice Quiz' : description,
        type: taskType,
        options: taskType === 'mcq' ? mcqList.map(q => ({ question: q.question, options: q.options })) : null,
        correct_answer: taskType === 'mcq' ? mcqList.map(q => q.correctOption) : null
      });
      setTitle('');
      setDescription('');
      setTaskType('general');
      setMcqList([{ question: '', options: ['', '', '', ''], correctOption: '' }]);
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

    setDeletingTaskId(taskId);
    try {
      await taskAPI.deleteTask(taskId);
      fetchData();
      alert('Task deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setDeletingTaskId(null);
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
          <button
            className={`tab-btn ${activeTab === 'feedbacks' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedbacks')}
          >
            Feedbacks ({feedbacks.length})
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
                  <label>Task Type</label>
                  <select 
                    value={taskType} 
                    onChange={(e) => setTaskType(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '15px' }}
                  >
                    <option value="general">General (Text Answer)</option>
                    <option value="mcq">One Mark Question (4 Options)</option>
                    <option value="code">Code Question (Compiler)</option>
                  </select>
                </div>

                {taskType !== 'mcq' && (
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
                )}

                {taskType === 'mcq' && (
                  <div className="mcq-questions-container" style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <h4 style={{ margin: 0 }}>Quiz Questions ({mcqList.length})</h4>
                      <button 
                        type="button" 
                        onClick={() => setMcqList([...mcqList, { question: '', options: ['', '', '', ''], correctOption: '' }])}
                        style={{ padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        + Add Question
                      </button>
                    </div>

                    {mcqList.map((q, qIndex) => (
                      <div key={qIndex} style={{ padding: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <label style={{ fontWeight: 'bold' }}>Question {qIndex + 1}</label>
                          {mcqList.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => {
                                const newList = [...mcqList];
                                newList.splice(qIndex, 1);
                                setMcqList(newList);
                              }}
                              style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                              ✕ Remove
                            </button>
                          )}
                        </div>
                        <textarea
                          value={q.question}
                          onChange={(e) => {
                            const newList = [...mcqList];
                            newList[qIndex].question = e.target.value;
                            setMcqList(newList);
                          }}
                          placeholder="Enter question text..."
                          rows="2"
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '15px' }}
                          required
                        />

                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '14px' }}>Options (Select the correct one)</label>
                        {q.options.map((opt, optIndex) => (
                          <div key={optIndex} style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                              type="radio"
                              name={`correct_option_${qIndex}`}
                              value={opt}
                              checked={q.correctOption === opt && opt !== ''}
                              onChange={() => {
                                const newList = [...mcqList];
                                newList[qIndex].correctOption = opt;
                                setMcqList(newList);
                              }}
                              disabled={!opt.trim()}
                              style={{ transform: 'scale(1.2)' }}
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newList = [...mcqList];
                                newList[qIndex].options[optIndex] = e.target.value;
                                // Update correctOption if it matches the old text
                                if (newList[qIndex].correctOption === q.options[optIndex]) {
                                  newList[qIndex].correctOption = e.target.value;
                                }
                                setMcqList(newList);
                              }}
                              placeholder={`Option ${optIndex + 1}`}
                              required
                              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

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
                  onGradeClick={() => {
                    setSelectedSubmission(submission);
                    setMarks(submission.marks);
                    setFeedback(submission.feedback || '');
                  }}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4>{task.title}</h4>
                    <span style={{ 
                      fontSize: '12px', 
                      background: '#e2e8f0', 
                      padding: '4px 8px', 
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                      color: '#475569'
                    }}>
                      {task.type || 'general'}
                    </span>
                  </div>
                  <p>{task.description}</p>
                  {task.type === 'mcq' && task.options && (
                    <div style={{ margin: '10px 0', paddingLeft: '10px', color: '#64748b', fontSize: '14px' }}>
                      {(() => {
                        try {
                          const parsed = typeof task.options === 'string' ? JSON.parse(task.options) : task.options;
                          if (Array.isArray(parsed)) {
                            return <p>Quiz with {parsed.length} questions</p>;
                          }
                          return <p>Invalid format</p>;
                        } catch (e) {
                          return <p>Invalid format</p>;
                        }
                      })()}
                    </div>
                  )}
                  <small>Created: {new Date(task.created_at).toLocaleDateString()}</small>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDeleteTask(task.id)}
                    disabled={deletingTaskId === task.id}
                  >
                    {deletingTaskId === task.id ? 'Deleting...' : 'Delete Task'}
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'feedbacks' && (
          <div className="tasks-grid">
            {feedbacks.length === 0 ? (
              <p className="no-data">No feedbacks submitted yet</p>
            ) : (
              feedbacks.map(fb => (
                <div key={fb.id} className="task-summary" style={{ borderLeft: '4px solid #3b82f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, color: '#1e293b' }}>{fb.student_name}</h4>
                    <span style={{ fontSize: '12px', background: '#e2e8f0', padding: '4px 8px', borderRadius: '12px', color: '#475569' }}>
                      {new Date(fb.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ marginBottom: '15px', fontSize: '14px', color: '#64748b' }}>
                    <p style={{ margin: '0 0 5px 0' }}><strong>Email:</strong> {fb.student_email}</p>
                    <p style={{ margin: '0 0 5px 0' }}><strong>Roll Number:</strong> {fb.reg_no}</p>
                    <p style={{ margin: 0 }}><strong>Phone:</strong> {fb.phone}</p>
                  </div>
                  <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '8px', color: '#334155' }}>
                    <p style={{ margin: 0, fontStyle: 'italic' }}>"{fb.feedback_text}"</p>
                  </div>
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
