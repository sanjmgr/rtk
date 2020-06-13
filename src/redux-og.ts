import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import { Todo } from './type';
import { v1 as uuid } from 'uuid';

// CONSTANT
const CREATE_TODO = 'CREATE_TODO';
const EDIT_TODO = 'EDIT_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const DELETE_TODO = 'DELETE_TODO';
const SELECT_TODO = 'SELECT_TODO';

// Action and Action Type
interface CreateTodoActionType {
  type: typeof CREATE_TODO;
  payload: Todo;
}

export const createTodoActionCreator = ({
  desc,
}: {
  desc: string;
}): CreateTodoActionType => {
  return {
    type: CREATE_TODO,
    payload: { id: uuid(), desc, isComplete: false },
  };
};

interface EditTodoActionType {
  type: typeof EDIT_TODO;
  payload: { id: string; desc: string };
}

export const editTodoActionCreator = ({
  id,
  desc,
}: {
  id: string;
  desc: string;
}): EditTodoActionType => {
  return {
    type: EDIT_TODO,
    payload: { id, desc },
  };
};

interface ToggleTodoActionType {
  type: typeof TOGGLE_TODO;
  payload: { id: string; isComplete: boolean };
}

export const ToggleTodoActionCreator = ({
  id,
  isComplete,
}: {
  id: string;
  isComplete: boolean;
}): ToggleTodoActionType => {
  return {
    type: TOGGLE_TODO,
    payload: {
      id,
      isComplete,
    },
  };
};

interface DeleteTodoActionType {
  type: typeof DELETE_TODO;
  payload: { id: string };
}

export const DeleteTodoActionCreator = ({
  id,
}: {
  id: string;
}): DeleteTodoActionType => {
  return {
    type: DELETE_TODO,
    payload: {
      id,
    },
  };
};

interface SelectTodoActionType {
  type: typeof SELECT_TODO;
  payload: {
    id: string;
  };
}

export const SelectTodoActionCreator = ({
  id,
}: {
  id: string;
}): SelectTodoActionType => {
  return {
    type: SELECT_TODO,
    payload: {
      id,
    },
  };
};

// REDUCER
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
type TodoActionTypes =
  | CreateTodoActionType
  | EditTodoActionType
  | DeleteTodoActionType
  | SelectTodoActionType
  | DeleteTodoActionType
  | ToggleTodoActionType;

const todosReducer = (
  state: Todo[] = TodoInitialState,
  action: TodoActionTypes
) => {
  switch (action.type) {
    case 'CREATE_TODO': {
      const { payload } = action;
      return [...state, payload];
    }
    case 'EDIT_TODO': {
      const { id, desc } = action.payload;
      return state.map(todo => (todo.id === id ? { ...state, desc } : todo));
    }
    case 'DELETE_TODO': {
      const { id } = action.payload;
      return state.filter(todo => todo.id !== id);
    }
    case 'TOGGLE_TODO': {
      const { id, isComplete } = action.payload;
      return state.map(todo =>
        todo.id === id ? { ...todo, isComplete } : todo
      );
    }
    default: {
      return state;
    }
  }
};

type SelectedTodoActionType = SelectTodoActionType;

const selectedTodoReducer = (
  state: string | null = null,
  { type, payload }: SelectTodoActionType
) => {
  switch (type) {
    case 'SELECT_TODO': {
      const { id } = payload;
      return id;
    }
    default: {
      return state;
    }
  }
};

const counterReducer = (
  state: number = 0,
  { type, payload }: TodoActionTypes
) => {
  switch (type) {
    case 'CREATE_TODO':
    case 'DELETE_TODO':
    case 'EDIT_TODO':
    case 'TOGGLE_TODO': {
      return state + 1;
    }
    default: {
      return state;
    }
  }
};

const reducers = combineReducers({
  todos: todosReducer,
  selectedTodo: selectedTodoReducer,
  counter: counterReducer,
});

// Store
export default createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk, logger))
);
