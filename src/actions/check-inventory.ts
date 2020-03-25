/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as Msdyn365 from '@msdyn365-commerce/core';
import { ProductAvailableQuantity } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import { GetProductInput } from './get-product';

/**
 * Calls the Retail API and returns the Availability information for the passed Product
 */
async function getProductAvailableQuantityAction(input: GetProductInput, ctx: Msdyn365.IActionContext): Promise<ProductAvailableQuantity> {
    const { apiSettings } = ctx.requestContext;

    // Construct our HTTP request using information available in actionContext (ctx), and our Action Input (input)
    const requestUrl = `${apiSettings.baseUrl}/Products/GetProductAvailabilities`;
    const requestBody = {
        productId: input.productId
    }

    // Make the HTTP Call and handle the response
    return Msdyn365.sendCommerceRequest<ProductAvailableQuantity>(requestUrl, 'post', requestBody)
        .then((response: Msdyn365.IHTTPResponse) => {
            if (response.data) {
                return response.data;
            }
            ctx.trace('[getProductAvailabilityAction] Invalid response from server');
            return <ProductAvailableQuantity>[];
        })
        .catch((error: Msdyn365.IHTTPError) => {
            ctx.trace(error.message);
            ctx.trace(error.stack || '');
            ctx.trace(`Unable to Fetch Product Availability.`);
            return <ProductAvailableQuantity>{};
        });
}

export default Msdyn365.createObservableDataAction({
    action: <Msdyn365.IAction<ProductAvailableQuantity>>getProductAvailableQuantityAction
})