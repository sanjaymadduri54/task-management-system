import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  // Authentication
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

  // Filters
const [statusFilter, setStatusFilter] = useState("ALL");
const [priorityFilter, setPriorityFilter] = useState("ALL");
const [searchTitle, setSearchTitle] = useState("");

  // Messages
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Analytics
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

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
  const statusMatches =
    statusFilter === "ALL" || task.status === statusFilter;

  const priorityMatches =
    priorityFilter === "ALL" ||
    task.priority === priorityFilter;

  const titleMatches =
    task.title
      .toLowerCase()
      .includes(searchTitle.toLowerCase());

  return statusMatches && priorityMatches && titleMatches;
});

  // Load tasks after login
  useEffect(() => {
    if (loggedIn) {
      getTasks();
    }
  }, [loggedIn]);

  // ---------------- LOGIN ----------------

  const handleLogin = async () => {
    setMessage("");

    if (!loginEmail || !loginPassword) {
      setMessage("Please enter email and password.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setLoggedIn(true);
        setMessage("");
      } else {
        setMessage(data.message || "Login failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the backend.");
    }
  };

  // ---------------- REGISTER ----------------

  const handleRegister = async () => {
    setMessage("");

    if (!registerName || !registerEmail || !registerPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: registerName,
            email: registerEmail,
            password: registerPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setLoggedIn(true);
        setMessage("");
      } else {
        setMessage(
          data.message || "Registration failed."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the backend.");
    }
  };

  // ---------------- GET TASKS ----------------

  const getTasks = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/tasks`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else if (
        response.status === 401 ||
        response.status === 403
      ) {
        handleLogout();
      } else {
        setMessage("Unable to load tasks.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- CREATE TASK ----------------

  const createTask = async () => {
    setMessage("");

    if (!title.trim()) {
      setMessage("Please enter a task title.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/tasks`,
        {
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
        }
      );

      if (response.ok) {
        clearForm();
        setMessage("Task created successfully!");
        getTasks();
      } else {
        const data = await response.json().catch(() => null);
        setMessage(
          data?.message || "Failed to create task."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the backend.");
    }
  };

  // ---------------- START EDITING ----------------

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setPriority(task.priority);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ---------------- UPDATE TASK ----------------

  const updateTask = async () => {
    setMessage("");

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
        clearForm();
        setMessage("Task updated successfully!");
        getTasks();
      } else {
        const data = await response.json().catch(() => null);
        setMessage(
          data?.message || "Failed to update task."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the backend.");
    }
  };

  // ---------------- CLEAR FORM ----------------

  const clearForm = () => {
    setEditingTaskId(null);
    setTitle("");
    setDescription("");
    setStatus("TODO");
    setPriority("MEDIUM");
  };

  // ---------------- CANCEL EDIT ----------------

  const cancelEdit = () => {
    clearForm();
    setMessage("");
  };

  // ---------------- DELETE TASK ----------------

  const deleteTask = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/tasks/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok || response.status === 204) {
        setMessage("Task deleted successfully!");
        getTasks();
      } else {
        setMessage("Failed to delete task.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to the backend.");
    }
  };

  // ---------------- LOGOUT ----------------

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setTasks([]);
    clearForm();
    setMessage("");
  };

  // =====================================================
  // DASHBOARD
  // =====================================================

  if (loggedIn) {
    return (
      <div style={styles.dashboardContainer}>

        {/* HEADER */}

        <header style={styles.dashboardHeader}>
          <div>
            <h1 style={styles.headerTitle}>
              Task Management System
            </h1>

            <p style={styles.headerSubtitle}>
              Manage your tasks efficiently
            </p>
          </div>

          <button
            style={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <main style={styles.content}>

          {/* ANALYTICS */}

          <section style={styles.analyticsSection}>

            <div style={styles.analyticsCard}>
              <h3>Total Tasks</h3>
              <p style={styles.analyticsNumber}>
                {totalTasks}
              </p>
            </div>

            <div style={styles.analyticsCard}>
              <h3>TODO</h3>
              <p style={styles.analyticsNumber}>
                {todoTasks}
              </p>
            </div>

            <div style={styles.analyticsCard}>
              <h3>In Progress</h3>
              <p style={styles.analyticsNumber}>
                {inProgressTasks}
              </p>
            </div>

            <div style={styles.analyticsCard}>
              <h3>Completed</h3>
              <p style={styles.analyticsNumber}>
                {completedTasks}
              </p>
            </div>

            <div style={styles.analyticsCard}>
              <h3>High Priority</h3>
              <p style={styles.analyticsNumber}>
                {highPriorityTasks}
              </p>
            </div>

          </section>

          {/* CREATE / UPDATE */}

          <section style={styles.createCard}>

            <h2>
              {editingTaskId
                ? "Edit Task"
                : "Create New Task"}
            </h2>

            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
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
                <option value="TODO">
                  TODO
                </option>

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
                <option value="LOW">
                  LOW
                </option>

                <option value="MEDIUM">
                  MEDIUM
                </option>

                <option value="HIGH">
                  HIGH
                </option>
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

          </section>

          {/* FILTERS */}

          <section style={styles.filterCard}>

            <h2>Filter Tasks</h2>
            <input
  type="text"
  placeholder="Search tasks by title..."
  value={searchTitle}
  onChange={(e) => setSearchTitle(e.target.value)}
  style={styles.input}
/>

            <div style={styles.selectRow}>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                style={styles.select}
              >
                <option value="ALL">
                  All Statuses
                </option>

                <option value="TODO">
                  TODO
                </option>

                <option value="IN_PROGRESS">
                  IN_PROGRESS
                </option>

                <option value="COMPLETED">
                  COMPLETED
                </option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value)
                }
                style={styles.select}
              >
                <option value="ALL">
                  All Priorities
                </option>

                <option value="LOW">
                  LOW
                </option>

                <option value="MEDIUM">
                  MEDIUM
                </option>

                <option value="HIGH">
                  HIGH
                </option>
              </select>

            </div>

          </section>

          {/* TASK LIST */}

          <section style={styles.taskSection}>

            <div style={styles.taskSectionHeader}>

              <h2>My Tasks</h2>

              <span style={styles.taskCount}>
                {filteredTasks.length} task(s)
              </span>

            </div>

            {loading ? (

  <div style={styles.emptyState}>
    <p>Loading tasks...</p>
  </div>

) : filteredTasks.length === 0 ? (

  <div style={styles.emptyState}>
    <p>No tasks found.</p>
  </div>

) : (

              filteredTasks.map((task) => (

                <div
                  style={styles.taskCard}
                  key={task.id}
                >

                  <div style={styles.taskInfo}>

                    <h3 style={styles.taskTitle}>
                      {task.title}
                    </h3>

                    <p style={styles.taskDescription}>
                      {task.description}
                    </p>

                    <div>

                      <span style={styles.status}>
                        Status: {task.status}
                      </span>

                      <span style={styles.priority}>
                        Priority: {task.priority}
                      </span>

                    </div>

                  </div>

                  <div style={styles.taskButtons}>

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

          </section>

        </main>

      </div>
    );
  }

  // =====================================================
  // LOGIN / REGISTER
  // =====================================================

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.title}>
          Task Management System
        </h1>

        <p style={styles.subtitle}>
          Manage your tasks efficiently
        </p>

        {/* TABS */}

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

        {/* LOGIN */}

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

          /* REGISTER */

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

// =====================================================
// STYLES
// =====================================================

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },

  card: {
    width: "400px",
    maxWidth: "100%",
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
    fontSize: "15px",
  },

  activeTab: {
    flex: 1,
    padding: "12px",
    border: "none",
    backgroundColor: "#1976d2",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
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
    backgroundColor: "white",
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
    width: "100%",
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
    fontSize: "14px",
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

  headerTitle: {
    margin: 0,
  },

  headerSubtitle: {
    margin: "5px 0 0",
    color: "#666",
  },

  content: {
    maxWidth: "1000px",
    margin: "30px auto",
    padding: "0 20px",
  },

  analyticsSection: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "15px",
    marginBottom: "30px",
  },

  analyticsCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.1)",
  },

  analyticsNumber: {
    fontSize: "30px",
    fontWeight: "bold",
    margin: "10px 0 0",
  },

  createCard: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.1)",
  },

  filterCard: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "10px",
    marginBottom: "20px",
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

  taskSectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  taskCount: {
    color: "#666",
    fontSize: "14px",
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

  taskTitle: {
    marginTop: 0,
    marginBottom: "8px",
  },

  taskDescription: {
    color: "#555",
    marginBottom: "15px",
  },

  taskButtons: {
    display: "flex",
    gap: "8px",
  },

  editButton: {
    padding: "8px 14px",
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

  emptyState: {
    textAlign: "center",
    padding: "30px",
    color: "#666",
  },
};

export default App;