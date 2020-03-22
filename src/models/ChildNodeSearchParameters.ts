import {Language} from './Language';

export interface ChildNodeSearchParameters {
    nodeId: number;
    language: Language;
    searchKeyword?: string;
    pageNum?: number;
    pageSize?: number;
};