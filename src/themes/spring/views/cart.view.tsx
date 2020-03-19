/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

import {
    ICartlinesViewProps,
    ICartResources,
    ICartViewProps
} from '@msdyn365-commerce-modules/cart';

import { IOrderSummaryLines } from '@msdyn365-commerce-modules/order-summary-utilities';
import { Button, INodeProps, Node } from '@msdyn365-commerce-modules/utilities';

const CartView: React.FC<ICartViewProps> = (props: ICartViewProps) => (
    <div className={props.className} id={props.id} {...props.renderModuleAttributes(props)}>
        {props.title}
        <Node {...props.CartlinesWrapper}>
            {_renderCartlines(props.cartlines, props.resources, props.storeSelector, props.backToShoppingButton, props.waitingComponent, props.cartLoadingStatus, props.cartDataResult)}
        </Node>
        {props.orderSummaryHeading &&
            < Node {...props.OrderSummaryWrapper}>
                {props.orderSummaryHeading}
                {_renderOrderSummarylines(props.orderSummaryLineitems, props.OrderSummaryItems, props)}
                {props.checkoutAsSignInUserButton}
                {props.checkoutAsGuestButton}
                {props.backToShoppingButton}
            </Node>
        }
        {props.storeSelector}
    </div>
);

const _renderCartlines = (cartLines: ICartlinesViewProps[] | undefined, resources: ICartResources, storeSelector: React.ReactNode | undefined,
                          backToShoppingButton: React.ReactNode, waitingComponent: React.ReactNode, cartLoadingStatus: string, cartDataResult: boolean): JSX.Element[] | JSX.Element => {

    const { emptyCartText } = resources;

    if (cartLoadingStatus) {
        return <>{cartLoadingStatus}</>;
    }
    if (cartLines) {
        return cartLines.map((cartLine, index) => {
            return (
                <div className='msc-cart-lines-item' key={index}>
                    {cartLine.cartline}
                    {_renderBOPISBlock(cartLine, resources, storeSelector)}
                    {cartLine.addToWishlist}
                    {cartLine.remove}
                </div>
            );
        });
    } else {
        return (cartDataResult ?
            (
                <div className='msc-cart__empty-cart'>
                    <p className='msc-cart-line'>{emptyCartText}</p>
                    {backToShoppingButton}
                </div>
            ) : <>{waitingComponent}</>
        );
    }
};

const _renderBOPISBlock = (cartLine: ICartlinesViewProps, resources: ICartResources, storeSelector: React.ReactNode | undefined): JSX.Element | null => {
    if (!cartLine.pickUpInStore || !storeSelector) {
        return null;
    }

    const { shipInsteadDisplayText, shipToAddressDisplayText, pickItUpDisplayText, pickUpAtStoreWithLocationText, changeStoreDisplayText } = resources;

    const isBopisSelected = cartLine.pickUpInStore.isBopisSelected;
    const toggleBopis = (event: React.MouseEvent<HTMLElement>) => { return cartLine.pickUpInStore && cartLine.pickUpInStore.callbacks.toggleBopis(!isBopisSelected); };
    const changeStore = (event: React.MouseEvent<HTMLElement>) => { return cartLine.pickUpInStore && cartLine.pickUpInStore.callbacks.toggleBopis(true); };

    return (
        <Node {...cartLine.pickUpInStore.ContainerProps}>
            <div className='msc-cart-line__bopis-method'>
                {isBopisSelected ? <span className='pick-up'>{pickUpAtStoreWithLocationText}</span> : <span className='ship'>{shipToAddressDisplayText}</span>}
            </div>
            {
                isBopisSelected &&
                <div className='msc-cart-line__bopis-fullfilment'>
                    <span className='msc-cart-line__bopis-fullfilment-store'>{cartLine.pickUpInStore.orgUnitName}</span>
                    <Button className='msc-cart-line__bopis-changestore' onClick={changeStore}>{changeStoreDisplayText}</Button>
                </div>
            }
            <Button className='msc-cart-line__bopis-btn' onClick={toggleBopis}>{isBopisSelected ? shipInsteadDisplayText : pickItUpDisplayText}</Button>
        </Node>
    );
}

const _renderOrderSummarylines = (orderSummaryLines: IOrderSummaryLines | undefined, OrderSummaryItems: INodeProps, props: ICartViewProps): JSX.Element | null => {
    if (!orderSummaryLines) {
        return null;
    }
    return (
        <Node {...OrderSummaryItems}>
            {props.promoCode}
            {orderSummaryLines.subtotal}
            {orderSummaryLines.shipping}
            {orderSummaryLines.tax}
            {orderSummaryLines.totalDiscounts ? orderSummaryLines.totalDiscounts : null}
            {orderSummaryLines.orderTotal}
        </Node>
    );
};
export default CartView;