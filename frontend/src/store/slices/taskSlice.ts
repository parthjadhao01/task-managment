import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export enum TaskStatus {
  Backlog = "Backlog",
  Todo = "Todo",
  Doing = "Doing",
  Done = "Done"
}

export interface Task {
  _id: string;
  name: string;
  workspaceId: string;
  projectId: {
    _id: string;
    workspaceId: string;
    name: string;
  };
  assignedId: {
    _id: string;
    userId: {
      _id: string;
      username: string;
      email: string;
    };
    workspaceId: string;
    role: string;
  };
  dueDate: Date;
  description: string;
  status: TaskStatus;
}

interface TaskFilters {
  workspaceId?: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  assignedId?: string | null;
  search?: string | null;
  dueDate?: string | null;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filters: TaskFilters;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {},
};

// Async Thunks
export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async (filters: TaskFilters, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const body = {
        workspaceId: filters.workspaceId,
        projectId: filters.projectId ?? undefined,
        status: filters.status ?? undefined,
        assignedId: filters.assignedId ?? undefined,
        search: filters.search ?? undefined,
        dueDate: filters.dueDate ?? undefined,
      };

      const response = await axios.post(
        `${API_BASE_URL}/task/get-tasks`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'task/createTask',
  async (
    taskData: {
      workspaceId: string;
      name: string;
      status: TaskStatus;
      dueDate: Date;
      assignedId: string;
      description?: string;
      projectId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${API_BASE_URL}/task/create-task`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'task/updateTask',
  async (
    { taskId, updates }: { taskId: string; updates: Partial<Task> },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.patch(
        `${API_BASE_URL}/task/update-task/${taskId}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'task/updateTaskStatus',
  async (
    { taskId, status }: { taskId: string; status: TaskStatus },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.patch(
        `${API_BASE_URL}/task/update-task/${taskId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { taskId, status };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task status');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`${API_BASE_URL}/task/delete-task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return taskId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
    }
  }
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<TaskFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    // Optimistic update for drag and drop
    updateTaskStatusLocally: (state, action: PayloadAction<{ taskId: string; status: TaskStatus }>) => {
      const task = state.tasks.find((t) => t._id === action.payload.taskId);
      if (task) {
        task.status = action.payload.status;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearTasks: (state) => {
      state.tasks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Task Status
      .addCase(updateTaskStatus.pending, (state) => {
        // Don't set loading for status updates (for smooth drag and drop)
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const task = state.tasks.find((t) => t._id === action.payload.taskId);
        if (task) {
          task.status = action.payload.status;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, updateTaskStatusLocally, clearError, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;