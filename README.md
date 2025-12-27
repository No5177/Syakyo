# Syakyo-React (寫經)

一個基於 React + TypeScript + Tailwind CSS 的佛教經文抄寫應用程式。

## 專案功能
- 垂直書寫模式（Traditional East Asian typography）
- 逐字比對邏輯，支援中文 IME 輸入
- 使用者進度儲存 (localStorage)
- 支援多章節經文（如《地藏經》）與單一經文（如《心經》）

## 如何啟動

### 1. 安裝 Node.js
如果您的電腦尚未安裝 Node.js，請至 [nodejs.org](https://nodejs.org/) 下載並安裝 LTS 版本。

### 2. 安裝依賴套件
在專案根目錄執行：
```powershell
npm install
```

### 3. 啟動開發伺服器
```powershell
npm run dev
```
啟動後，請訪問終端機顯示的網址（通常為 `http://localhost:5173`）。

## 專案規範
- **版控**: 使用 `.gitignore` 過濾不必要的檔案。
- **操作紀錄**: 所有重大修改記錄於 `log/modify.log`。
- **類型安全**: 使用 TypeScript 確保代碼品質。

## 部署到 GitHub Pages

本專案支援透過 GitHub Pages 進行部署。

### 1. 修改設定
已在 `vite.config.ts` 中加入 `base: './'`，確保靜態資源路徑正確。

### 2. 部署方式 (手動)
1. 執行 `npm run build`。
2. 將產生的 `dist` 資料夾內容上傳到 GitHub 倉庫的 `gh-pages` 分支。

### 3. 自動部署 (建議)
您可以使用 GitHub Actions 建立自動化部署流程（例如使用 `peaceiris/actions-gh-pages`）。

## 紀錄
開發過程中的操作紀錄請參閱 `log/modify.log`。
