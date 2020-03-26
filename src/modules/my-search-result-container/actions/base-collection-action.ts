/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {
    buildCacheKey,
    QueryResultSettingsProxy
} from '@msdyn365-commerce-modules/retail-actions';
import {
    CacheType,
    IActionInput,
    ICommerceApiSettings,
    ICreateActionContext
} from '@msdyn365-commerce/core';
import { IQueryResultSettings, ProductRefinerValue, SortColumn } from '@msdyn365-commerce/retail-proxy';
import { hydrateRefinersFromUrl } from './url-utils';

export type listPageType = 'Category' | 'Search' | 'Unknown';

/**
 * BaseCollection Action Input
 */
export class BaseCollectionInput implements IActionInput {
    public pageType: listPageType;
    public category: number | undefined;
    public searchText: string | undefined;
    public refiners: ProductRefinerValue[];
    public queryResultSettings: IQueryResultSettings;
    public apiSettings: ICommerceApiSettings;

    constructor(
        pageType: listPageType,
        apiSettings: ICommerceApiSettings,
        queryResultSettings: IQueryResultSettings,
        refiners: ProductRefinerValue[],
        category: number | undefined,
        searchText: string | undefined
    ) {
        this.pageType = pageType;
        this.apiSettings = apiSettings;
        this.category = category;
        this.searchText = searchText;
        this.queryResultSettings = queryResultSettings;
        this.refiners = refiners;
    }

    public getCacheKey = () =>
        // tslint:disable
        buildCacheKey(
            `${this.pageType}-${this.category || this.searchText}-${this.refiners.map(refiner => `${refiner.RefinerRecordId + (refiner.LeftValueBoundString || '') + (refiner.RightValueBoundString || '')}-`)}-${JSON.stringify(this.queryResultSettings)}`,
            this.apiSettings
        );
    public getCacheObjectType = () => 'CollectionActionResult';
    public dataCacheType = (): CacheType => 'request';
}

// TODO: Create a data model here or import one to capture the response of the action
export interface IGetFullProductsByCollectionData {
    text: string;
}

export type CollectionClassConstructor = new (
    pageType: listPageType,
    apiSettings: ICommerceApiSettings,
    queryResultSettings: IQueryResultSettings,
    refiners: ProductRefinerValue[],
    category: number | undefined,
    searchText: string | undefined
) => BaseCollectionInput;

/**
 * TODO: Use this function to create the input required to make the action call
 */
export const createBaseCollectionInput = (
    args: ICreateActionContext,
    inputClassConstuctor: CollectionClassConstructor
): BaseCollectionInput => {
    const pageType =
        args.requestContext.urlTokens.pageType === 'Category' || (args.requestContext.query && args.requestContext.query.categoryId)
            ? 'Category'
            : 'Search';

    const queryResultSettings = QueryResultSettingsProxy.fromInputData(args).QueryResultSettings;
    const queryRefiners = hydrateRefinersFromUrl(args.requestContext);

    if(args.requestContext.query && args.requestContext.query.sorting) {
        queryResultSettings.Sorting = { Columns: <SortColumn[]>JSON.parse(decodeURIComponent(args.requestContext.query.sorting)) };
    }

    if (pageType === 'Category') {
        return new inputClassConstuctor(
            pageType,
            args.requestContext.apiSettings,
            queryResultSettings,
            queryRefiners,
            +(args.requestContext.urlTokens.itemId || (args.requestContext.query && args.requestContext.query.categoryId) || 0),
            undefined
        );
    } else if (pageType === 'Search' && args.requestContext.query) {
        return new inputClassConstuctor(
            pageType,
            args.requestContext.apiSettings,
            queryResultSettings,
            queryRefiners,
            undefined,
            args.requestContext.query.q
        );
    }

    throw new Error('[getFullProductsForCollection]Unable to create input');
};