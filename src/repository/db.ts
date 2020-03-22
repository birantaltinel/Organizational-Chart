import * as db from 'mysql';
import { promisify } from 'util';
import { SQL } from 'sql-template-strings';

import { NodesWithName } from './DbModel';
import { dbCredentials } from '../../env.json';

export class DBConnection {
  connection: db.Connection;

  constructor() {
    this.connection = db.createConnection({
      host: dbCredentials.host,
      port: parseInt(dbCredentials.port),
      user: dbCredentials.user,
      password: dbCredentials.password,
      database: dbCredentials.database
    });
  }

  /**
   * Returns a set of children nodes of the given parent node from the repository.
   */
  public async getChildNodesBy(
    nodeId: number,
    language: string = 'english',
    keyword?: string,
    pageNumber: number = 0,
    pageSize: number = 100
  ): Promise<NodesWithName> {
    this.connection.connect();
    const getChildNodesQuery = SQL`
        WITH 
            ChildNodes as (
                SELECT Child.idNode, Child.level, Child.iLeft, Child.iRight
                FROM node_tree as Child, node_tree as Parent
                WHERE
                    Child.level = Parent.level + 1
                    AND Child.iLeft > Parent.iLeft
                    AND Child.iRight < Parent.iRight
                    AND Parent.idNode = ${nodeId})
        SELECT ChildNodes.idNode, ChildNodes.level, ChildNodes.iLeft, ChildNodes.iRight, node_tree_names.language, node_tree_names.nodeName
        FROM ChildNodes inner join node_tree_names on ChildNodes.idNode = node_tree_names.idNode
        WHERE node_tree_names.language = ${language}
        LIMIT ${pageSize} OFFSET ${pageNumber * pageSize};
    `;
    const asyncQuery = promisify(this.connection.query).bind(this.connection);
    const nodes: NodesWithName = await asyncQuery(getChildNodesQuery);
    const filteredNodes = keyword
      ? nodes.filter(node => node.nodeName.toLowerCase().includes(keyword.toLowerCase()))
      : nodes;

    this.connection.end();
    return filteredNodes;
  }
}
