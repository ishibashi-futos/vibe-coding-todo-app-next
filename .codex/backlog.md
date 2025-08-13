## 📝 Product Backlog

このプロダクトバックログには、実装の優先順位順に並べられたアプリケーションのユーザーストーリーが記述されています。
ユーザーストーリー単位に `feature/ユーザーストーリーの番号-ユーザーストーリーの英語名` ブランチを作成し、
実装が完了したらPull Requestを作成します。

### **Story Workflow**

* Stories are prioritized from top to bottom.
* **🕒** = TODO
* **✅** = DONE

Always work on the highest story marked with **🕒**. When you finish it, change it to **✅** and move to the next one.

### **Definition of Done (DoD)**

A user story is considered "Done" only when it meets all of the following criteria:

#### **Code & Testing**
* A failing test is written before the implementation (Red).
* All automated tests (Unit, Integration, E2E) pass (Green).
* Code is refactored for simplicity and readability.
* Code passes all linter and static analysis checks.

#### **Product**
* All acceptance criteria are met.
* Any necessary documentation (e.g., README, Wiki) has been updated.

---

- **✅　Story 1: ユーザーとして、保存されている全てのToDoを一覧で見たい**
  - タスク:
    - [x] ページ表示時に `GET /api/todos` で全タスク取得
    - [x] 各タスクに「完了チェック」「タスク名」「削除ボタン」を表示
    - [x] WebSocketの `todos:updated` イベント受信時にリストを再取得
  - 受け入れ条件:
    - 一覧に全タスクが表示される
    - リアルタイムでリストが更新される

- **✅　Story 2: ユーザーとして、新しいToDoを追加したい**
  - タスク:
    - [x] 入力フォームでタスク名を入力できる
    - [x] 「追加」ボタンで `POST /api/todos` にリクエスト送信
    - [x] DB追加後、WebSocketで全クライアントに更新通知
  - 受け入れ条件:
    - 新規タスクが一覧に追加される
    - 他クライアントにも即時反映される

- **✅　Story 3: ユーザーとして、既存ToDoの完了状態を切り替えたい**
  - タスク:
    - [x] チェックボックスで完了/未完了をトグル
    - [x] `PATCH /api/todos/[id]` で状態更新
    - [x] 更新後、WebSocketで全クライアントに通知
  - 受け入れ条件:
    - 完了状態が正しく切り替わる
    - 他クライアントにも即時反映される

- **✅　Story 4: ユーザーとして、不要なToDoを削除したい**
  - タスク:
    - [x] 削除ボタンで `DELETE /api/todos/[id]` を送信
    - [x] 削除後、WebSocketで全クライアントに通知
  - 受け入れ条件:
    - 削除したタスクが一覧から消える
    - 他クライアントにも即時反映される

- **✅　Story 5: ユーザーとして、タスクを追加したらFormから文字列が消えてほしい**
  - 受け入れ条件:
    - タスクを「追加」すると、入力済みのタイトルが削除されること

- **✅Fix: Update 'act' imports from 'react-dom/test-utils' to 'react'**

- The test suite is displaying deprecation warnings related to `act` from `react-dom/test-utils`. The output indicates that `ReactDOMTestUtils.act` is now deprecated and should be replaced with `React.act`. This change is a result of updates in React's testing utilities.
- The warnings appear in multiple test files:
  - `tests/unit/TodosRealtime.test.tsx`
  - `tests/unit/TodoList.delete.test.tsx`
  - `tests/unit/TodoList.toggle.test.tsx`
  - `tests/unit/AddTodoForm.test.tsx`
  - `tests/unit/AddTodoForm.clear.test.tsx`
- Additionally, a separate warning states that the testing environment is not configured to support `act(...)`, which may be related to the outdated import.
- **Acceptance Criteria**
  - [x] All instances of `act` imported from `react-dom/test-utils` are replaced with `act` imported from `react`.
  - [x] The `Vitest` test suite runs without displaying the `ReactDOMTestUtils.act` deprecation warning.
  - [x] The `The current testing environment is not configured to support act(...)` warning is resolved.

- **🕒　Story 6: Tailwindを適用して、さわやかなスタイルのデザインを適用してほしい**
  - 受け入れ条件:
    - nextのテンプレートCSSが消えていること
    - `Get started by editing..` `Learn` `examples` などのデフォルトの項目が画面から消えていること
    - Tailwindのスタイルが適用されて、さわやかなスタイルの見た目になっていること
