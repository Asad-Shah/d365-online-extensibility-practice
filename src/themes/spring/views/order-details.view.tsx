/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import {
    IGroup,
    IGroupDelivery,
    IGroups,
    IHelp,
    IOrderDetailsViewProps,
    IOrderInformation,
    IOrderSummary,
    IPaymentMethods,
    ISalesLine
} from '@msdyn365-commerce-modules/order-management';
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

export const OrderInfomation: React.FC<IOrderInformation> = ({
    orderInformationProps,
    salesId,
    createdDate,
    count,
    amount,
    channelReferenceId
}) => (
    <Node {...orderInformationProps}>
        {salesId}
        {createdDate}
        {count}
        {amount}
        {channelReferenceId}
    </Node>
);

export const SalesLine: React.FC<ISalesLine> = ({ salesLineProps, salesLine, buyAgainButton }) => (
    <Node {...salesLineProps}>
        {salesLine}
        {buyAgainButton}
    </Node>
);

export const GroupDelivery: React.FC<IGroupDelivery> = ({ deliveryProps, heading, count, address, trackingInfo }) => (
    <Node {...deliveryProps}>
        {heading}
        {count}
        {address}
        {trackingInfo}
    </Node>
);

export const Group: React.FC<IGroup> = ({ groupProps, delivery, salesLinesProps, salesLines }) => (
    <Node {...groupProps}>
        {delivery && <GroupDelivery {...delivery} />}
        {salesLines && (
            <Node {...salesLinesProps}>
                {salesLines.map(salesLine => (
                    <React.Fragment key={salesLine.data.salesLine.LineId}>
                        <SalesLine {...salesLine} />
                        {salesLine.salesStatus}
                    </React.Fragment>
                ))}
            </Node>
        )}
    </Node>
);

export const Groups: React.FC<IGroups> = ({ groupsProps, groups }) => (
    <Node {...groupsProps}>
        {groups.map((group, index) => (
            <Group key={index} {...group} />
        ))}
    </Node>
);

export const OrderSummary: React.FC<IOrderSummary> = ({ orderSummaryProps, heading, subtotal, shipping, tax, totalAmount, earnedPoints }) => (
    <Node {...orderSummaryProps}>
        {heading}
        {subtotal}
        {shipping}
        {tax}
        {totalAmount}
        {earnedPoints}
    </Node>
);

export const Payment: React.FC<IPaymentMethods> = ({ paymentMethodsProps, title, methods }) => (
    <Node {...paymentMethodsProps}>
        {title}
        {methods}
    </Node>
);

export const Help: React.FC<IHelp> = ({ helpProps, needHelpLabel, helpLineNumberLabel, contactNumber }) => (
    <Node {...helpProps}>
        {needHelpLabel}
        {helpLineNumberLabel}
        {contactNumber}
    </Node>
);

const OrderDetailsView: React.FC<IOrderDetailsViewProps> = ({
    moduleProps,
    heading,
    alert,
    loading,
    orderInfomation,
    orderSummary,
    payment,
    help,
    groups
}) => {
    return (
        <Module {...moduleProps}>
            {heading}
            {alert}
            {loading}
            {orderInfomation && <OrderInfomation {...orderInfomation} />}
            {groups && <Groups {...groups} />}
            {orderSummary && <OrderSummary {...orderSummary} />}
            {payment && <Payment {...payment} />}
            {help && <Help {...help} />}
        </Module>
    );
};

export default OrderDetailsView;
