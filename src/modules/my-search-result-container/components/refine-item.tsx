import { IProductRefinerHierarchy } from '@msdyn365-commerce/commerce-entities';
import { RatingComponent } from '@msdyn365-commerce/components';
import { ICoreContext } from '@msdyn365-commerce/core';
import { ProductRefinerValue } from '@msdyn365-commerce/retail-proxy';
import * as React from 'react';
import { IRefineItemToggleNotification } from './refine-item-toggle-notification';
import { IRefineItemCommonProps } from './refine-item.props.common';
import { ProductRefinerSource, ProductRefinerTypeValue } from './utilities';

/**
 * RefineItem properties
 */
export interface IRefineItemProps {

    parentProductRefinerHierarchy: IProductRefinerHierarchy;
    productRefinerValue: ProductRefinerValue;
    selectedRefinementCriterion: ProductRefinerValue | undefined;
    refineItemCommonProps: IRefineItemCommonProps;
    isDisabled: boolean;
    context: ICoreContext;
    moduleId: string;
    moduleTypeName: string;
    onToggle(notfication: Readonly<IRefineItemToggleNotification>): void;
    urlBuilder(refiner: IRefineItemToggleNotification): string;
}

/**
 * Refine item state
 */
export interface IRefineItemState extends React.ComponentState {
    isChecked: boolean;
    renderingError?: object;
}

/**
 * Single-select and multi-select refine item component (controlled by RefineSubmenu)
 */
export default class RefineItem extends React.Component<IRefineItemProps, IRefineItemState> {
    private anchorType: React.RefObject<HTMLAnchorElement>;

    constructor(props: IRefineItemProps) {
        super(props);
        this._onClick = this._onClick.bind(this);
        this.state = {
            isChecked: !!this.props.selectedRefinementCriterion
        };
        this.anchorType = React.createRef();
    }

    public render(): JSX.Element | undefined {
        const {
            isDisabled,
            refineItemCommonProps,
            parentProductRefinerHierarchy,
            productRefinerValue,
            selectedRefinementCriterion,
            children,
            onToggle,
            context,
            ...attrs
        } = this.props;
        if (!productRefinerValue) {
            refineItemCommonProps.telemetry.error('[refine-item] Cannot render refineItem without productRefinerValue');
            return undefined;
        }
        if (!productRefinerValue.LeftValueBoundString) {
            refineItemCommonProps.telemetry.warning(`[refine-item]  RefineItem without LeftValueBoundString: ${JSON.stringify(productRefinerValue)}`);
        }
        const isSingleSelect = parentProductRefinerHierarchy.RefinerTypeValue === ProductRefinerTypeValue.Single;
        let itemTypeClassName = isSingleSelect ? 'single-select' : 'multi-select';
        itemTypeClassName = `ms-refine-submenu-item ${itemTypeClassName}`;
        const inputType = isSingleSelect ? 'radio' : 'checkbox';
        const role = isSingleSelect ? 'radio' : undefined;
        itemTypeClassName = !!selectedRefinementCriterion ? `${itemTypeClassName}-checked` : itemTypeClassName;
        if (parentProductRefinerHierarchy.SourceValue === ProductRefinerSource.Rating) {
            if (productRefinerValue.LeftValueBoundString) {
                return (
                    <li
                        className='ms-refine-submenu-item'
                        role='radio'
                        aria-checked='false'
                        id={`${parentProductRefinerHierarchy.KeyName! }_${productRefinerValue.LeftValueBoundLocalizedString}`}
                        aria-label={`${parentProductRefinerHierarchy.KeyName!}_${productRefinerValue.LeftValueBoundLocalizedString}`}
                    >
                        <a
                            href={this._getRefinerUrl()}
                            aria-label={`${parentProductRefinerHierarchy.KeyName!}_${productRefinerValue.LeftValueBoundLocalizedString}`}
                            onClick={this._onClick}
                        >
                            <RatingComponent
                                avgRating={parseInt(productRefinerValue.LeftValueBoundString, 10)}
                                ratingCount={productRefinerValue.LeftValueBoundLocalizedString ? productRefinerValue.LeftValueBoundLocalizedString : productRefinerValue.LeftValueBoundString}
                                hideCount={false}
                                readOnly={true}
                                ariaLabel=''
                                context={context}
                                id={this.props.moduleId}
                                typeName={this.props.moduleTypeName}
                                data={{}}
                            />
                            <span className='refine-submenu-item__rating'>{productRefinerValue.Count !== undefined && `(${productRefinerValue.Count})`}</span>
                        </a>
                    </li>
                );
            } else {
                return undefined;
            }
        } else {
            return (
                <li className='ms-refine-submenu-item' role={role} id={`${parentProductRefinerHierarchy.KeyName!}_${productRefinerValue.LeftValueBoundString}`}>
                    <a
                        key={!!selectedRefinementCriterion ? 'true' : 'false'}
                        ref={this.anchorType}
                        href={this._getRefinerUrl()}
                        tabIndex={0}
                        onClick={this._onClick}
                        className={itemTypeClassName}
                        role={inputType}
                        aria-checked={!!selectedRefinementCriterion}
                        {...attrs}
                    >
                        <span className='ms-refine-submenu-item__label'>
                            {productRefinerValue.LeftValueBoundLocalizedString || productRefinerValue.LeftValueBoundString}
                            {productRefinerValue.Count !== undefined && ` (${productRefinerValue.Count})`}
                        </span>
                    </a>
                </li>
            );
        }
    }

    private _getRefinerUrl(): string {
        const { urlBuilder, parentProductRefinerHierarchy, productRefinerValue, selectedRefinementCriterion } = this.props;

        if (productRefinerValue) {
            return urlBuilder({
                parentProductRefinerHierarchy: parentProductRefinerHierarchy,
                productRefinerValue: productRefinerValue,
                isSelecting: !selectedRefinementCriterion
            });
        }

        return '';
    }

    private _onClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLInputElement>): void => {
        e.preventDefault();

        const { parentProductRefinerHierarchy, productRefinerValue, selectedRefinementCriterion } = this.props;
        if (productRefinerValue) {
            this.props.onToggle({
                parentProductRefinerHierarchy: parentProductRefinerHierarchy,
                productRefinerValue: productRefinerValue,
                isSelecting: !selectedRefinementCriterion
            });

            setTimeout(
                () => {
                    this.anchorType.current && this.anchorType.current.focus();
                },
                0
            );
        }
    }
}