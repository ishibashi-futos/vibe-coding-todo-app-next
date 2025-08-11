import React from 'react';
import { TodosRealtime } from '../components/TodosRealtime';

export default async function TodosPage() {
  // サーバレンダリングでは取得せず、クライアントでリアルタイム取得
  return <TodosRealtime />;
}
