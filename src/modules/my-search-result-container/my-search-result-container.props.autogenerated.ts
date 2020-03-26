/**
 * Copyright (c) 2018 Microsoft Corporation
 * IMySearchResultContainer contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface IMySearchResultContainerConfig extends Msdyn365.IModuleConfig {
    parentText?: string;
    itemsPerPage?: number;
    imageSettings?: Msdyn365.IImageSettings;
    className?: string;
}

export interface IMySearchResultContainerResources {
    noResultsForRefinersText: string;
    resultCategoryNotFoundText: string;
    resultSearchNotFoundText: string;
    paginationAriaLabel: string;
    priceFree: string;
    originalPriceText: string;
    currentPriceText: string;
    ratingAriaLabel: string;
    flipperNext: string;
    flipperPrevious: string;
    searchTextPrefix: string;
    numberOfProducts: string;
    oneProduct: string;
    categoryLinkAriaLabel: string;
    sortByDropdownLabel: string;
    sortByOptionNameAsc: string;
    sortByOptionNameDesc: string;
    sortByOptionPriceAsc: string;
    sortByOptionPriceDesc: string;
    sortByOptionRatingDesc: string;
    sortByOptionRelevanceDesc: string;
    placeholderTextMax: string;
    minLabel: string;
    maxLabel: string;
    rangeNameFormat: string;
    validationErrorNotNumber: string;
    validationErrorNotRange: string;
    clearAllText: string;
    choiceSummaryLabel: string;
    choiceFormat: string;
    choiceRangeValueFormat: string;
    choiceAriaLabel: string;
    modalTitle: string;
    modalCloseButtonText: string;
    minValueSliderThumbAriaLabel: string;
    maxValueSliderThumbAriaLabel: string;
}

export interface IMySearchResultContainerProps<T> extends Msdyn365.IModule<T> {
    resources: IMySearchResultContainerResources;
    config: IMySearchResultContainerConfig;
}
