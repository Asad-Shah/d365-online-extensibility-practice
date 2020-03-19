/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as React from 'react';
import { ICoreContext } from '@msdyn365-commerce/core-internal/dist/types';
import { ProductDimension, ProductDimensionValue } from '@msdyn365-commerce/retail-proxy';
import { getDimensionValuesAsync, getByIdAsync } from '@msdyn365-commerce/retail-proxy/dist/DataActions/ProductsDataActions.g';
import { IBackgroundImageViewProps } from './background-image';

const _renderImage = (url: string | undefined, altText: string | undefined): JSX.Element => {
    return <img style={{ width: '200px' }} src={url} alt={altText} className='img-fluid p-3' />;
};

const getData = async (context: ICoreContext) => {
    const recordId = 68719490634;
    const channelId = context.actionContext.requestContext.apiSettings.channelId;
    const callerContext = context.actionContext;
    const matchingDimensionValues: ProductDimension[] = [];
    const dimensionTypeValue: number = 1;
    return getDimensionValuesAsync({ callerContext, queryResultSettings: {} }, recordId, channelId, dimensionTypeValue, matchingDimensionValues,
        // @ts-ignore: KitVariantResolution context should be nullable
        null);
};

const getDataById = async (context: ICoreContext) => {
    const callerContext = context.actionContext;
    return getByIdAsync({ callerContext, queryResultSettings: {} }, 68719490634, context.actionContext.requestContext.apiSettings.channelId);
};

const onButtonClick = (context: ICoreContext) => {
    return async (event: React.MouseEvent) => {
        try {
            const result = await getData(context);
            const result2 = await getDataById(context);
            result.forEach((e: ProductDimensionValue) => {
                console.log(e);
            });
            console.log(result2);
        } catch (error) {
            console.error(error);
        }
    };
};

/**
 *
 * BackgroundImageView component
 * @extends {React.Component<IBackgroundImageViewProps>}
 */
export default class BackgroundImageView extends React.Component<IBackgroundImageViewProps> {

    constructor(props: IBackgroundImageViewProps) {
        super(props);
    }

    public componentDidMount(): void {
        console.log('Mounted!');
    }

    public render(): JSX.Element {
        const { data, context, config } = this.props;
        const { image, bgColor } = config;

        console.log(data.products);

        return (
            <div style={{ backgroundColor: bgColor }} className='row align-items-center'>
                <button className='button-style-spring' type='button' onClick={onButtonClick(context)}>Get Data {image?.alignment}</button>
                <div style={{ textAlign: image?.alignment }} className='col-sm-6'>
                    {_renderImage(image?.url, image?.altText)}
                </div>
            </div>
        );
    }
}