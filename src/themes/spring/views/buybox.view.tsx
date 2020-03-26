/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

import {
    IBuyboxAddToCartViewProps,
    IBuyboxAddToWishlistViewProps,
    IBuyboxCallbacks,
    IBuyboxData,
    IBuyboxFindInStoreViewProps,
    IBuyboxProductConfigureDropdownViewProps,
    IBuyboxProductConfigureViewProps,
    IBuyboxProductQuantityViewProps,
    IBuyboxProps,
    IBuyboxState,
    IBuyboxViewProps
} from '@msdyn365-commerce-modules/buybox';

import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import PriceComponent from './components/price.component';

import { IBuyboxProps as IBuyboxExtentionProps, IBuyboxResources as IBuyboxExtentionResources } from '../definition-extensions/buybox.ext.props.autogenerated';
import { Quantity } from '../utilities/quantity';

const BuyboxView: React.FC<IBuyboxViewProps & IBuyboxExtentionProps<IBuyboxData>> = props => {
    const { ModuleProps, slots, MediaGalleryContainerProps, ProductInfoContainerProps, addToCart, addToWishlist, configure, description, findInStore, quantity, price, title, rating, callbacks, state, resources, config } = props;
    // console.log(props);
    // const {
    //     id,
    //     typeName,
    //     context,
    //     data: { productPrice: { result: productPrice } },
    // } = props;
    return (
        <Module {...ModuleProps}>
            <Node {...MediaGalleryContainerProps}>
                {props.mediaGallery}
            </Node>
            <Node {...ProductInfoContainerProps}>
                {slots.backgroundImage}
                {config.showBrandOffer && <span className="clubs-test">Brand Offer &clubs;</span>}
                {price}
                {/* {productPrice && (<PriceComponent
                            id={id}
                            typeName={typeName}
                            context={context}
                            data={{price: productPrice}}
                            freePriceText={resources.priceFree}
                            originalPriceText={resources.originalPriceText}
                            currentPriceText={resources.currentPriceText} />)} */}
                {title}
                {description}
                {_renderTextBlock(props.slots.textBlocks)}
                {rating}
                {configure && _renderConfigure(configure)}
                {quantity && _renderQuantity(quantity, callbacks, props, state, resources)}
                {_renderCartAndWishlistDiv(addToCart, addToWishlist)}
                {findInStore && _renderFindInStore(findInStore)}
            </Node>
        </Module>
    );
};

const _renderTextBlock = (textBlocks: React.ReactNode[]): JSX.Element | undefined => {
    if (!textBlocks || textBlocks.length === 0) {
        return undefined;
    }

    return (
        <>
            {textBlocks[0]}
        </>
    );
};

const _renderCartAndWishlistDiv = (addToCart?: IBuyboxAddToCartViewProps, addToWishlist?: IBuyboxAddToWishlistViewProps): JSX.Element | undefined => {
    if (!addToCart && !addToWishlist) {
        return undefined;
    }

    return (
        <div className='product-add-to-cart'>
            {addToCart && addToCart.errorBlock}
            {addToWishlist && addToWishlist.errorBlock}
            <div className='buttons'>
                {addToCart && addToCart.button}
                {addToWishlist && addToWishlist.button}
            </div>
        </div>
    );
};

const _renderConfigure = (configure: IBuyboxProductConfigureViewProps): JSX.Element => {
    const { ContainerProps, dropdowns } = configure;

    return (
        <Node {...ContainerProps}>
            {dropdowns.map(_renderConfigureDropdown)}
        </Node>
    );
};

const _renderConfigureDropdown = (dropdown: IBuyboxProductConfigureDropdownViewProps): JSX.Element => {
    const { ContainerProps, LabelContainerProps, heading, errors, select } = dropdown;

    return (
        <Node {...ContainerProps}>
            <Node {...LabelContainerProps}>
                {heading}
                {errors}
            </Node>
            {select}
        </Node>
    );
};

const _renderFindInStore = (findInStore: IBuyboxFindInStoreViewProps): JSX.Element => {
    const { ContainerProps, storeSelector, heading, description, errors, button } = findInStore;

    return (
        <Node {...ContainerProps}>
            {storeSelector}
            {heading}
            {description}
            {errors}
            {button}
        </Node>
    );
};

const _renderQuantity = (quantityComponent: IBuyboxProductQuantityViewProps, callbacks: IBuyboxCallbacks, props: IBuyboxProps<IBuyboxData>, state: IBuyboxState, extentionResources: IBuyboxExtentionResources): JSX.Element => {
    const { ContainerProps, LabelContainerProps, heading, errors } = quantityComponent;

    const {
        resources,
        context: {
            app: {
                config: {
                    maxQuantityForCartLineItem
                }
            }
        }
    } = props;

    const
        {
            quantity,
        } = state;

    const onChange = (newValue: number) => {
        if (callbacks.updateQuantity) {
            callbacks.updateQuantity(newValue);
        }
    };

    return (
        <Node {...ContainerProps}>
            <Node {...LabelContainerProps}>
                {heading}
                {errors}
            </Node>

            <Quantity
                id='ms-buybox__product-quantity-input'
                max={maxQuantityForCartLineItem || 10}
                currentCount={quantity}
                onChange={onChange}
                inputQuantityAriaLabel={resources.inputQuantityAriaLabel}
                decrementButtonAriaLabel={extentionResources.decrementButtonAriaLabel}
                incrementButtonAriaLabel={extentionResources.incrementButtonAriaLabel}
            />
        </Node>
    );
};

export default BuyboxView;
