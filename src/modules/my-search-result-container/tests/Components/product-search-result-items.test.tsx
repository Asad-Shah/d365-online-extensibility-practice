import { buildMockRequest, buildMockTelemetry, IRequestContext} from '@msdyn365-commerce/core';
import { ProductSearchResult } from '@msdyn365-commerce/retail-proxy';
import { render } from 'enzyme';
import * as React from 'react';
import { ISearchResultContainerResources } from '../../../..';
import { ProductSearchResultItems } from '../../components';

const mockProduct: ProductSearchResult = {
    RecordId: 22565429819,
    ItemId: '81120',
    Name: 'Cotton Polo',
    Description: 'Casual shirts are made for the \u201cgood times\u201d.  Our custom fitting shirts are relaxed enough to be comfortable without looking baggy.',
    BasePrice: 59.99,
    Price: 59.99,
    TotalRatings: 182,
    AverageRating: 3.71428571428571,
    PrimaryImageUrl:'https://cms-ppe-imageresizer-mr.trafficmanager.net/cms/api/fabrikamsb/imageFileData/search?fileName=/Products%2F91032_000_001.png'
};

const mockProducts: ProductSearchResult[] = [];
mockProducts.push(mockProduct);

const mockResources: ISearchResultContainerResources = {
    paginationAriaLabel: 'Page navigation example',
    priceFree: 'Free',
    originalPriceText: 'Original price',
    currentPriceText: 'Current price',
    ratingAriaLabel: 'average rating',
    flipperNext: 'next',
    flipperPrevious: 'previous',
    noResultsForRefinersText: 'No products found for the selected criteria.',
    resultCategoryNotFoundText:'No products found for the selected category',
    resultSearchNotFoundText:'No products found for the given search term',
    searchTextPrefix: 'Results for ',
    numberOfProducts: '{0} products',
    oneProduct: '1 product',
    categoryLinkAriaLabel: 'go to',
    sortByDropdownLabel:'Sort by:',
    sortByOptionNameAsc:'Name: A to Z',
    sortByOptionNameDesc:'Name: Z to A',
    sortByOptionPriceAsc:'Price: Low to High',
    sortByOptionPriceDesc: 'Price: High to Low',
    sortByOptionRatingDesc:'Rating: High to Low',
    sortByOptionRelevanceDesc:'Relevance',
    placeholderTextMax:'No Max',
    minLabel: 'Min',
    maxLabel:'Max',
    rangeNameFormat:'{0} Range',
    validationErrorNotNumber:'Input should be a number',
    validationErrorNotRange:'Invalid range: minimum should be less than maximum',
    clearAllText: 'Clear all',
    choiceSummaryLabel: '',
    choiceFormat: '{1}',
    choiceRangeValueFormat:'{0}-{1}',
    choiceAriaLabel:'button press enter and space key to remove filter',
    modalCloseButtonText:'close',
    modalTitle: 'Sort & filter',
    minValueSliderThumbAriaLabel: 'Minimum price',
    maxValueSliderThumbAriaLabel: 'Maximum price'
};

// @ts-ignore
const mockRequest: IRequestContext = buildMockRequest();
// @ts-ignore
const mockContext: ICoreContext = {
    request: mockRequest,
     // @ts-ignore: Using partial for testing
     cultureFormatter: {
        formatCurrency: jest.fn(price => `$${price}`)
    }
};
const telemetry = buildMockTelemetry();

describe('Product search result component', () => {
    it('renders correctly', () => {
        const mockProps = {
            products: mockProducts,
            resources: mockResources,
            context:mockContext,
            telemetry:telemetry,
            moduleId:'id',
            moduleType:'typeName',
            isCarousel: true
        };
        const component = render(<ProductSearchResultItems {...mockProps} />);
        expect(component).toMatchSnapshot();
    });
});