import {ResponseNode} from './ResponseNode';

export interface GetNodesResponse {
    nodes: ResponseNode[],
    error?: string
};
