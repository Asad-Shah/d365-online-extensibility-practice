import { IProductRefinerHierarchy } from '@msdyn365-commerce/commerce-entities';
import { ITelemetry } from '@msdyn365-commerce/core';
import { ProductRefinerValue } from '@msdyn365-commerce/retail-proxy';

export interface IChoiceSummaryClickNotification {
    itemClicked: HTMLElement;
    choiceClicked: ProductRefinerValue | undefined;
    clearAll: boolean;
    nextItemToFocus: HTMLElement | undefined;
}

export interface IChoiceSummaryProps {
    /** Telemetry from  module. */
    telemetry: ITelemetry;
    /** Custom classNames for the component */
    classNames: string;
    clearAllText: string;
    label?: string;
    choiceFormat?: string;
    choiceRangeValueFormat: string;
    choiceAriaLabel?: string;
    selectedChoices: ProductRefinerValue[];
    refinerHierarchy: IProductRefinerHierarchy[];
    /** Function called onClick of choice summary children */
    onChoiceClicked?(notification: IChoiceSummaryClickNotification): void;
    /** Function to build URL including choice */
    urlBuilder(selectedRefiner: ProductRefinerValue, isClearAll: boolean): string;
}