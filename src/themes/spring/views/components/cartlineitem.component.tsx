/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { PriceComponent } from '@msdyn365-commerce/components';
import { IComponentProps, IGridSettings, IImageSettings, Image } from '@msdyn365-commerce/core';
import { SimpleProduct } from '@msdyn365-commerce/retail-proxy';
import { CartLine, SalesLine } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import * as React from 'react';
import { Quantity } from '../../utilities/quantity';

/**
 * ICartlineResourceString: Interface for specifying the
 * resource strings that the component needs
 */
export interface ICartlineResourceString {
    /** Display string for discount label */
    discountStringText: string;
    /** String for size key  */
    sizeString: string;
    /** String for color key  */
    colorString: string;
    /** String associated with the configuration product dimension  */
    configString: string;
    /** String for style key  */
    styleString: string;
    /** Display string for quantity label  */
    quantityDisplayString: string;
    /** Display string for quantity label  */
    inputQuantityAriaLabel: string;
    /** Aria label for the decrement button in quanitity component  */
    decrementButtonAriaLabel: string;
    /** Aria label for the increment button in quanitity component  */
    incrementButtonAriaLabel: string;
}

interface ICartLineData {
    cartLine: CartLine | SalesLine;
    product: SimpleProduct;
}

/**
 * ICartLineProps: The props required to render cartLineitem
 */
export interface ICartLineProps extends IComponentProps<ICartLineData> {
    /** The flag to change the quantity component from interactible to static  */
    disableQuantityInteractivity?: boolean;
    /** The primary image url  */
    primaryImageUrl?: string;
    /** The product url  */
    productUrl?: string;
    /** GridSettings for the product image in cartLine  */
    gridSettings: IGridSettings;
    /** ImageSettings for the product image in cartLine  */
    imageSettings: IImageSettings;
    /** Boolean flag to indicate if the item is out of stock  */
    isOutOfStock?: boolean;
    /** Flag to make quantity section editable  */
    isQuantityEditable?: boolean;
    /** Max quantity for line item  */
    maxQuantity?: number;
    /** Current quantity for line item  */
    currentQuantity?: number;
    /** Resource string for the component  */
    resources: ICartlineResourceString;
    /** SalesLine flag  */
    isSalesLine?: boolean;
    /** Quantity onChange callback  */
    quantityOnChange?(cartLine: CartLine, newQuantity: number): void;
}

interface IDimensionStrings {
    /** String for size key  */
    sizeString: string;
    /** String for color key  */
    colorString: string;
    /** String associated with the configuration product dimension  */
    configString: string;
    /** String for style key  */
    styleString: string;
}

const CartLineItemFunctions = {
    renderProductDimensions: (Product: SimpleProduct, DimensionStrings: IDimensionStrings) => {
        if (!Product || !Product.Dimensions) {
            return [];
        }

        return Product.Dimensions.map(productDimension => {

            if (productDimension.DimensionTypeValue === 1) {
                return (
                    <div key={`${Product.RecordId}ProductDimensions1`}>
                        <span className='msc-cart-line__product-variant-color'>{DimensionStrings.colorString}:
                        <span className='name'>{productDimension.DimensionValue && productDimension.DimensionValue.Value}</span></span>
                    </div>
                );
            }

            if (productDimension.DimensionTypeValue === 2) {
                return (
                    <div key={`${Product.RecordId}ProductDimensions2`}>
                        <span className='msc-cart-line__product-configuration'>{DimensionStrings.configString}:
                        <span className='name'>{productDimension.DimensionValue && productDimension.DimensionValue.Value}</span></span>
                    </div>
                );
            }

            if (productDimension.DimensionTypeValue === 3) {
                return (
                    <div key={`${Product.RecordId}ProductDimensions3`}>
                        <span className='msc-cart-line__product-variant-size'>{DimensionStrings.sizeString}:
                        <span className='name'>{productDimension.DimensionValue && productDimension.DimensionValue.Value}</span></span>
                    </div>
                );
            }

            if (productDimension.DimensionTypeValue === 4) {
                return (
                    <div key={`${Product.RecordId}ProductDimensions4`}>
                        <span className='msc-cart-line__product-variant-style'>{DimensionStrings.styleString}:
                        <span className='name'>{productDimension.DimensionValue && productDimension.DimensionValue.Value}</span></span>
                    </div>
                );
            }
            return null;
        });
    },
    renderDiscountLines: (props: ICartLineProps) => {

        if (!props.data.cartLine.DiscountLines || props.data.cartLine.DiscountLines.length === 0) {
            return null;
        }
        return props.data.cartLine.DiscountLines.map((discountLine, index) => {
            return (
                <div key={discountLine.OfferId || index} className='msc-cart-line-item-product-discount'>
                    <span>
                        {discountLine.OfferName ? discountLine.OfferName : ''}:
                        {` ${props.resources.discountStringText || 'Discount'} `}
                    </span>
                    <span className={'cart-line-item-product-discount-price'}>
                        <PriceComponent
                            data={props.isSalesLine ? {price: {
                                // @ts-ignore
                                CustomerContextualPrice: props.data.cartLine.PeriodicDiscount
                            }} : {price: {
                                CustomerContextualPrice: props.data.cartLine.DiscountAmountWithoutTax,
                                BasePrice: props.data.cartLine.DiscountAmount
                            }}}
                            context={props.context}
                            id={props.id}
                            typeName={props.typeName}
                        />
                    </span>
                    <span>
                        {` (${discountLine.Percentage !== undefined ? discountLine.Percentage : ''}%)`}
                     </span>
                </div>
            );
        });
    }
};

