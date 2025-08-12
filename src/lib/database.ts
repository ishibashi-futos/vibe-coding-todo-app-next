import { Low, Memory } from 'lowdb';
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

const isE2E = process.env.E2E_TESTING === '1';
const file = process.env.DB_FILE || 'db.json';
const adapter = isE2E ? new Memory<Data>() : new JSONFile<Data>(file);
const defaultData: Data = { todos: [] };
export const db = new Low<Data>(adapter, defaultData);
