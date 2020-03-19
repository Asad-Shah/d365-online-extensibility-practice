/**
 * Copyright (c) 2018 Microsoft Corporation
 * IContentBlock contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export const enum textplacement {
    left = 'left',
    right = 'right',
    center = 'center'
}

export const enum imageplacement {
    top = 'top',
    bottom = 'bottom',
    right = 'right',
    left = 'left'
}

export const enum texttheme {
    dark = 'dark',
    light = 'light'
}

export interface IContentBlockConfig extends Msdyn365.IModuleConfig {
    heading?: IHeadingData;
    paragraph?: Msdyn365.RichText;
    image?: Msdyn365.IImageData;
    links?: ILinksData[];
    className?: string;
    textplacement?: textplacement;
    imageplacement?: imageplacement;
    texttheme?: texttheme;
}

export const enum HeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface IHeadingData {
    text: string;
    tag?: HeadingTag;
}

export interface ILinksData {
    linkText?: string;
    linkUrl: Msdyn365.ILinkData;
    ariaLabel?: string;
    openInNewTab?: boolean;
}

export interface IContentBlockProps<T> extends Msdyn365.IModule<T> {
    config: IContentBlockConfig;
}
