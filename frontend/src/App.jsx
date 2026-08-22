import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // Tasks
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");

  // Edit
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [message, setMessage] = useState("");

  // Task Analytics
const totalTasks = tasks.length;

const todoTasks = tasks.filter(
  (task) => task.status === "TODO"
).length;

const inProgressTasks = tasks.filter(
  (task) => task.status === "IN_PROGRESS"
).length;

const completedTasks = tasks.filter(
  (task) => task.status === "COMPLETED"
).length;

const highPriorityTasks = tasks.filter(
  (task) => task.priority === "HIGH"
).length;

  // Load tasks after login
  useEffect(() => {
    if (loggedIn) {
      getTasks();
    }
  }, [loggedIn]);

  // LOGIN
  const handleLogin = async () => {
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setLoggedIn(true);
        setMessage("");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("Unable to connect to the backend.");
    }
  };

  // REGISTER
  const handleRegister = async () => {
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setLoggedIn(true);
        setMessage("");
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      setMessage("Unable to connect to the backend.");
    }
  };

  // GET ALL TASKS
  const getTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else if (response.status === 401 || response.status === 403) {
        handleLogout();
      }
    } catch (error) {
      setMessage("Unable to load tasks.");
    }
  };

  // CREATE TASK
  const createTask = async () => {
    if (!title.trim()) {
      setMessage("Please enter a task title.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          status,
          priority,
        }),
      });

      if (response.ok) {
        setTitle("");
        setDescription("");
        setStatus("TODO");
        setPriority("MEDIUM");

        setMessage("Task created successfully!");

        getTasks();
      } else {
        setMessage("Failed to create task.");
      }
    } catch (error) {
      setMessage("Unable to connect to the backend.");
    }
  };

  // START EDITING TASK
  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority);
    setMessage("");
  };

  // UPDATE TASK
  const updateTask = async () => {
    if (!title.trim()) {
      setMessage("Please enter a task title.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/tasks/${editingTaskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            status,
            priority,
          }),
        }
      );

      if (response.ok) {
        setTitle("");
        setDescription("");
        setStatus("TODO");
        setPriority("MEDIUM");
        setEditingTaskId(null);

        setMessage("Task updated successfully!");

        getTasks();
      } else {
        setMessage("Failed to update task.");
      }
    } catch (error) {
      setMessage("Unable to connect to the backend.");
    }
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditingTaskId(null);
    setTitle("");
    setDescription("");
    setStatus("TODO");
    setPriority("MEDIUM");
    setMessage("");
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok || response.status === 204) {
        setMessage("Task deleted successfully!");
        getTasks();
      } else {
        setMessage("Failed to delete task.");
      }
    } catch (error) {
      setMessage("Unable to connect to the backend.");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setTasks([]);
    setMessage("");
  };

  // DASHBOARD
  if (loggedIn) {
    return (
      <div style={styles.dashboardContainer}>

        {/* HEADER */}
        <div style={styles.dashboardHeader}>
          <div>
            <h1>Task Management System</h1>
            <p>Manage your tasks efficiently</p>
          </div>

          <button
            style={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div style={styles.content}>

          {/* ANALYTICS */}
<div style={styles.analyticsSection}>

  <div style={styles.analyticsCard}>
    <h3>Total Tasks</h3>
    <p>{totalTasks}</p>
  </div>

  <div style={styles.analyticsCard}>
    <h3>TODO</h3>
    <p>{todoTasks}</p>
  </div>

  <div style={styles.analyticsCard}>
    <h3>In Progress</h3>
    <p>{inProgressTasks}</p>
  </div>

  <div style={styles.analyticsCard}>
    <h3>Completed</h3>
    <p>{completedTasks}</p>
  </div>

  <div style={styles.analyticsCard}>
    <h3>High Priority</h3>
    <p>{highPriorityTasks}</p>
  </div>

</div>

          {/* CREATE / UPDATE TASK */}
          <div style={styles.createCard}>

            <h2>
              {editingTaskId
                ? "Edit Task"
                : "Create New Task"}
            </h2>

            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />

            <textarea
              placeholder="Task description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              style={styles.textarea}
            />

            <div style={styles.selectRow}>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                style={styles.select}
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">
                  IN_PROGRESS
                </option>
                <option value="COMPLETED">
                  COMPLETED
                </option>
              </select>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
                style={styles.select}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>

            </div>

            {editingTaskId ? (

              <div style={styles.buttonRow}>

                <button
                  style={styles.createButton}
                  onClick={updateTask}
                >
                  Update Task
                </button>

                <button
                  style={styles.cancelButton}
                  onClick={cancelEdit}
                >
                  Cancel
                </button>

              </div>

            ) : (

              <button
                style={styles.createButton}
                onClick={createTask}
              >
                + Create Task
              </button>

            )}

            {message && (
              <p style={styles.message}>
                {message}
              </p>
            )}

          </div>

          {/* TASK LIST */}
          <div style={styles.taskSection}>

            <h2>My Tasks</h2>

            {tasks.length === 0 ? (

              <p>No tasks found.</p>

            ) : (

              tasks.map((task) => (

                <div
                  style={styles.taskCard}
                  key={task.id}
                >

                  <div style={styles.taskInfo}>

                    <h3>{task.title}</h3>

                    <p>{task.description}</p>

                    <span style={styles.status}>
                      Status: {task.status}
                    </span>

                    <span style={styles.priority}>
                      Priority: {task.priority}
                    </span>

                  </div>

                  <div>

                    <button
                      style={styles.editButton}
                      onClick={() =>
                        startEditing(task)
                      }
                    >
                      Edit
                    </button>

                    <button
                      style={styles.deleteButton}
                      onClick={() =>
                        deleteTask(task.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>
      </div>
    );
  }

  // LOGIN / REGISTER PAGE
  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.title}>
          Task Management System
        </h1>

        <p style={styles.subtitle}>
          Manage your tasks efficiently
        </p>

        <div style={styles.tabs}>

          <button
            style={
              showLogin
                ? styles.activeTab
                : styles.tab
            }
            onClick={() => {
              setShowLogin(true);
              setMessage("");
            }}
          >
            Login
          </button>

          <button
            style={
              !showLogin
                ? styles.activeTab
                : styles.tab
            }
            onClick={() => {
              setShowLogin(false);
              setMessage("");
            }}
          >
            Register
          </button>

        </div>

        {showLogin ? (

          <div>

            <h2>Login</h2>

            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) =>
                setLoginEmail(e.target.value)
              }
              style={styles.input}
            />

            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) =>
                setLoginPassword(e.target.value)
              }
              style={styles.input}
            />

            <button
              style={styles.button}
              onClick={handleLogin}
            >
              Login
            </button>

            {message && (
              <p style={styles.message}>
                {message}
              </p>
            )}

          </div>

        ) : (

          <div>

            <h2>Register</h2>

            <input
              type="text"
              placeholder="Name"
              value={registerName}
              onChange={(e) =>
                setRegisterName(e.target.value)
              }
              style={styles.input}
            />

            <input
              type="email"
              placeholder="Email"
              value={registerEmail}
              onChange={(e) =>
                setRegisterEmail(e.target.value)
              }
              style={styles.input}
            />

            <input
              type="password"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) =>
                setRegisterPassword(e.target.value)
              }
              style={styles.input}
            />

            <button
              style={styles.button}
              onClick={handleRegister}
            >
              Register
            </button>

            {message && (
              <p style={styles.message}>
                {message}
              </p>
            )}

          </div>

        )}

      </div>
    </div>
  );
}

