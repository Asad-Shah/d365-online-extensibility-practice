/**
 * Copyright (c) 2018 Microsoft Corporation
 * ISampleButton contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

// tslint:disable-next-line:no-empty-interface
export interface ISampleButtonConfig extends Msdyn365.IModuleConfig {}

export interface ISampleButtonResources {
    resourceKey: string;
}

export interface ISampleButtonProps<T> extends Msdyn365.IModule<T> {
    resources: ISampleButtonResources;
    config: ISampleButtonConfig;
}
