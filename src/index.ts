const sym = require('symbol-sdk');
const config = require('./config/nodeConfig.js');
import axios, { AxiosInstance } from 'axios';

export const getActiveNode = async (networkType?: number | undefined) => {
  let network = networkType;
  if (networkType === undefined) {
    network = sym.NetworkType.TEST_NET;
  }
  const node = await getNode(network);
  return node;
};

const client: AxiosInstance = axios.create({
  timeout: 800, // milliseconds
});

const getNode = async (network: number | undefined): Promise<string> => {
  let nodes = config.TEST_NET_NODES;
  if (network === sym.NetworkType.MAIN_NET) {
    nodes = config.MAIN_NET_NODES;
  }
  const node = nodes[Math.floor(Math.random() * nodes.length)];
  return client
    .get(node + '/node/health')
    .then((res) => {
      if (res.data.status.apiNode === 'up' && res.data.status.db === 'up') {
        return node;
      } else {
        return getNode(network);
      }
    })
    .catch((err) => {
      return getNode(network);
    });
};
