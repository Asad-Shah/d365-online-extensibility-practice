/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as Msdyn365 from '@msdyn365-commerce/core';
import { SimpleProduct } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';


/**
 * Product Action Input Class
 * This class is used by our Action Function, so that it has access to a productId
 */
export class GetProductInput implements Msdyn365.IActionInput {
    public productId: number;
    public channelId: number;
    public apiSettings: any;
    constructor(productId: number, apiSettings: any) {
        this.apiSettings = apiSettings;
        this.productId = +productId;
        this.channelId = apiSettings.channelId;
    }
    public getCacheKey = () => `${this.channelId}-${this.productId}`;
    public getCacheObjectType = () => 'Product';
    public dataCacheType = (): Msdyn365.CacheType => 'application';
}

/**
 * Creates the input required to make the retail api call
 */
export const createSimpleProductsInput = (inputData: any) => {
    let productId = inputData.config && inputData.config.productId;
    return new GetProductInput(productId, inputData.requestContext.apiSettings);
};

/**
 * Action Function which calls the Retail API and returns the product based on the passed ProductInputs productId
 */
async function getSimpleProductAction(input: GetProductInput, ctx: Msdyn365.IActionContext): Promise<SimpleProduct> {
    const { apiSettings } = ctx.requestContext;

    // Construct our HTTP request using information available in actionContext (ctx), and our Action Input (input)
    const requestUrl = `${apiSettings.baseUrl}/Commerce/Products/${input.productId}`;

    // Make the HTTP Request
    return Msdyn365.sendCommerceRequest<SimpleProduct>(requestUrl, 'get')
        .then((response: Msdyn365.IHTTPResponse) => {
            if (response.data) {
                return response.data;
            }
            ctx.trace('[getSimpleProductAction] Invalid response from server');
            return [];
        })
        .catch((error: Msdyn365.IHTTPError) => {
            ctx.trace(error.message);
            ctx.trace(error.stack || '');
            ctx.trace(`Unable to Fetch Product.`);
            return <SimpleProduct>{} as any;
        });
}

/**
 * This exports the action Data Action, which the result of passing your action method and createInput method (if used)
 * to the createDataAction method.
 */
export default Msdyn365.createObservableDataAction({
    action: <Msdyn365.IAction<SimpleProduct>>getSimpleProductAction,
    input: createSimpleProductsInput,
});