import sinon = require('sinon');
import { expect, assert } from 'chai';
import { Context } from 'aws-lambda';

import * as Service from '../src/service';
import { getOrganizationalChart } from '../src/handler';

describe('test getOrganizationalChart', () => {
  let getNodesStub: sinon.SinonStub<
    Parameters<typeof Service.getChildNodes>,
    ReturnType<typeof Service.getChildNodes>
  >;
  let getNumberOfChildrenStub: sinon.SinonStub<
    Parameters<typeof Service.getNumberOfChildren>,
    ReturnType<typeof Service.getNumberOfChildren>
  >;
  const context = (sinon.spy() as unknown) as Context;

  beforeEach(() => {
    getNodesStub = sinon.stub(Service, 'getChildNodes').resolves([
      {
        idNode: 1,
        iLeft: 13,
        iRight: 14,
        language: 'english',
        level: 2,
        nodeName: 'Managers'
      }
    ]);
    getNumberOfChildrenStub = sinon
      .stub(Service, 'getNumberOfChildren')
      .resolves(2);
  });
  afterEach(() => {
    getNodesStub.restore();
    getNumberOfChildrenStub.restore();
  });

  it('should succeed', async () => {
    const callback = sinon.spy();
    const event = {
      pathParameters: {
        node_id: '5',
      },
      multiValueQueryStringParameters: {
        language: ['english'],
        search_keyword: ['Managers'],
        page_num: [0],
        page_size: [100]
      }
    };
    const returnValue = await getOrganizationalChart(event, context, callback);

    expect(returnValue).to.be.deep.equal({
      body: JSON.stringify({
        nodes: [
          {
            node_id: 1,
            name: 'Managers',
            children_count: 2
          }
        ]
      }),
      statusCode: 200
    });
    assert(callback.notCalled);
  });
  it('should fail if the request is invalid', async () => {
    const callback = sinon.spy();
    const event = {
      pathParameters: null, // node_id missing
      multiValueQueryStringParameters: {
        language: ['english'],
        search_keyword: ['Managers'],
        page_num: [0],
        page_size: [100]
      }
    };
    const returnValue = await getOrganizationalChart(event, context, callback);

    expect(returnValue).to.be.deep.equal({
      body: JSON.stringify({
        nodes: [],
        error: 'Invalid node id'
      }),
      statusCode: 400
    });
    assert(callback.notCalled);
  });
  it('should fail if service fails', async () => {
    getNodesStub.rejects();
    const callback = sinon.spy();
    const event = {
      pathParameters: {
        node_id: '5',
      },
      multiValueQueryStringParameters: {
        language: ['english'],
        search_keyword: ['Managers'],
        page_num: [0],
        page_size: [100]
      }
    };
    const returnValue = await getOrganizationalChart(event, context, callback);

    expect(returnValue).to.be.deep.equal({
      body: JSON.stringify({
        nodes: [],
        error: 'Internal server error'
      }),
      statusCode: 500
    });
    assert(callback.notCalled);
  });
});
