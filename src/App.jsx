import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Pencil, Trash2 } from "lucide-react";
import "./App.css";

function App() {
    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditId, setCurrentEditId] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [darkMode, setDarkMode] = useState(true); // default is dark mode

    const addOrUpdateTask = () => {
        if (input.trim() === "") {
            setMessage("Task cannot be empty!");
            setMessageType("error");
            return;
        }

        if (isEditing) {
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === currentEditId ? { ...task, text: input } : task
                )
            );
            setMessage("Task updated!");
        } else {
            const newTask = {
                id: Date.now(),
                text: input,
                completed: false,
            };
            setTasks([...tasks, newTask]);
            setMessage("Task added!");
        }

        setMessageType("success");
        setInput("");
        setIsEditing(false);
        setCurrentEditId(null);
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

    const toggleComplete = (id) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    useEffect(() => {
        if (message !== "") {
            const timer = setTimeout(() => setMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const toggleTheme = () => setDarkMode(!darkMode);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") addOrUpdateTask();
    };

    const themeStyles = {
        backgroundColor: darkMode ? "#1e1e1e" : "#fff",
        color: darkMode ? "#f0f0f0" : "#333",
    };

    const inputBg = darkMode ? "#2c2c2c" : "#fff";

    return (
        <div style={{ ...styles.container, ...themeStyles }}>
            <div style={styles.header}>
                <h2>Task Manager</h2>
                <button onClick={toggleTheme} style={styles.themeButton}>
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>

            {message && (
                <div
                    style={{
                        ...styles.message,
                        backgroundColor:
                            messageType === "success" ? "#dff0d8" : "#f8d7da",
                        color: messageType === "success" ? "#3c763d" : "#721c24",
                        border: `1px solid ${messageType === "success" ? "#d6e9c6" : "#f5c6cb"
                            }`,
                    }}
                >
                    {message}
                </div>
            )}

            <div style={styles.inputContainer}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter a task..."
                    style={{
                        ...styles.input,
                        backgroundColor: inputBg,
                        color: themeStyles.color,
                    }}
                />
                <button onClick={addOrUpdateTask} style={styles.addButton}>
                    {isEditing ? "Update" : "Add"}
                </button>
            </div>

            {tasks.length === 0 ? (
                <p style={styles.noTaskText}>No tasks added yet.</p>
            ) : (
                <ul style={styles.taskList}>
                    <AnimatePresence>
                        {tasks.map((task) => (
                            <motion.li
                                key={task.id}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    ...styles.taskItem,
                                    textDecoration: task.completed ? "line-through" : "none",
                                    color: task.completed ? "#999" : themeStyles.color,
                                }}
                            >
                                <div style={styles.leftGroup}>
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleComplete(task.id)}
                                        style={styles.checkbox}
                                    />
                                    <span>{task.text}</span>
                                </div>
                                <div style={styles.buttonGroup}>
                                    <button onClick={() => editTask(task)} style={styles.iconBtn}>
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        style={styles.iconBtn}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "500px",
        margin: "50px auto",
        padding: "20px",
        borderRadius: "8px",
        fontFamily: "Arial, sans-serif",
        transition: "all 0.3s ease",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "15px",
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
        border: "1px solid #ccc",
        borderRadius: "4px",
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
        padding: "10px",
        marginBottom: "15px",
        borderRadius: "4px",
        textAlign: "center",
        fontWeight: "bold",
    },
    themeButton: {
        backgroundColor: "#007BFF",
        color: "white",
        border: "none",
        padding: "6px 10px",
        borderRadius: "6px",
        cursor: "pointer",
    },
    taskList: {
        listStyle: "none",
        padding: 0,
    },
    taskItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        borderBottom: "1px solid #eee",
        borderRadius: "4px",
    },
    leftGroup: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    buttonGroup: {
        display: "flex",
        gap: "8px",
    },
    iconBtn: {
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        color: "#666",
    },
    noTaskText: {
        fontStyle: "italic",
        color: "#888",
        textAlign: "center",
    },
    checkbox: {
        width: "18px",
        height: "18px",
        cursor: "pointer",
    },
};

export default App;
