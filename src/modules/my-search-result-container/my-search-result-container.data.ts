import { CategoryHierarchy, IProductRefinerHierarchy } from '@msdyn365-commerce/commerce-entities';
import { AsyncResult } from '@msdyn365-commerce/retail-proxy';
import { IFullProductsSearchResultsWithCount, MappedSearchConfiguration } from './actions';
import {ListPageState} from './list-page-state';

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IMySearchResultContainerData {
    products: AsyncResult<IFullProductsSearchResultsWithCount>;
    category: AsyncResult<CategoryHierarchy>;
    listPageState: AsyncResult<ListPageState>;
    categoryHierarchy: AsyncResult<CategoryHierarchy[]>;
    searchConfiguration: AsyncResult<MappedSearchConfiguration[]>;
    refiners: AsyncResult<IProductRefinerHierarchy[]>;
}