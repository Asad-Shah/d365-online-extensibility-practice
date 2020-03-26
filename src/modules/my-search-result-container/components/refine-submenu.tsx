/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as React from 'react';

import { Button, Collapse } from '@msdyn365-commerce-modules/utilities';
import { IProductRefinerHierarchy } from '@msdyn365-commerce/commerce-entities';
import {ICoreContext} from '@msdyn365-commerce/core';
import { ProductRefinerValue } from '@msdyn365-commerce/retail-proxy';
import RangeRefineItem, { RangeRefineItemType } from './range-refine-item';
import RefineItem from './refine-item';
import { IRefineItemToggleNotification } from './refine-item-toggle-notification';
import { IRefineItemCommonProps } from './refine-item.props.common';
import { findMatchingRefinementCriterion, ProductRefinerTypeValue, ProductRefinerValueDataTypeValue } from './utilities';

/**
 * Properties associated with the RefineSubmenu component
 */
export interface IRefineSubmenuProps {
    tempRangeTypeTODO: RangeRefineItemType;
    minValueSliderThumbAriaLabel?: string;
    maxValueSliderThumbAriaLabel?: string;
    productRefinerHierarchy: IProductRefinerHierarchy;
    selectedRefinerValues: ProductRefinerValue[];
    refineItemCommonProps: IRefineItemCommonProps;
    isDisabled: boolean;
    isExpandedOnInitialLoad: boolean;
    context: ICoreContext;
    moduleId: string;
    moduleTypeName: string;
    onUpdateRefiners(notfication: Readonly<IRefineItemToggleNotification>): void;
    urlBuilder(refiner: IRefineItemToggleNotification): string;
}

/**
 * Refine submenu state
 */
export interface IRefineSubmenuState extends React.ComponentState {
    expanded: boolean;
}

/**
 *
 * The RefineSubmenu component renders the submenu category and child items.
 * This computed observes the stateful category hierarchy object.
 * @extends {React.PureComponent<IRefineSubmenuProps>}
 */
class RefineSubmenu extends React.Component<IRefineSubmenuProps, IRefineSubmenuState> {
    constructor(props: IRefineSubmenuProps) {
        super(props);

        this._onToggleItem = this._onToggleItem.bind(this);
        this._onToggleSubmenu = this._onToggleSubmenu.bind(this);

        let isExpanded = this.props.isExpandedOnInitialLoad;
        if (this.props.productRefinerHierarchy.DataTypeValue === ProductRefinerValueDataTypeValue.Range) {
            isExpanded = true;
        }

        this.state = {
            expanded: isExpanded
        };
    }

    public render(): JSX.Element | null {
        const { productRefinerHierarchy, refineItemCommonProps } = this.props;

        if (!productRefinerHierarchy) {
            refineItemCommonProps.telemetry.error('Cannot render submenu without refiner hierarchy data');
        }

        return (
            <div className='ms-refine-submenu list-group'>
                <Button
                    className={this.state.expanded? 'ms-refine-submenu__toggle_expanded' : 'ms-refine-submenu__toggle_collapsed'}
                    aria-label= {productRefinerHierarchy.KeyName || 'refiner.Name'}
                    onClick={this._onToggleSubmenu}
                    aria-expanded={this.state.expanded}
                >
                {productRefinerHierarchy.KeyName}
                </Button>
                <Collapse isOpen={this.state.expanded} timeout={350}>
                    {this._renderChildItems(productRefinerHierarchy)}
                </Collapse>
            </div>
        );
    }

    private _renderChildItems(productRefinerHierarchy: IProductRefinerHierarchy): JSX.Element | null {
        switch (productRefinerHierarchy.DataTypeValue) {
            case ProductRefinerValueDataTypeValue.Range:
            case ProductRefinerValueDataTypeValue.RangeInput:
                return this._renderRange(productRefinerHierarchy);
            default:
                return this._renderSingleMultiSelect(productRefinerHierarchy);
        }
    }

