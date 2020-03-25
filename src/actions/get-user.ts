
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface IUser {
    userId: number;
    id: number;
    title: string;
    body: string;
    name: string,
    username: string,
    email: string,
    address: {
        street: string,
        suite: string,
        city: string,
        zipcode: string,
        geo: {
            lat: string,
            lng: string
        }
    },
    phone: string,
    website: string,
    company: {
        name: string,
        catchPhrase: string,
        bs: string
    }
}

export class GetUserInput implements Msdyn365.IActionInput {
    public productId: number;
    public userId: number;
    constructor(productId: number, userId: number) {
        this.productId = +productId;
        this.userId = +userId;
    }
    public getCacheKey = () => `User-${this.productId}`;
    public getCacheObjectType = () => 'User';
    public dataCacheType = (): Msdyn365.CacheType => 'application';
}

/**
 * Creates the input required to make the retail api call
 */
export const createuserInput = (inputData: any) => {
    console.log("Third");
    let productId = inputData.config && inputData.config.productId;
    return new GetUserInput(productId, 0);
};

/**
 * Action Function which calls the Retail API and returns the product based on the passed ProductInputs productId
 */
export async function getUserAction(input: GetUserInput, ctx: Msdyn365.IActionContext): Promise<IUser> {
    const requestUrl = `https://jsonplaceholder.typicode.com/users/${input.userId}`;
    const response = await Msdyn365.sendRequest<IUser>(requestUrl, 'get');
    return response.data;
}

/**
 * This exports the action Data Action, which the result of passing your action method and createInput method (if used)
 * to the createDataAction method.
 */
export default Msdyn365.createObservableDataAction({
    action: <Msdyn365.IAction<IUser>>getUserAction,
    input: createuserInput
});