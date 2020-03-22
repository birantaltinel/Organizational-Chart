import {Language} from './Language';

export interface GetNodesRequest {
    node_id: string[];
    language: Language[];
    search_keyword?: string[];
    page_num?: string[];
    page_size?: string[];
};