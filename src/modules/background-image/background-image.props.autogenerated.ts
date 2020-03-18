/**
 * Copyright (c) 2018 Microsoft Corporation
 * IBackgroundImage contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface IBackgroundImageConfig extends Msdyn365.IModuleConfig {
    productIds?: string;
    bgColor?: string;
    image?: IImageData;
}

export interface IBackgroundImageResources {
    resourceKey: string;
}

export const enum ImageAlignment {
    left = 'left',
    right = 'right',
    center = 'center'
}

export interface IImageData {
    url?: string;
    alignment?: ImageAlignment;
    altText?: string;
}

export interface IBackgroundImageProps<T> extends Msdyn365.IModule<T> {
    resources: IBackgroundImageResources;
    config: IBackgroundImageConfig;
}
