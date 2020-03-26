/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {
    CacheType,
    createObservableDataAction,
    IAction,
    IActionContext,
    IActionInput,
    IAny,
    ICreateActionContext,
    IGeneric
} from '@msdyn365-commerce/core';
import { ProductRefinerValue, ProductSearchResult, SortingInfo } from '@msdyn365-commerce/retail-proxy';
import { observable } from 'mobx';

import { listPageType } from './actions';

/**
 * ListPageState class
 */
export class ListPageState {
    @observable public activeFilters: ProductRefinerValue[] | null = null;
    @observable public activeProducts: ProductSearchResult[] = [];
    @observable public sortingCritera: SortingInfo | null = null;
    @observable public currentPageNumber: number | null = null;
    @observable public totalProductCount: number | undefined;
    @observable public pageSize: number = 10;
    @observable public pageType: listPageType = 'Unknown';
}

/**
 * ListPageStateInput - action input
 */
export class ListPageStateInput implements IActionInput {
    public getCacheKey = () => `ListPageState`;
    public getCacheObjectType = () => 'ListPageState';
    public dataCacheType = (): CacheType => 'request';
}

export async function listPageStateAction(
    input: ListPageStateInput,
    ctx: IActionContext
): Promise<ListPageState> {
    return new ListPageState();
}

/**
 * create new input for create action
 */
export const createListPageInput = (
    inputData: ICreateActionContext<IGeneric<IAny>>
): IActionInput => {
    return new ListPageStateInput();
};

/**
 * ListPageState - create action
 */
export default createObservableDataAction<ListPageState>({
    action: <IAction<ListPageState>>listPageStateAction,
    input: createListPageInput
});
