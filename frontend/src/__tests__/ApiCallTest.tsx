import axios from "axios";
import {
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getAllTasksByProjectId,
  getUserData,
} from "../services/api";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("API service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("createTask should POST and return data", async () => {
    const fakeTask = { id: 1, title: "Task" };
    mockedAxios.post.mockResolvedValueOnce({ data: fakeTask });

    const result = await createTask(fakeTask as any);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://localhost:8000/tasks/",
      fakeTask
    );
    expect(result).toEqual(fakeTask);
  });

  it("updateTask should PUT and return data", async () => {
    const updatedTask = { title: "Updated" };
    const fakeResponse = { id: 1, ...updatedTask };
    mockedAxios.put.mockResolvedValueOnce({ data: fakeResponse });

    const result = await updateTask(1, updatedTask);

    expect(mockedAxios.put).toHaveBeenCalledWith(
      "http://localhost:8000/tasks/1",
      updatedTask
    );
    expect(result).toEqual(fakeResponse);
  });

  it("updateTaskStatus should PUT and return data", async () => {
    const fakeResponse = { id: 1, status: "done" };
    mockedAxios.put.mockResolvedValueOnce({ data: fakeResponse });

    const result = await updateTaskStatus(1, "done");

    expect(mockedAxios.put).toHaveBeenCalledWith(
      "http://localhost:8000/tasks/1",
      expect.objectContaining({ status: "done" })
    );
    expect(result).toEqual(fakeResponse);
  });

  it("deleteTask should DELETE and return data", async () => {
    mockedAxios.delete.mockResolvedValueOnce({ data: undefined });

    const result = await deleteTask(1);

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      "http://localhost:8000/tasks/1"
    );
    expect(result).toBeUndefined();
  });

  it("getAllTasksByProjectId should GET and return data", async () => {
    const fakeTasks = [{ id: 1, title: "Task 1" }];
    mockedAxios.get.mockResolvedValueOnce({ data: fakeTasks });

    const result = await getAllTasksByProjectId(123);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:8000/tasks",
      { params: { project_id: 123 } }
    );
    expect(result).toEqual(fakeTasks);
  });

  it("getUserData should GET and return data", async () => {
    const fakeUser = { id: 1, name: "John" };
    mockedAxios.get.mockResolvedValueOnce({ data: fakeUser });

    const result = await getUserData(1);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:8000/user-data/",
      { params: { user_id: 1 } }
    );
    expect(result).toEqual(fakeUser);
  });

  it("getUserData should throw if no userId", async () => {
    await expect(getUserData(undefined as any)).rejects.toThrow("No user ID provided");
  });
});