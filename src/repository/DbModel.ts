import {Language} from '../models/Language';

export interface Node {
    idNode: number;
    level: number;
    iLeft: number;
    iRight: number;
};

export interface NodeName {
    idNode: number;
    language: Language;
    nodeName: string;
};

export type NodeWithName = Node & NodeName;

export type NodesWithName = NodeWithName[];