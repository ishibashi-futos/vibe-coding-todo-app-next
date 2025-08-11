## 📝 Product Backlog

このプロダクトバックログには、実装の優先順位順に並べられたアプリケーションのユーザーストーリーが記述されています。
ユーザーストーリー単位に `feature/ユーザーストーリーの番号-ユーザーストーリーの英語名` ブランチを作成し、
実装が完了したらPull Requestを作成します。

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

- **Story 1: ユーザーとして、保存されている全てのToDoを一覧で見たい**
  - タスク:
    - [ ] ページ表示時に `GET /api/todos` で全タスク取得
    - [ ] 各タスクに「完了チェック」「タスク名」「削除ボタン」を表示
    - [ ] WebSocketの `todos:updated` イベント受信時にリストを再取得
  - 受け入れ条件:
    - 一覧に全タスクが表示される
    - リアルタイムでリストが更新される

- **Story 2: ユーザーとして、新しいToDoを追加したい**
  - タスク:
    - [ ] 入力フォームでタスク名を入力できる
    - [ ] 「追加」ボタンで `POST /api/todos` にリクエスト送信
    - [ ] DB追加後、WebSocketで全クライアントに更新通知
  - 受け入れ条件:
    - 新規タスクが一覧に追加される
    - 他クライアントにも即時反映される

- **Story 3: ユーザーとして、既存ToDoの完了状態を切り替えたい**
  - タスク:
    - [ ] チェックボックスで完了/未完了をトグル
    - [ ] `PATCH /api/todos/[id]` で状態更新
    - [ ] 更新後、WebSocketで全クライアントに通知
  - 受け入れ条件:
    - 完了状態が正しく切り替わる
    - 他クライアントにも即時反映される

- **Story 4: ユーザーとして、不要なToDoを削除したい**
  - タスク:
    - [ ] 削除ボタンで `DELETE /api/todos/[id]` を送信
    - [ ] 削除後、WebSocketで全クライアントに通知
  - 受け入れ条件:
    - 削除したタスクが一覧から消える
    - 他クライアントにも即時反映される

- **Story 5: ユーザーとして、アプリ再起動後もToDoデータが保持されてほしい**
  - タスク:
    - [ ] すべてのデータ操作をLowDB経由で行う
    - [ ] `db.json` に即時書き込み
  - 受け入れ条件:
    - アプリ再起動後もデータが消えない

- **Story 6: 開発者として、機能の品質をテストで担保したい**
  - タスク:
    - [ ] UIコンポーネントのユニットテスト（Vitest）
    - [ ] イベントハンドラのテスト
    - [ ] E2Eテスト（Playwright）で一連の操作シナリオを自動化
  - 受け入れ条件:
    - 主要UI・機能がテストでカバーされている
    - E2Eでユーザー操作が再現できる