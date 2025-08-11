# Node.js公式イメージを使用
FROM node:22-alpine

# 作業ディレクトリ作成
WORKDIR /app

# package.jsonとlockファイルをコピー
COPY package.json ./
COPY package-lock.json ./

# 依存関係インストール（利用するパッケージマネージャに応じて調整）
RUN npm ci

# 残りのファイルをコピー
COPY . .

# Next.jsのビルド
RUN npm run build

# ポート開放
EXPOSE 3000

# サーバー起動
CMD ["npm", "run", "start"]