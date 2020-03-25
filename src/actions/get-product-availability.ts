import * as Msdyn365 from '@msdyn365-commerce/core';
import { SimpleProduct } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import { ProductAvailableQuantity } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import getProduct, { GetProductInput } from './get-product';

import getProductAvailability from './check-inventory';

/**
 * This interface will be the return type of our chain data action.
 * This contains both the basic product information in addition to the product's availability information.
 */
export interface SimpleProductWithAvailablility extends SimpleProduct {
    availability?: ProductAvailableQuantity
}

/**
 * Calls the Retail API and returns the Availability information for the passed Product
 */
async function getProductWithAvailabilityAction(input: GetProductInput, ctx: Msdyn365.IActionContext): Promise<SimpleProductWithAvailablility> {
    // First we get the product
    console.log(input);
    const product: SimpleProductWithAvailablility = await getProduct(input, ctx);
    
    // const product: SimpleProductWithAvailablility = await <Msdyn365.AsyncResult<SimpleProductWithAvailablility>>getProduct(input, ctx);
    // If we successfully get the product, then we try to get its availability information.
    if (product) {
        // Get the availability information
        product.availability = await getProductAvailability(input, ctx)
        return product;
    }
    return <SimpleProductWithAvailablility>{};
}

export default Msdyn365.createObservableDataAction({
    action: <Msdyn365.IAction<SimpleProductWithAvailablility>>getProductWithAvailabilityAction
})