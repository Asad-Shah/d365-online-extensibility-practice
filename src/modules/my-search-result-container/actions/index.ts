import getCollectionProducts, { GetFullProductsByCollectionInput } from './get-full-products-by-collection';
import getMappedSearchConfiguration, { MappedSearchInput, sortOptions } from './get-mapped-search-configuration';
import getCollectionRefinersAction, { RefinersByCollectionInput } from './get-refiners-for-collection';
import { SortColumn } from '@msdyn365-commerce/retail-proxy';
import { ProductSearchResult } from '@msdyn365-commerce/retail-proxy';

export * from './base-collection-action';
export * from './url-utils';

interface MappedSearchConfiguration {
    key: string;
    sortColumn: SortColumn;
}

interface IFullProductsSearchResultsWithCount {
    products: ProductSearchResult[];
    count: number;
}

export {
    getCollectionProducts,
    getCollectionRefinersAction,
    GetFullProductsByCollectionInput,
    getMappedSearchConfiguration,
    IFullProductsSearchResultsWithCount,
    MappedSearchConfiguration,
    MappedSearchInput,
    RefinersByCollectionInput,
    sortOptions
};