/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as Msdyn365 from '@msdyn365-commerce/core';

/**
 * GetProductReviews Input Action
 */

export class GetProductReviewsInput implements Msdyn365.IActionInput {
    // TODO: Construct the input needed to run the action
    constructor() {
    }

    // TODO: Determine if the results of this get action should cache the results and if so provide
    // a cache object type and an appropriate cache key
    public getCacheKey = () => `TODO`;
    public getCacheObjectType = () => 'TODO';
    public dataCacheType = (): Msdyn365.CacheType => 'application';
}

// TODO: Create a data model here or import one to capture the response of the action
export interface IGetProductReviewsData {
    text: string;
}

/**
 * TODO: Use this function to create the input required to make the action call
 */
const createInput = (args: Msdyn365.ICreateActionContext): Msdyn365.IActionInput => {
    return new GetProductReviewsInput();
};

/**
 * TODO: Use this function to call your action and process the results as needed
 */
async function action(input:GetProductReviewsInput, ctx: Msdyn365.IActionContext):Promise<IGetProductReviewsData> {
    // const apiSettings = Msdyn365.msdyn365Commerce.apiSettings;

    // TODO: Uncomment the below line to get the value from a service
    // const response = await Msdyn365.sendRequest<IGetProductReviewsData[]>('/get/example/id/1', 'get');
    return {text: 'Static data from action'};
}

const IGetProductReviewsAction =  Msdyn365.createObservableDataAction({
    action: <Msdyn365.IAction<IGetProductReviewsData>>action,
    input: createInput
});


export default IGetProductReviewsAction;