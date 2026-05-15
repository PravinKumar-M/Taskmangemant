// Student Dashboard - Main page for student
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import { taskAPI, submissionAPI, feedbackAPI } from '../services/api';
import '../styles/Dashboard.css';

export default function StudentDashboard() {
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [answer, setAnswer] = useState('');
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('available');

  // Compiler State
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [codeOutput, setCodeOutput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);

  // Feedback State
  const [feedbackRollNo, setFeedbackRollNo] = useState('');
  const [feedbackPhone, setFeedbackPhone] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

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
    const task = tasks.find(t => t.id === taskId);
    setSelectedTask(task);
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    let finalAnswer = answer;
    if (selectedTask.type === 'mcq') {
      try {
        const parsed = typeof selectedTask.options === 'string' ? JSON.parse(selectedTask.options) : selectedTask.options;
        if (Object.keys(mcqAnswers).length !== parsed.length) {
          alert('Please answer all questions!');
          return;
        }
        // Convert mcqAnswers object to an ordered array
        const answersArray = parsed.map((_, i) => mcqAnswers[i]);
        finalAnswer = JSON.stringify(answersArray);
      } catch (e) {
        alert('Error parsing questions');
        return;
      }
    } else if (!answer.trim()) {
      alert('Please enter an answer before submitting.');
      return;
    }

    setSubmitLoading(true);
    try {
      await submissionAPI.submitTask({
        task_id: selectedTask.id,
        answer: finalAnswer
      });
      setAnswer('');
      setMcqAnswers({});
      setCodeOutput('');
      setSelectedTask(null);
      fetchData();
      alert('Task submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit task');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRunCode = async () => {
    if (!answer.trim()) {
      setCodeOutput('Please write some code before running.');
      return;
    }
    setIsCompiling(true);
    setCodeOutput('Compiling and running...');
    try {
      const compilerMap = {
        'python': 'cpython-3.10.15',
        'c': 'gcc-13.2.0-c',
        'cpp': 'gcc-13.2.0',
        'javascript': 'nodejs-20.17.0'
      };

      const response = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compiler: compilerMap[codeLanguage],
          code: answer,
          save: false
        })
      });
      const data = await response.json();

      if (data.program_message || data.program_error) {
        setCodeOutput((data.program_message || '') + (data.program_error || ''));
      } else if (data.compiler_error) {
        setCodeOutput('Compilation Error:\n' + data.compiler_error);
      } else if (data.status === '0') {
        setCodeOutput('Program executed successfully with no output.');
      } else {
        setCodeOutput('An unknown error occurred or execution failed.');
      }
    } catch (err) {
      setCodeOutput('Failed to connect to compilation server: ' + err.message);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackYear || !feedbackPhone || !feedbackText) {
      alert('Please fill all feedback fields');
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      await feedbackAPI.submitFeedback({
        reg_no: feedbackRollNo,
        phone: feedbackPhone,
        feedback_text: feedbackText
      });
      alert('Feedback submitted successfully! Thank you.');
      setFeedbackRollNo('');
      setFeedbackPhone('');
      setFeedbackText('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setIsSubmittingFeedback(false);
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
          <button
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            👨‍💻 About Developer
          </button>
          <button
            className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            💬 Feedback
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

        {activeTab === 'about' && (
          <div className="about-developer">
            <div className="developer-card" style={{
              background: 'linear-gradient(145deg, #1e293b, #0f172a)',
              borderRadius: '20px',
              padding: '40px',
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              maxWidth: '500px',
              margin: '40px auto',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div className="developer-avatar" style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '50px'
              }}>
                👨‍💻
              </div>
              <h3 style={{ fontSize: '28px', marginBottom: '10px', fontWeight: 'bold' }}>Pravin Kumar M</h3>
              <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
                Passionate Full-Stack Developer creating aesthetic and highly functional web applications.
                Dedicated to building seamless user experiences and robust backend systems.
              </p>

              <div className="social-links" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <a href="https://www.linkedin.com/in/pravin-kumar-m-313248384/" target="_blank" rel="noreferrer" style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: '#0077b5',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'transform 0.2s'
                }}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  LinkedIn
                </a>
                <a href="https://www.instagram.com/smart.____07/" target="_blank" rel="noreferrer" style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'transform 0.2s'
                }}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Instagram
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="feedback-section" style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Share Your Feedback</h3>
            <form onSubmit={handleFeedbackSubmit}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Roll Number</label>
                <input
                  type="text"
                  value={feedbackRollNo}
                  onChange={(e) => setFeedbackRollNo(e.target.value)}
                  placeholder="Enter your roll number"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number</label>
                <input
                  type="tel"
                  value={feedbackPhone}
                  onChange={(e) => setFeedbackPhone(e.target.value)}
                  placeholder="e.g., +91 9876543210"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Your Feedback</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tell us what you think..."
                  rows="5"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingFeedback}
                style={{ width: '100%', padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: isSubmittingFeedback ? 'not-allowed' : 'pointer' }}
              >
                {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        )}

        {selectedTask && (
          <div className="modal-overlay" onClick={() => { setSelectedTask(null); setAnswer(''); setCodeOutput(''); }}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: selectedTask.type === 'code' ? '900px' : '500px', width: '90%' }}>
              <h3>Submit Your Answer</h3>

              <div style={{ marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>{selectedTask.title}</h4>
                <p style={{ margin: 0, color: '#475569', fontSize: '15px', whiteSpace: 'pre-wrap' }}>{selectedTask.description}</p>
              </div>

              <form onSubmit={handleSubmitAnswer}>
                {selectedTask.type === 'mcq' && selectedTask.options && (
                  <div className="mcq-questions" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
                    {(() => {
                      try {
                        const parsed = typeof selectedTask.options === 'string' ? JSON.parse(selectedTask.options) : selectedTask.options;
                        if (!Array.isArray(parsed)) return <p style={{ color: 'red' }}>Invalid options format.</p>;
                        return parsed.map((q, qIndex) => (
                          <div key={qIndex} style={{ padding: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>{qIndex + 1}. {q.question}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {q.options.map((opt, i) => (
                                <label key={i} style={{
                                  display: 'flex', alignItems: 'center', padding: '12px 15px', cursor: 'pointer',
                                  background: mcqAnswers[qIndex] === opt ? '#eff6ff' : '#ffffff',
                                  border: mcqAnswers[qIndex] === opt ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                  borderRadius: '8px', transition: 'all 0.2s'
                                }}>
                                  <input
                                    type="radio"
                                    name={`mcq_answer_${qIndex}`}
                                    value={opt}
                                    checked={mcqAnswers[qIndex] === opt}
                                    onChange={(e) => setMcqAnswers({ ...mcqAnswers, [qIndex]: e.target.value })}
                                    required
                                    style={{ marginRight: '15px', transform: 'scale(1.2)' }}
                                  />
                                  <span style={{ fontSize: '15px', color: '#1e293b' }}>{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ));
                      } catch (e) {
                        return <p style={{ color: 'red' }}>Error: The options for this task are malformed.</p>;
                      }
                    })()}
                  </div>
                )}

                {selectedTask.type === 'code' && (
                  <div className="code-editor-section" style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ fontWeight: 'bold', color: '#1e293b' }}>Select Language:</label>
                        <select
                          value={codeLanguage}
                          onChange={(e) => setCodeLanguage(e.target.value)}
                          style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                        >
                          <option value="python">Python</option>
                          <option value="c">C</option>
                          <option value="cpp">C++</option>
                          <option value="javascript">JavaScript</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2d2d2d', padding: '10px 15px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
                          <span style={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace' }}>main.{codeLanguage === 'python' ? 'py' : codeLanguage === 'c' ? 'c' : codeLanguage === 'cpp' ? 'cpp' : 'js'}</span>
                          <button
                            type="button"
                            onClick={handleRunCode}
                            disabled={isCompiling}
                            style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '4px', cursor: isCompiling ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            {isCompiling ? 'Running...' : '▶ Run Code'}
                          </button>
                        </div>
                        <textarea
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="// Write your code solution here..."
                          rows="12"
                          required
                          style={{ width: '100%', padding: '15px', background: '#1e1e1e', color: '#d4d4d4', fontFamily: "'Fira Code', 'Courier New', Courier, monospace", fontSize: '15px', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', border: 'none', outline: 'none', resize: 'vertical' }}
                          spellCheck="false"
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontWeight: 'bold', marginBottom: '8px', color: '#1e293b' }}>Output Terminal:</label>
                        <div style={{
                          background: '#0f172a',
                          color: '#38bdf8',
                          padding: '15px',
                          borderRadius: '8px',
                          minHeight: '100px',
                          fontFamily: "'Fira Code', monospace",
                          fontSize: '14px',
                          whiteSpace: 'pre-wrap',
                          border: '1px solid #1e293b'
                        }}>
                          {codeOutput || 'Click "Run Code" to see the output here...'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(!selectedTask.type || selectedTask.type === 'general') && (
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your answer here..."
                    rows="8"
                    required
                    style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                  />
                )}

                <div className="modal-buttons" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => { setSelectedTask(null); setAnswer(''); setCodeOutput(''); }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn" disabled={submitLoading}>
                    {submitLoading ? 'Submitting...' : 'Submit Answer'}
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
