import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

export type Todo = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
};

type Data = {
  todos: Todo[];
};

const adapter = new JSONFile<Data>('db.json');
const defaultData: Data = { todos: [] };
export const db = new Low<Data>(adapter, defaultData);
