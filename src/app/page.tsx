import { TodosRealtime } from './components/TodosRealtime';
import { AddTodoForm } from './components/AddTodoForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white text-gray-800">
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="text-3xl font-bold text-sky-600">ToDo App</h1>
        <p className="mt-2 text-gray-600">気持ちよくタスク管理しましょう。</p>

        <div className="w-full mt-8 flex flex-col gap-4">
          <AddTodoForm />
          <TodosRealtime />
        </div>
      </main>
    </div>
  );
}
