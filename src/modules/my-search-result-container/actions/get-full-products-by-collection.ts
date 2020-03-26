/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { generateProductImageUrl } from '@msdyn365-commerce-modules/retail-actions';
import MsDyn365, {
    createObservableDataAction,
    IAction,
    IActionContext,
    IActionInput,
    ICreateActionContext
} from '@msdyn365-commerce/core';
import { AsyncResult, ProductSearchResult } from '@msdyn365-commerce/retail-proxy';
import {
    refineSearchByCategoryAsync,
    refineSearchByTextAsync
} from '@msdyn365-commerce/retail-proxy/dist/DataActions/ProductsDataActions.g';
import {
    BaseCollectionInput,
    createBaseCollectionInput
} from './base-collection-action';

import { ListPageStateInput } from '../list-page-state';

/**
 * GetFullProductsByCollection Action Input
 */
export class GetFullProductsByCollectionInput extends BaseCollectionInput implements IActionInput {
    public getCacheObjectType = () => 'FullProductSearchResult';
    public dataCacheType = () => {
        if (
            this.pageType !== 'Category' ||
            (this.refiners && this.refiners.length > 0) ||
            (this.queryResultSettings && this.queryResultSettings.Sorting && this.queryResultSettings.Sorting.Columns && this.queryResultSettings.Sorting.Columns.length > 0)
        ) {
            return 'request';
        } else {
            return 'application';
        }
    }
}

export interface IFullProductsSearchResultsWithCount {
    products: ProductSearchResult[];
    count: number;
}

/**
 * createInput function which creates and actionInput used to fetch products for a list page.
 */
const createInput = (args: ICreateActionContext<{ itemsPerPage: number }>): IActionInput => {
    const input = createBaseCollectionInput(args, GetFullProductsByCollectionInput);

    // Set Top
    if (input.queryResultSettings.Paging && args.config) {
        input.queryResultSettings.Paging.Top = args.config.itemsPerPage || 1;
    }

    // Set Skip
    if (input.queryResultSettings.Paging && args.requestContext.query && args.requestContext.query.skip) {
        input.queryResultSettings.Paging.Skip = +args.requestContext.query.skip;
    }

    input.queryResultSettings.count = true;

    return input;
};

/**
 * Action function to fetch products for a list page
 */
async function action(
    input: GetFullProductsByCollectionInput,
    ctx: IActionContext
): Promise<IFullProductsSearchResultsWithCount> {
    let productSearchResults: ProductSearchResult[];
    let promise: AsyncResult<ProductSearchResult[]>;

    if (input.pageType === 'Category' || (ctx.requestContext.query && ctx.requestContext.query.categoryId)) {
        if (input.category) {
            promise = refineSearchByCategoryAsync(
                {
                    callerContext: ctx,
                    queryResultSettings: input.queryResultSettings
                },
                input.apiSettings.channelId,
                input.apiSettings.catalogId,
                input.category,
                input.refiners
            );
        } else {
            throw new Error(
                '[GetFullProductsForCollection]Category Page Detected, but no global categoryId found'
            );
        }
    } else {
        if (input.searchText) {
            promise = refineSearchByTextAsync(
                {
                    callerContext: ctx,
                    queryResultSettings: input.queryResultSettings
                },
                input.apiSettings.channelId,
                input.apiSettings.catalogId,
                input.searchText,
                input.refiners
            );
        } else {
            throw new Error(
                '[GetFullProductsForCollection]Search Page Detected, but no q= query parameter found'
            );
        }
    }

    productSearchResults = await promise;

    const mappedProducts = productSearchResults.map(productSearchResult => {
        const newImageUrl = generateProductImageUrl(
            productSearchResult,
            ctx.requestContext.apiSettings
        );

        if (newImageUrl) {
            productSearchResult.PrimaryImageUrl = newImageUrl;
        }

        return (productSearchResult);
    });

    // Update ListPageState For SSR
    if (!MsDyn365.isBrowser) {
        ctx.update(new ListPageStateInput(), { totalProductCount: promise.metadata.count || 0, activeFilters: input.refiners });

    }

    return {
        products: mappedProducts,
        count: promise.metadata.count || 0
    };
}

export default createObservableDataAction({
    id: '@msdyn365-commerce-modules/search-result-container/get-full-products-by-collection',
    action: <IAction<IFullProductsSearchResultsWithCount>>action,
    input: createInput
});
