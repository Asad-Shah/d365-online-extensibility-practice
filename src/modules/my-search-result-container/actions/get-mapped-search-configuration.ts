import { buildCacheKey } from '@msdyn365-commerce-modules/retail-actions';
import { CacheType, createObservableDataAction, IAction, IActionContext, IActionInput, IAny, ICommerceApiSettings, ICreateActionContext, IGeneric } from '@msdyn365-commerce/core';
import { SortColumn } from '@msdyn365-commerce/retail-proxy';
import { getSearchConfigurationAsync } from '@msdyn365-commerce/retail-proxy/dist/DataActions/StoreOperationsDataActions.g';

// TODO: import from commerce entities when available
// tslint:disable-next-line:interface-name
interface SearchConfiguration {
    ProductSortColumns?: SortColumn[];
}

export interface MappedSearchConfiguration {
    key: string;
    sortColumn: SortColumn;
}

export const sortOptions = {
    sortByOptionRelevanceDesc: 'Ranking-Desc',
    sortByOptionRatingAsc: 'AverageRating-Asc',
    sortByOptionRatingDesc: 'AverageRating-Desc',
    sortByOptionNameAsc: 'Name-Asc',
    sortByOptionNameDesc: 'Name-Desc',
    sortByOptionPriceAsc: 'Price-Asc',
    sortByOptionPriceDesc: 'Price-Desc'
};

/**
 * ActionInput class for the get-mapped-search-configuration Data Action
 */
export class MappedSearchInput implements IActionInput {
    private apiSettings: ICommerceApiSettings;

    constructor(apiSettings: ICommerceApiSettings) {
        this.apiSettings = apiSettings;
    }

    public getCacheKey = () => buildCacheKey('MappedSearchInput', this.apiSettings);
    public getCacheObjectType = () => 'MappedSearchInput';
    public dataCacheType = (): CacheType => 'request';
}

/**
 * Get a mapped search configuration that is easy to use for sorting
 */
export async function getMappedSearchConfiguration(input: MappedSearchInput, ctx: IActionContext): Promise<MappedSearchConfiguration[]> {
    return getSearchConfigurationAsync({ callerContext: ctx }).then((searchConfiguration: SearchConfiguration) => {
        return (<MappedSearchConfiguration[]>(searchConfiguration.ProductSortColumns || []).map<MappedSearchConfiguration | undefined>((sortColumn: SortColumn) => {
            let key = '';
            if (sortColumn.ColumnName) {
                switch(sortColumn.ColumnName.toUpperCase()) {
                    case 'NAME':
                        key = sortColumn.IsDescending ? sortOptions.sortByOptionNameDesc : sortOptions.sortByOptionNameAsc;
                        break;
                    case 'PRICE':
                        key = sortColumn.IsDescending ? sortOptions.sortByOptionPriceDesc : sortOptions.sortByOptionPriceAsc;
                        break;
                    case 'AVERAGERATING':
                        key = sortColumn.IsDescending ? sortOptions.sortByOptionRatingDesc : sortOptions.sortByOptionRatingAsc;
                        break;
                    case 'RANKING':
                        key = sortOptions.sortByOptionRelevanceDesc;
                        break;
                    default:
                }
            } else {
                ctx.telemetry.warning('[get-mapped-search-configuration] unknown search option');
            }
            if (key) {
                return {
                    key,
                    sortColumn
                };
            } else {
                return undefined;
            }
        }).filter(Boolean));
    });
}

export const createInput = (inputData: ICreateActionContext<IGeneric<IAny>>): IActionInput => {
    return new MappedSearchInput(inputData.requestContext.apiSettings);
};

export default createObservableDataAction({
    id: '@msdyn365-commerce-modules/search-result-container/get-mapped-search-configuration',
    action: <IAction<MappedSearchConfiguration[]>>getMappedSearchConfiguration,
    input: createInput
});