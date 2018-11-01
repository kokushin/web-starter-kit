# web-starter-kit 2.0

webpack4, babel, eslint(airbnb), scss, gulp

## 開発

自動コンパイル、ローカルサーバの起動、ライブリロードを実行します。

```
npm run dev
```

## ビルド

css,jsファイルを最適化して`dist`ディレクトリへ出力します。

```
npm run build
```

## Q&A

### Q. JSファイルの名前を変更したり追加したい！

A. `src/js/entries`配下のjsファイルを編集・追加した後、`gulpfile.js`の`options.WEBPACK`項目を編集してください。

### Q. CSSファイルの名前を変更したり追加したい！

A. `src/scss/entries`配下のscssファイルを編集・追加してください。
