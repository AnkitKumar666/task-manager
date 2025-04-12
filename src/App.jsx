import './App.css'
import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [message, setMessage] = useState("");

  const addOrUpdateTask = () => {
    if (input.trim() === "") return;

    if (isEditing) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === currentEditId ? { ...task, text: input } : task
        )
      );
      setMessage("Task updated!");
      setIsEditing(false);
      setCurrentEditId(null);
    } else {
      const newTask = { id: Date.now(), text: input };
      setTasks([...tasks, newTask]);
      setMessage("Task added!");
    }

    setInput("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    if (isEditing && id === currentEditId) {
      setIsEditing(false);
      setCurrentEditId(null);
      setInput("");
    }
  };

  const editTask = (task) => {
    setInput(task.text);
    setIsEditing(true);
    setCurrentEditId(task.id);
  };

  // Auto-clear message after 3 seconds
  useEffect(() => {
    if (message !== "") {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div style={styles.container}>
      <h2>Task Manager</h2>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a task..."
          style={styles.input}
        />
        <button onClick={addOrUpdateTask} style={styles.addButton}>
          {isEditing ? "Update Task" : "Add Task"}
        </button>
      </div>

      {tasks.length === 0 ? (
        <p style={styles.noTaskText}>No tasks added yet.</p>
      ) : (
        <ul style={styles.taskList}>
          {tasks.map((task) => (
            <li key={task.id} style={styles.taskItem}>
              {task.text}
              <div style={styles.buttonGroup}>
                <button
                  onClick={() => editTask(task)}
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontFamily: "Arial, sans-serif",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "8px",
    fontSize: "16px",
  },
  addButton: {
    padding: "8px 12px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
  },
  message: {
    backgroundColor: "#dff0d8",
    color: "#3c763d",
    padding: "8px",
    borderRadius: "4px",
    marginBottom: "10px",
    textAlign: "center",
  },
  taskList: {
    listStyle: "none",
    padding: 0,
  },
  taskItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px",
    borderBottom: "1px solid #eee",
    alignItems: "center",
  },
  buttonGroup: {
    display: "flex",
    gap: "6px",
  },
  editButton: {
    backgroundColor: "#f0ad4e",
    color: "white",
    border: "none",
    padding: "4px 8px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    color: "white",
    border: "none",
    padding: "4px 8px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  noTaskText: {
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
  },
};

export default App;
