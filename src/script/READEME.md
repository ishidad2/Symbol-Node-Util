ノードリスト取得スクリプト
===

# セットアップ

```
npm install
```

# 実行

```
node getNode.js
```

## Dockerで実行

ローカルにnode.jsをインストールしていない場合は、一つ上の階層でdocker-composeを使えばコンテナが立ち上がります。
docker-compose.ymlのある場所で下記のコマンドを実行

```
docker-compose up -d
```

コンテナへ接続

```
docker-compose exec node bash
```

コンテナ内でnode.jsを実行

```
node getNode.js
```


実行後、同階層に **nodelist.js** と **jp_nodes.js** が出力されます。

* nodelist.js 全てのSSL対応かつWebSocket対応ノードが出力されます。（jp_nodes.js分は含みません）
* jp_nodes.js 全てのSSL対応かつWebSocket対応ノードでロケーションが日本のもののみ出力されます。

* ノードのデータは「 [**Symbol Statistic Service API**](https://testnet.symbol.services/openapi/index.html) 」より取得しています。

Note
===

免責事項

ノードリスト取得スクリプトを使用したことにより発生したあらゆる損失や損害について、私は責任を負わないものとします。