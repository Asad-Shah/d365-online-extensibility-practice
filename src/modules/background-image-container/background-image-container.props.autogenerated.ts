/**
 * Copyright (c) 2018 Microsoft Corporation
 * IBackgroundImageContainer containerModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';
import * as React from 'react';

// tslint:disable-next-line:no-empty-interface
export interface IBackgroundImageContainerConfig extends Msdyn365.IModuleConfig {}

export interface IBackgroundImageContainerResources {
    resourceKey: string;
}

export interface IBackgroundImageContainerProps<T> extends Msdyn365.IModule<T> {
    resources: IBackgroundImageContainerResources;
    config: IBackgroundImageContainerConfig;
    slots: {
        slot1: React.ReactNode[];
        slot2: React.ReactNode[];
        slot3: React.ReactNode[];
        slot4: React.ReactNode[];
    };
}
