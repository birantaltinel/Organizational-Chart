import { Handler } from 'aws-lambda';
import { GetNodesRequestQuery, GetNodesRequestPath } from './models/GetNodesRequest';
import { GetNodesResponse } from './models/GetNodesResponse';
import { getChildNodes, getNumberOfChildren } from './service';
import { AllowedLanguages } from './models/Language';

/**
 * Entry point of the serverless function. 
 * Given the request parameters, calls the corresponding service functions and returns the children nodes of the given parent node.
 */
export const getOrganizationalChart: Handler = async (event, _context, _callback) => {
    try{
        const getNodesRequestQuery: GetNodesRequestQuery = event.multiValueQueryStringParameters;
        const getNodesRequestPath: GetNodesRequestPath = event.pathParameters;
        const nodeId = Number(getNodesRequestPath?.node_id);
        const language = getNodesRequestQuery?.language?.[0];
        const searchKeyword = getNodesRequestQuery?.search_keyword?.[0];

        // Check the parameters for all forbidden cases
        if(!language){
            return createErrorResponseWith(400, 'Missing mandatory params');
        }
        if(!nodeId){
            return createErrorResponseWith(400, 'Invalid node id');
        }
        if(!AllowedLanguages.includes(language)){
            return createErrorResponseWith(400, 'Invalid language parameter');
        }
        if(getNodesRequestQuery.page_num?.[0]) {
            const pageNum = Number(getNodesRequestQuery.page_num?.[0]);
            if(isNaN(pageNum) || !Number.isInteger(pageNum) || pageNum < 0){
                return createErrorResponseWith(400, 'Invalid page number requested');
            }
        }
        if(getNodesRequestQuery.page_size?.[0]) {
            const pageSize = Number(getNodesRequestQuery.page_size?.[0]);
            if(isNaN(pageSize) || !Number.isInteger(pageSize) || pageSize < 0 || pageSize > 1000){
                return createErrorResponseWith(400, 'Invalid page size requested');
            }
        }

        const childNodeSearchParameters = {
            nodeId,
            language,
            searchKeyword,
            pageNum: getNodesRequestQuery.page_num?.[0] ? Number(getNodesRequestQuery.page_num?.[0]) : undefined,
            pageSize: getNodesRequestQuery.page_size?.[0] ? Number(getNodesRequestQuery.page_size?.[0]) : undefined,
        }

        const childNodes = await getChildNodes(childNodeSearchParameters);
        const nodes = await Promise.all(childNodes.map(async childNode => ({
            node_id: childNode.idNode,
            name: childNode.nodeName,
            children_count: await getNumberOfChildren(childNode.idNode)
        })));
        const getNodesResponse: GetNodesResponse = {
            nodes
        };
        return createResponse(200, getNodesResponse);
    } catch(err) {
        return createErrorResponseWith(500, 'Internal server error');
    }
}

function createResponse(statusCode: number, body: GetNodesResponse) {
    return {
        statusCode,
        body: JSON.stringify(body),
    }
}

function createErrorResponseWith(statusCode: number, message: string) {
    const errorResponse: GetNodesResponse = {
        nodes: [],
        error: message
    };
    return createResponse(statusCode, errorResponse);
}
