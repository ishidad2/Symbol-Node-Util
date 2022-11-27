// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./config/nodeConfig.js');
import { RepositoryFactoryHttp, NetworkType } from "symbol-sdk"
import { firstValueFrom } from 'rxjs'

interface NodeInfo {
  host: string,
  apiNode: string,
  db: string,
  generationHash: string,
  isHealth: boolean,
}

function isHealth(host: string,
  apiNode: string,
  db: string,
  refNodeInfo?: NodeInfo) {
  if (!refNodeInfo) {
      return true;
  }
  if (refNodeInfo) {
      if (apiNode === 'up' && db === 'up') {
        return true;
      }
  }
  return false;
}

async function getNodeInfo(nodeUrl: string) {
  try {
      const repoFactory = new RepositoryFactoryHttp(nodeUrl);
      const nodeRepo = repoFactory.createNodeRepository();
      const nodeHealth = await firstValueFrom(nodeRepo.getNodeHealth());
      const nodeInfo = await firstValueFrom(nodeRepo.getNodeInfo());

      const _nodeInfo: NodeInfo = {
          host: nodeUrl,
          apiNode: nodeHealth.apiNode,
          db: nodeHealth.db,
          generationHash: nodeInfo.networkGenerationHashSeed,
          isHealth: isHealth(nodeUrl, nodeHealth.apiNode, nodeHealth.db),

      };
      return _nodeInfo;
  } catch (err) {
      const _nodeInfo: NodeInfo = {
          host: nodeUrl,
          generationHash: '',
          apiNode: 'down',
          db: 'down',
          isHealth: false,
      };
      return _nodeInfo;
  }
}

async function NodeInfo(network: NetworkType): Promise<string> {
  let nodes = config.TEST_NET_NODES;
  if (network === NetworkType.MAIN_NET) {
    nodes = config.MAIN_NET_NODES;
  }
  const node = nodes[Math.floor(Math.random() * nodes.length)];
  const nodeInfo = await getNodeInfo(node);
  if(nodeInfo.apiNode === "up" && nodeInfo.db === "up"){
    if(network === NetworkType.TEST_NET){
      if(nodeInfo.generationHash === config.TEST_NET_GENERATIONHASH){
        return nodeInfo.host;
      }
      return NodeInfo(network);
    }
    return nodeInfo.host;
  }
  return NodeInfo(network);
}

export const getActiveNode = async (networkType?: NetworkType) => {
  let network = networkType;
  if (!network) {
    network = NetworkType.TEST_NET;
  }
  return await NodeInfo(network)
};
