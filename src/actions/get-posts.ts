
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface IPost {
    userId: number;
    id: number;
    title: string;
    body: string;
}

/**
 * Product Action Input Class
 * This class is used by our Action Function, so that it has access to a productId
 */
export class GetPostInput implements Msdyn365.IActionInput {
    public productId: number;
    constructor(productId: number) {
        this.productId = +productId;
    }
    public getCacheKey = () => `Post-${this.productId}`;
    public getCacheObjectType = () => 'Post';
    public dataCacheType = (): Msdyn365.CacheType => 'application';
}

/**
 * Creates the input required to make the retail api call
 */
export const createPostInput = (inputData: any) => {
    console.log("Second");
    let productId = inputData.config && inputData.config.productId;
    return new GetPostInput(productId);
};

/**
 * Action Function which calls the Retail API and returns the product based on the passed ProductInputs productId
 */
export async function getPostAction(input: GetPostInput, ctx: Msdyn365.IActionContext): Promise<IPost> {
    const requestUrl = `https://jsonplaceholder.typicode.com/posts/43`;
    const response = await Msdyn365.sendRequest<IPost>(requestUrl, 'get');
    return response.data;
}

/**
 * This exports the action Data Action, which the result of passing your action method and createInput method (if used)
 * to the createDataAction method.
 */
export default Msdyn365.createObservableDataAction({
    action: <Msdyn365.IAction<IPost>>getPostAction,
    input: createPostInput,
});