const styles = {

  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    width: "400px",
    padding: "30px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.15)",
    textAlign: "center",
  },

  title: {
    marginBottom: "8px",
  },

  subtitle: {
    color: "#666",
    marginBottom: "25px",
  },

  tabs: {
    display: "flex",
    marginBottom: "25px",
  },

  tab: {
    flex: 1,
    padding: "12px",
    border: "none",
    backgroundColor: "#eee",
    cursor: "pointer",
  },

  activeTab: {
    flex: 1,
    padding: "12px",
    border: "none",
    backgroundColor: "#1976d2",
    color: "white",
    cursor: "pointer",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: "100px",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    resize: "vertical",
  },

  selectRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },

  select: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
  },

  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#1976d2",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  createButton: {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#2e7d32",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  cancelButton: {
    flex: 1,
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#757575",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  logoutButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#d32f2f",
    color: "white",
    cursor: "pointer",
  },

  message: {
    marginTop: "15px",
    fontWeight: "bold",
  },

  dashboardContainer: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
    fontFamily: "Arial, sans-serif",
  },

  dashboardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    backgroundColor: "white",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.1)",
  },

  content: {
    maxWidth: "1000px",
    margin: "30px auto",
    padding: "0 20px",
  },

  analyticsSection: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "15px",
  marginBottom: "30px",
},

analyticsCard: {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
},


  createCard: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "30px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.1)",
  },

  taskSection: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.1)",
  },

  taskCard: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  padding: "20px",
  marginBottom: "15px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  backgroundColor: "#fafafa",
},

  taskInfo: {
  flex: 1,
  minWidth: 0,
},

  editButton: {
    padding: "8px 14px",
    marginRight: "8px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#1976d2",
    color: "white",
    cursor: "pointer",
  },

  deleteButton: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#d32f2f",
    color: "white",
    cursor: "pointer",
  },

  status: {
    display: "inline-block",
    marginRight: "10px",
    padding: "5px 8px",
    backgroundColor: "#e3f2fd",
    borderRadius: "5px",
    fontSize: "13px",
  },

  priority: {
    display: "inline-block",
    padding: "5px 8px",
    backgroundColor: "#fff3e0",
    borderRadius: "5px",
    fontSize: "13px",
  },
};

export default App;