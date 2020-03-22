import { ChildNodeSearchParameters } from "./models/ChildNodeSearchParameters";
import { NodesWithName } from "./repository/DbModel";
import { DBConnection } from "./repository/db";

/**
 * Retrieves the direct children of the given parent node.
 */
export async function getChildNodes(
  childNodeSearchParameters: ChildNodeSearchParameters
): Promise<NodesWithName> {
  const db = new DBConnection();
  return await db.getChildNodesBy(
    childNodeSearchParameters.nodeId,
    childNodeSearchParameters.language,
    childNodeSearchParameters.searchKeyword,
    childNodeSearchParameters.pageNum,
    childNodeSearchParameters.pageSize
  );
}

/**
 * Returns the number of children of the given parent node.
 */
export async function getNumberOfChildren(nodeId: number): Promise<number> {
  const db = new DBConnection();
  const childrenNodes = await db.getChildNodesBy(nodeId);
  return childrenNodes.length;
}
