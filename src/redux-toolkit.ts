import { createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';
import { v1 as uuid } from 'uuid';

import { Todo } from './type';

const TodoInitialState: Todo[] = [
  {
    id: uuid(),
    desc: 'Learn React',
    isComplete: true,
  },
  {
    id: uuid(),
    desc: 'Learn Redux',
    isComplete: true,
  },
  {
    id: uuid(),
    desc: 'Learn Redux-ToolKit',
    isComplete: false,
  },
];

const todoSlice = createSlice({
  name: 'todos',
  initialState: TodoInitialState,
  reducers: {
    create: {
      reducer: (
        state,
        {
          payload,
        }: PayloadAction<{ id: string; desc: string; isComplete: boolean }>
      ) => {
        state.push(payload);
      },
      prepare: ({ desc }: { desc: string }) => ({
        payload: {
          id: uuid(), // since inpure funtion uuid() can't be use on pure function
          desc,
          isComplete: false,
        },
      }),
    },
    edit: (
      state,
      { payload: { id, desc } }: PayloadAction<{ id: string; desc: string }>
    ) => {
      const todoToEdit = state.find(todo => todo.id === id);
      if (todoToEdit) {
        todoToEdit.desc = desc;
      }
    },
    toggle: (
      state,
      {
        payload: { id, isComplete },
      }: PayloadAction<{ id: string; isComplete: boolean }>
    ) => {
      const todoToToggle = state.find(todo => todo.id === id);
      if (todoToToggle) {
        todoToToggle.isComplete = isComplete;
      }
    },
    remove: (state, { payload: { id } }: PayloadAction<{ id: string }>) => {
      const indexToRemove = state.findIndex(todo => todo.id === id);
      if (indexToRemove) {
        state.splice(indexToRemove, 1);
        state.filter(todo => todo.id !== id);
      }
    },
  },
});

const selectedTodoSlice = createSlice({
  name: 'selectedTodo',
  initialState: null as string | null,
  reducers: {
    select: (state, { payload: { id } }: PayloadAction<{ id: string }>) => id,
  },
});

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {},
  extraReducers: {
    [todoSlice.actions.create.type]: state => state + 1,
    [todoSlice.actions.edit.type]: state => state + 1,
    [todoSlice.actions.toggle.type]: state => state + 1,
    [todoSlice.actions.remove.type]: state => state + 1,
  },
});

export const {
  create: createTodoActionCreator,
  edit: editTodoActionCreator,
  toggle: toggleTodoActionCreator,
  remove: deleteTodoActionCreator,
} = todoSlice.actions;

export const { select: selectTodoActionCreator } = selectedTodoSlice.actions;

const reducer = {
  todos: todoSlice.reducer,
  selectedTodo: selectedTodoSlice.reducer,
  counter: counterSlice.reducer,
};

export default configureStore({ reducer });
