import { useState, useEffect, useCallback } from "react";
import { createTask, getAllTasksByProjectId, updateTask, deleteTask } from "../services/api";
import { jwtDecode } from "jwt-decode";
import { User } from "../types/User";
import { Task, toTaskDto } from "../types/Task";
import { Project } from "../types/Project";

// Types
type ColumnKey = "todo" | "inProgress" | "done";
type Columns = Record<ColumnKey, Task[]>;

interface DecodedToken {
  sub: string;
  username: string;
}

// Utils
const groupTasksByStatus = (tasks: Task[]): Columns => ({
  todo: tasks.filter((t) => t.status === "todo"),
  inProgress: tasks.filter((t) => t.status === "inProgress"),
  done: tasks.filter((t) => t.status === "done"),
});

const useCurrentUser = (): User => {
  const [user, setUser] = useState<User>({} as User);
  useEffect(() => {
    const tokenValue = localStorage.getItem("authToken") || "";
    if (tokenValue) {
      const decoded: DecodedToken = jwtDecode(tokenValue);
      setUser({
        id: Number(decoded.sub),
        username: decoded.username,
        password: "",
      });
    }
  }, []);
  return user;
};

/**
 * Custom React hook to manage the logic of a Kanban board for a given project.
 *
 * Features:
 * - Fetches and groups tasks by status (columns) for the specified project.
 * - Handles drag & drop between columns.
 * - Handles task creation, update, and deletion (with API sync).
 * - Manages modal state and selected task.
 * - Provides the current user (decoded from JWT).
 *
 * @param {Project} project - The current project for which to load and manage tasks.
 * @returns {{
 *   currentUser: User,
 *   columns: Columns,
 *   setColumns: React.Dispatch<React.SetStateAction<Columns>>,
 *   selectedTask: Task | null,
 *   setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>,
 *   isModalOpen: boolean,
 *   setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
 *   handleDragStart: (event: React.DragEvent, task: Task, column: ColumnKey) => void,
 *   handleDrop: (event: React.DragEvent, targetColumn: ColumnKey) => Promise<void>,
 *   handleDragOver: (event: React.DragEvent) => void,
 *   handleTaskClick: (task: Task) => void,
 *   closeModal: () => void,
 *   handleSaveTask: (task: Task) => Promise<void>,
 *   handleDeleteTask: (taskId: number) => Promise<void>,
 * }}
 *   All state and handlers required to operate a Kanban board UI.
 */
export function useKanbanBoard(project: Project) {
  const currentUser = useCurrentUser();
  const [columns, setColumns] = useState<Columns>({ todo: [], inProgress: [], done: [] });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      const tasks = await getAllTasksByProjectId(project.id);
      setColumns(groupTasksByStatus(tasks));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [project.id]);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 10000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  // Drag & Drop handlers
  const handleDragStart = useCallback(
    (event: React.DragEvent, task: Task, column: ColumnKey) => {
      event.dataTransfer.setData("task", JSON.stringify(task));
      event.dataTransfer.setData("fromColumn", column);
    },
    []
  );

  const handleDrop = useCallback(
    async (event: React.DragEvent, targetColumn: ColumnKey) => {
      const task = JSON.parse(event.dataTransfer.getData("task")) as Task;
      const fromColumn = event.dataTransfer.getData("fromColumn") as ColumnKey;
      if (fromColumn === targetColumn) return;

      setColumns((prev) => {
        const updatedFrom = prev[fromColumn].filter((t) => t.id !== task.id);
        const updatedTo = [...prev[targetColumn], { ...task, status: targetColumn }];
        return { ...prev, [fromColumn]: updatedFrom, [targetColumn]: updatedTo };
      });

      try {
        await updateTask(task.id, toTaskDto({ ...task, status: targetColumn }));
      } catch (error) {
        console.error(`Error updating task ${task.id}:`, error);
        alert("Failed to update the task. Please try again.");
      }
    },
    []
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  // Modal handlers
  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTask(null);
  }, []);

  // Save (create or update) a task
  const handleSaveTask = useCallback(
    async (task: Task) => {
      try {
        if (task.id === 0) {
          const taskDto = toTaskDto(task);
          const newTask = await createTask(taskDto);
          setColumns((prev) => ({
            ...prev,
            [task.status as ColumnKey]: [...prev[task.status as ColumnKey], { ...task, ...newTask }],
          }));
        } else {
          const updatedTask = await updateTask(task.id, toTaskDto(task));
          setColumns((prev) => {
            const fromColumn = (Object.keys(prev) as ColumnKey[]).find((key) =>
              prev[key].some((t) => t.id === task.id)
            ) as ColumnKey | undefined;
            if (!fromColumn) return prev;
            if (fromColumn !== task.status) {
              const updatedFrom = prev[fromColumn].filter((t) => t.id !== task.id);
              const updatedTo = [...prev[task.status as ColumnKey], { ...task, ...updatedTask }];
              return { ...prev, [fromColumn]: updatedFrom, [task.status as ColumnKey]: updatedTo };
            } else {
              const updatedFrom = prev[fromColumn].map((t) =>
                t.id === task.id ? { ...task, ...updatedTask } : t
              );
              return { ...prev, [fromColumn]: updatedFrom };
            }
          });
        }
      } catch (error) {
        console.error("Error saving task:", error);
        alert("Failed to save the task. Please try again.");
      } finally {
        closeModal();
      }
    },
    [closeModal]
  );

  // Delete a task
  const handleDeleteTask = useCallback(
    async (taskId: number) => {
      try {
        await deleteTask(taskId);
        setColumns((prev) => {
          const updated = { ...prev };
          (Object.keys(updated) as ColumnKey[]).forEach((key) => {
            updated[key] = updated[key].filter((task) => task.id !== taskId);
          });
          return updated;
        });
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete the task. Please try again.");
      } finally {
        closeModal();
      }
    },
    [closeModal]
  );

  return {
    currentUser,
    columns,
    setColumns,
    selectedTask,
    setSelectedTask,
    isModalOpen,
    setIsModalOpen,
    handleDragStart,
    handleDrop,
    handleDragOver,
    handleTaskClick,
    closeModal,
    handleSaveTask,
    handleDeleteTask,
  };
}