    private _renderSingleMultiSelect(productRefinerHierarchy: IProductRefinerHierarchy): JSX.Element | null {
        const { isDisabled, refineItemCommonProps, selectedRefinerValues, context } = this.props;
        const isSingleSelect = productRefinerHierarchy.RefinerTypeValue === ProductRefinerTypeValue.Single;
        const role = isSingleSelect ? { role: 'radiogroup' } : undefined;
        const refinerValuesList = (productRefinerHierarchy.Values || []);
        const listItems = refinerValuesList.map((child: ProductRefinerValue, index: number) => {
            if (!child) {
                refineItemCommonProps.telemetry.error(
                    `[refine-submenu] Could not render refine item for refiner ${productRefinerHierarchy.RecordId} (${productRefinerHierarchy.KeyName})`
                );
                return null;
            }

            const selectedRefinementCriterion = findMatchingRefinementCriterion(child, selectedRefinerValues);

            return (
                <RefineItem
                    parentProductRefinerHierarchy={productRefinerHierarchy}
                    productRefinerValue={child}
                    selectedRefinementCriterion={selectedRefinementCriterion}
                    refineItemCommonProps={refineItemCommonProps}
                    onToggle={this._onToggleItem}
                    urlBuilder={this.props.urlBuilder}
                    isDisabled={isDisabled}
                    key={index}
                    context = {context}
                    moduleId={this.props.moduleId}
                    moduleTypeName={this.props.moduleTypeName}
                />
            );
        });
        return (
            <ul className='ms-refine-submenu__list' {...role} aria-label={productRefinerHierarchy.KeyName}>
                {listItems}
            </ul>
        );
    }

    private _renderRange(productRefinerHierarchy: IProductRefinerHierarchy): JSX.Element | null {
        const { isDisabled, refineItemCommonProps, selectedRefinerValues, context, minValueSliderThumbAriaLabel, maxValueSliderThumbAriaLabel } = this.props;
        const submenuClassNamePrefix = 'ms-refine-submenu__item list-group-item refine-submenu__item';
        const refinerValuesList = (productRefinerHierarchy.Values || []);
        const listItems = refinerValuesList.map((child: ProductRefinerValue, index: number) => {
            if (!child) {
                refineItemCommonProps.telemetry.error(
                    `Could not render refine item for refiner ${productRefinerHierarchy.RecordId} (${productRefinerHierarchy.KeyName})`
                );
                return null;
            }

            const selectedRefinementCriterion = findMatchingRefinementCriterion(child, selectedRefinerValues);

            // TODO BUGBUG 22424559 determine only from the DataTypeValue once live example is working (can test with the tempRangeTypeTODO derived from QSP until then)
            const rangeType = (productRefinerHierarchy.DataTypeValue === ProductRefinerValueDataTypeValue.RangeInput || this.props.tempRangeTypeTODO === 'input') ?
                'input' :
                'slider';
            const key = selectedRefinementCriterion ? `${selectedRefinementCriterion.LeftValueBoundString}-${selectedRefinementCriterion.RightValueBoundString}` : `not-selected-${index}`;
            return (
                <li className={`${submenuClassNamePrefix}--range`} key={index}>
                    <RangeRefineItem
                        parentProductRefinerHierarchy={productRefinerHierarchy}
                        productRefinerValue={child}
                        selectedRefinementCriterion={selectedRefinementCriterion}
                        refineItemCommonProps={refineItemCommonProps}
                        onToggle={this._onToggleItem}
                        urlBuilder={this.props.urlBuilder}
                        isDisabled={isDisabled}
                        rangeType={rangeType}
                        key={key}
                        context={context}
                        minValueSliderThumbAriaLabel={minValueSliderThumbAriaLabel}
                        maxValueSliderThumbAriaLabel={maxValueSliderThumbAriaLabel}
                        moduleId={this.props.moduleId}
                        moduleTypeName={this.props.moduleTypeName}
                    />
                </li>
            );
        });
        return <ul className='ms-refine-submenu__list list-unstyled'>{listItems}</ul>;
    }

    private _onToggleItem(itemToggleNotification: IRefineItemToggleNotification): void {
        this.props.onUpdateRefiners(itemToggleNotification);
    }

    private _onToggleSubmenu(): void {
        this.setState(prevState => ({
            expanded: !prevState.expanded
        }));
    }
}

export default RefineSubmenu;