// tslint:disable-next-line:max-func-body-length
const CartLine: React.FC<ICartLineProps> = (props: ICartLineProps) => {
    const { isSalesLine, productUrl, resources } = props;
    const { product } = props.data;

    const destructDimensionStrings = {
        sizeString: resources.sizeString,
        colorString: resources.colorString,
        styleString: resources.styleString,
        configString: resources.configString
    };

    const productDimensions = CartLineItemFunctions.renderProductDimensions(product, destructDimensionStrings);
    const renderDisountLines = CartLineItemFunctions.renderDiscountLines(props);

    const onChange = (newValue: number) => {
        if (props.quantityOnChange) {
            props.quantityOnChange(props.data.cartLine, newValue);
        }
    };

    const _generateQuantityandPrice = (): JSX.Element[] | null => {
        const nodes = [];
        if(props.isOutOfStock) {
            return null;
        }
        if(props.isQuantityEditable) {
            nodes.push(
                <div className='msc-cart-line__product-quantity'>
                    <div className='msc-cart-line__product-quantity-label'>{resources.quantityDisplayString}</div>

                    <Quantity
                        id={`msc-cart-line__quantity_${props.data.product.RecordId}`}
                        max={props.maxQuantity || 10}
                        currentCount={props.currentQuantity}
                        onChange={onChange}
                        inputQuantityAriaLabel={resources.inputQuantityAriaLabel}
                        decrementButtonAriaLabel={resources.decrementButtonAriaLabel}
                        incrementButtonAriaLabel={resources.incrementButtonAriaLabel}
                    />
                </div>
            );
        } else  {
            nodes.push(
                <div className='msc-cart-line__quantity'>
                    <label className='quantity-label'>{resources.quantityDisplayString}:</label>
                    <span className='quantity-value'>{props.data.cartLine.Quantity}</span>
                </div>
            );
        }

        nodes.push(
            <div className='msc-cart-line__product-savings'>
                <PriceComponent
                    data={isSalesLine ? {price: {
                        // @ts-ignore
                        CustomerContextualPrice: props.data.cartLine.NetAmount,
                        BasePrice: props.data.cartLine.Price
                    }} : {price: {
                        CustomerContextualPrice: props.data.cartLine.NetAmountWithoutTax,
                        BasePrice: props.data.cartLine.NetPrice
                    }}}
                    context={props.context}
                    id={props.id}
                    typeName={props.typeName}
                    className='msc-cart-line__product-savings-actual'
                />
                {
                    props.data.cartLine.DiscountAmount && props.data.cartLine.DiscountAmount > 0 &&
                    <>
                        <span>{` ${props.resources.discountStringText || 'Discount'} `}</span>
                        <PriceComponent
                            data={props.isSalesLine ? {price: {
                                // @ts-ignore
                                CustomerContextualPrice: props.data.cartLine.PeriodicDiscount
                            }} : {price: {
                                CustomerContextualPrice: props.data.cartLine.DiscountAmountWithoutTax,
                                BasePrice: props.data.cartLine.DiscountAmount
                            }}}
                            context={props.context}
                            id={props.id}
                            typeName={props.typeName}
                            className='msc-cart-line__product-savings-text'
                        />
                    </> ||
                    null
                }
            </div>
        );

        return nodes;
    };

    return (
        <div className='msc-cart-line'>
            <div className='msc-cart-line__product-image'>
                <Image src={props.primaryImageUrl || ''} altText={product.Name} gridSettings={props.gridSettings} imageSettings={props.imageSettings} loadFailureBehavior='empty' />
            </div>
            <div className='msc-cart-line__content'>
                <div className='msc-cart-line__product'>
                    <a className='msc-cart-line__product-title' href={productUrl}>{product.Name}</a>
                    {productDimensions.length > 0 ?
                        <div className='msc-cart-line__product-variants'>{productDimensions}</div> :
                        ''
                    }
                    <div className='msc-cart-line__product-price'>
                        <PriceComponent
                            data={isSalesLine ? {price: {
                                // @ts-ignore
                                CustomerContextualPrice: props.data.cartLine.NetAmount,
                                BasePrice: props.data.cartLine.Price
                            }} : {price: {
                                CustomerContextualPrice: props.data.cartLine.NetAmountWithoutTax,
                                BasePrice: props.data.cartLine.NetPrice
                            }}}
                            context={props.context}
                            id={props.id}
                            typeName={props.typeName}
                            className='discount-value'
                        />
                    </div>
                    {renderDisountLines}
                </div>
                {
                    _generateQuantityandPrice()
                }
            </div>
        </div>
    );
};

export default CartLine;