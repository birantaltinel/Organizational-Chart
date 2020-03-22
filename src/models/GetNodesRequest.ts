import {Language} from './Language';

export interface GetNodesRequestQuery {
    language: Language[];
    search_keyword?: string[];
    page_num?: string[];
    page_size?: string[];
};

export interface GetNodesRequestPath {
    node_id: string[];
}