import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Kanban from "../pages/Kanban";

// Mock dependencies
jest.mock("../services/api", () => ({
  createTask: jest.fn().mockResolvedValue({ id: 1, title: "New Task", status: "todo" }),
  getAllTasksByProjectId: jest.fn().mockResolvedValue([
    { id: 1, title: "Task 1", status: "todo" },
    { id: 2, title: "Task 2", status: "inProgress" },
    { id: 3, title: "Task 3", status: "done" },
  ]),
  updateTask: jest.fn().mockResolvedValue({ id: 1, title: "Task 1", status: "done" }),
  deleteTask: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("jwt-decode", () => ({
  jwtDecode: () => ({ sub: "1", username: "testuser" }),
}));

jest.mock("../components/Board/Column", () => (props: any) => (
  <div data-testid={`column-${props.title.replace(/\s/g, "").toLowerCase()}`}>
    {props.title}
    {props.tasks.map((task: any) => (
      <div key={task.id} data-testid={`task-${task.id}`} onClick={() => props.onTaskClick(task)}>
        {task.title}
      </div>
    ))}
  </div>
));

jest.mock("../components/Board/Modal", () => (props: any) =>
  props.isOpen ? (
    <div data-testid="modal">
      <button onClick={() => props.onSave({ id: 0, title: "New Task", status: "todo" })}>Save</button>
      <button onClick={() => props.onDelete(1)}>Delete</button>
      <button onClick={props.onClose}>Close</button>
    </div>
  ) : null
);

const project = {
  id: 123,
  users: [{ id: 1, username: "testuser", password: "" }],
};

describe("Kanban", () => {
  it("renders columns and tasks", async () => {
    render(<Kanban project={project as any} />);
    expect(await screen.findByTestId("column-todo")).toBeInTheDocument();
    expect(screen.getByTestId("column-inprogress")).toBeInTheDocument();
    expect(screen.getByTestId("column-done")).toBeInTheDocument();

  });

  it("opens modal and creates a new task", async () => {
    render(<Kanban project={project as any} />);
    fireEvent.click(screen.getByText("+ Add Task"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      expect(require("../services/api").createTask).toHaveBeenCalled();
    });
  });


});