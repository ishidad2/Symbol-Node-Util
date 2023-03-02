import axios from "axios";
import fs from 'fs';

// // メインネット設定
// const _peer_url = "https://symbol.services/nodes?filter=suggested&ssl=true&limit=2000";
// const NETWORK_IDENTIFIER = 104;

//テストネット設定
const _peer_url = "https://testnet.symbol.services/nodes?filter=suggested&ssl=true&limit=2000";
const NETWORK_IDENTIFIER = 152;

const protcol = "https://";
const port = ":3001";

let nount = 1;
const REST_VERSION = "2.4.2";
const COUNTRY = "Japan";

axios.get(_peer_url)
.then((response) => {
  const nodes = response.data;
  createNodeArray(nodes);
  // config_write(nodes);
})
.catch(function (error) {
  // 取得失敗時
  console.log('取得失敗', error);
})
.then(function () {
  // 取得成功・失敗の処理後に共通で実行
});

/**
 * コンフィグ用ノード配列生成
 * @param {Array} nodes 
 */
 async function createNodeArray(nodes){
  let jp_nodes = [];
  for(let i in nodes){
    console.log(" === " + nount + "===");
    const node = isActiveNode(nodes[i]);
    if(node.active){
      jp_nodes.push(protcol + node.node.host + port)
    }
    nount++;    
  };
  config_write("jp_nodes.js", jp_nodes);
  console.log(" === script end ===");
}

const isActiveNode = (node) => {
  let isActive = false
  try {
    const country = node.hostDetail.country;
    const wss = node.apiStatus.webSocket;
    const nodeStatus = node.apiStatus.nodeStatus;
    const networkIdentifier = node.networkIdentifier;
    const restVersion = node.apiStatus.restVersion;
    // 条件
    // country(Japan),websocket,nodeStatus(apiNode:true,db:true),networkIdentifier(MAIN_NET:104),restVersion(2.4.2),
    if(country === COUNTRY && wss && nodeStatus.apiNode === "up" && nodeStatus.db === "up" && networkIdentifier === NETWORK_IDENTIFIER && restVersion === REST_VERSION){
      isActive = true;
    }
  } catch (error) {
    config_write("error.log",  node, "a");
    return {active: isActive, node: node}
  }
  return {active: isActive, node: node};
}

/**
 * ファイルへ書き出し
 * @param {Array} nodes 
 */
function config_write(filename, nodes, mode){
  // 同期で行う場合
  try {
    if(mode == "a"){
      fs.appendFileSync(filename, JSON.stringify(nodes,null,4));
    }else{
      fs.writeFileSync(filename, JSON.stringify(nodes,null,4));
    }
  }catch(e){
    console.log(e);
  }
}
