/**
 * Copyright (c) 2018 Microsoft Corporation
 * IBuybox containerModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';
import * as React from 'react';

export const enum titleHeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface IBuyboxConfig extends Msdyn365.IModuleConfig {
    titleHeadingTag?: titleHeadingTag;
    className?: string;
    showBrandOffer?: boolean;
}

export interface IBuyboxResources {
    findInStoreLinkText: string;
    findInStoreHeaderText: string;
    findInStoreDescriptionText: string;
    priceFree: string;
    originalPriceText: string;
    currentPriceText: string;
    addToCartText: string;
    outOfStockText: string;
    averageRatingAriaLabel: string;
    selectDimensionFormatString: string;
    productDimensionTypeColor: string;
    productDimensionTypeConfiguration: string;
    productDimensionTypeSize: string;
    productDimensionTypeStyle: string;
    addToWishlistButtonText: string;
    removeFromWishlistButtonText: string;
    nameOfWishlist: string;
    inputQuantityAriaLabel: string;
    addToWishlistMessage: string;
    removedFromWishlistMessage: string;
    addItemToWishlistError: string;
    removeItemFromWishlistError: string;
    productQuantityHeading: string;
    errorMessageOutOfStock: string;
    errorMessageOutOfRangeOneLeft: string;
    errorMessageOutOfRangeFormat: string;
    productDimensionTypeColorErrorMessage: string;
    productDimensionTypeConfigurationErrorMessage: string;
    productDimensionTypeSizeErrorMessage: string;
    productDimensionTypeStyleErrorMessage: string;
    buyboxErrorMessageHeader: string;
    addedToCartFailureMessage: string;
    maxQuantityLimitText: string;
    decrementButtonAriaLabel: string;
    incrementButtonAriaLabel: string;
}

export interface IBuyboxProps<T> extends Msdyn365.IModule<T> {
    resources: IBuyboxResources;
    config: IBuyboxConfig;
    slots: {
        mediaGallery: React.ReactNode[];
        storeSelector: React.ReactNode[];
        textBlocks: React.ReactNode[];
        backgroundImage: React.ReactNode[];
    };
}
