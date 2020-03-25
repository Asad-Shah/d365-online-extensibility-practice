/**
 * Copyright (c) 2018 Microsoft Corporation
 * ISampleMessage contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

// tslint:disable-next-line:no-empty-interface
export interface ISampleMessageConfig extends Msdyn365.IModuleConfig {}

export interface ISampleMessageResources {
    resourceKey: string;
}

export interface ISampleMessageProps<T> extends Msdyn365.IModule<T> {
    resources: ISampleMessageResources;
    config: ISampleMessageConfig;
}
