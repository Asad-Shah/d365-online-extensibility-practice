import { IProductRefinerHierarchy } from '@msdyn365-commerce/commerce-entities';
import { ProductRefinerValue } from '@msdyn365-commerce/retail-proxy';
import classnames from 'classnames';
import { get } from 'lodash';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { IChoiceSummaryProps } from './choice-summary.props';
import { isMatchingRefinementCriterion, ProductRefinerValueDataTypeValue } from './utilities';

interface IRefinerMap {
    key: string;
    value: ProductRefinerValue;
}

 /**
  * ChoiceSummary component
  */
@observer
export default class ChoiceSummary extends React.Component<IChoiceSummaryProps> {
    private closeButtonGlyph: string = 'msi-close-btn';

    @computed get selectedRefinersMap(): IRefinerMap[] {
        const { selectedChoices } = this.props;
        return selectedChoices.map((selectedRefiner: ProductRefinerValue) => {
            return {
                key: this._getKeyForRefinerValue(selectedRefiner),
                value: selectedRefiner
            } as IRefinerMap;
        });
    }

    constructor(props: Readonly<IChoiceSummaryProps>) {
        super(props);
    }

    public render(): JSX.Element {
        const { clearAllText, label, classNames, choiceAriaLabel } = this.props;
        const items = this.selectedRefinersMap;
        return (
            <div className='msc-choice-summary'>
                {items.length > 0 && label && <span className='msc-choice-summary__label'>{label}</span>}
                <ul className={classnames(classNames, 'msc-choice-summary__list', 'list-unstyled')}>
                    {items.map((item: IRefinerMap, index: number) => {
                        const listItemProps = {
                            'aria-posinset': index,
                            'aria-setsize': items.length
                        };

                        return (
                            <li className='msc-choice-summary__list-item' key={item.key} {...listItemProps}>
                                <a
                                    className='msc-choice-summary__item'
                                    href={this.props.urlBuilder(item.value, false)}
                                    aria-label={`${item.key} ${choiceAriaLabel}`}
                                    onClick={this._onClick}
                                >
                                    {item.key}
                                    <span className={`${this.closeButtonGlyph} msc-choice-summary__glyph`} />
                                </a>
                            </li>
                        );
                    })}
                </ul>
                {items.length > 0 && clearAllText && <a href={this.props.urlBuilder({}, true)} className={'msc-choice-summary__clear-all'} onClick={this._onClick}>{clearAllText}</a>}
            </div>
        );
    }

    private _getKeyForRefinerValue(productRefinerValue: ProductRefinerValue): string {
        const { choiceFormat, choiceRangeValueFormat, refinerHierarchy, telemetry } = this.props;
        const overallFormat = choiceFormat || '{1}';
        const rangeFormat = choiceRangeValueFormat;
        let refinerName = '';
        if (refinerHierarchy && refinerHierarchy.find) {
            const parent = refinerHierarchy.find(
                (hierarchy: IProductRefinerHierarchy) =>
                    !!hierarchy.Values.find((value: ProductRefinerValue) => isMatchingRefinementCriterion(value, productRefinerValue))
            );

            if (!parent) {
                telemetry.warning('[choice-summary] could not find parent of selected refiner value');
            } else {
                refinerName = parent.KeyName || '';
            }
        }

        let refinerValueName: string;
        switch (productRefinerValue.DataTypeValue) {
            case ProductRefinerValueDataTypeValue.Range:
            case ProductRefinerValueDataTypeValue.RangeInput:
                refinerValueName = rangeFormat
                    .replace('{0}', this._formatPrice(productRefinerValue.LeftValueBoundString, productRefinerValue.UnitText))
                    .replace('{1}', this._formatPrice(productRefinerValue.RightValueBoundString, productRefinerValue.UnitText));
                break;
            default:
                refinerValueName = productRefinerValue.LeftValueBoundLocalizedString || productRefinerValue.LeftValueBoundString || '';
        }

        return overallFormat.replace('{0}', refinerName).replace('{1}', refinerValueName);
    }

    private _formatPrice(amount: string | undefined, currency: string | undefined): string {
        if (!amount || !currency) {
            this.props.telemetry.trace('[choice-summary] could not format price');
            return amount || '';
        }
        const priceAmount = (amount && Number(amount)) || 0;
        const locale = get(this.props, 'context.request.locale', 'en-US');
        let result: string;

        try {
            result = new Intl.NumberFormat(locale, {
                style: 'currency',
                currencyDisplay: 'symbol',
                currency: currency,
                minimumFractionDigits: 0
            }).format(priceAmount);
        } catch (e) {
            result = `${priceAmount} ${currency}`;
            this.props.telemetry.warning(`Failed to format price for ${result}: ${e}`);
        }

        return result;
    }

    private _onClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        e.stopPropagation();

        const target = e.currentTarget as HTMLElement;
        const clearAll = target.getAttribute('class')!.indexOf('choice-summary__clear-all') > -1;
        const selectedRefiner = clearAll ? undefined : this._getSelectedRefinerChoice(target);

        if (this.props.onChoiceClicked) {
            this.props.onChoiceClicked({
                clearAll: clearAll,
                itemClicked: target,
                choiceClicked: selectedRefiner,
                nextItemToFocus: target.nextSibling as HTMLElement
            });
        }
    }

    private _getSelectedRefinerChoice(itemClicked: HTMLElement): ProductRefinerValue | undefined {
        const result = this.selectedRefinersMap.find(selected => (itemClicked.innerText && itemClicked.innerText.trim()) === selected.key);
        return (result && result.value) || undefined;
    }
}
