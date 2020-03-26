import { Slider } from '@msdyn365-commerce-modules/utilities';
import debounce from 'lodash/debounce';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { formatPrice } from './utilities';

type InputType = 'Min' | 'Max';

import { IRefineItemProps, IRefineItemState } from './refine-item';

export type RangeRefineItemType = 'slider' | 'input';

/**
 * Range refine item properties
 */
export interface IRangeRefineItemProps extends IRefineItemProps {
    rangeType: RangeRefineItemType;
    minValueSliderThumbAriaLabel?: string;
    maxValueSliderThumbAriaLabel?: string;
}

/**
 * Range refine item state
 */
export interface IRangeRefineItemState extends IRefineItemState {
    validationErrorMin: string | undefined;
    validationErrorMax: string | undefined;
    selectedMin: string | undefined;
    selectedMax: string | undefined;
    touchedMin: boolean;
    touchedMax: boolean;
}

/**
 * RangeRefineItem component (controlled by RefineSubmenu)
 */
@observer
export default class RangeRefineItem extends React.Component<IRangeRefineItemProps, IRangeRefineItemState> {
    private _formattedPriceReverseLookup: Map<string, string> = new Map();

    private minInput: React.RefObject<HTMLInputElement>;
    private maxInput: React.RefObject<HTMLInputElement>;

    @computed get currencyCode(): string {
        return this.props.productRefinerValue.UnitText || '';
    }

    constructor(props: IRangeRefineItemProps) {
        super(props);
        this._onRangeUpdate = this._onRangeUpdate.bind(this);
        this._onRangeUpdateEnd = this._onRangeUpdateEnd.bind(this);
        this._handleRangeTooltipText = this._handleRangeTooltipText.bind(this);
        this._changeMin = this._changeMin.bind(this);
        this._changeMax = this._changeMax.bind(this);
        this._finishChangeMin = this._finishChangeMin.bind(this);
        this._finishChangeMax = this._finishChangeMax.bind(this);

        this.minInput = React.createRef<HTMLInputElement>();
        this.maxInput = React.createRef<HTMLInputElement>();

        const { selectedRefinementCriterion } = this.props;
        const initialMin = selectedRefinementCriterion && selectedRefinementCriterion.LeftValueBoundString || '0';
        const initialMax = selectedRefinementCriterion && selectedRefinementCriterion.RightValueBoundString || undefined;
        this.state = {
            isChecked: false,
            validationErrorMin: undefined,
            validationErrorMax: undefined,
            selectedMin: initialMin,
            selectedMax: initialMax,
            touchedMin: false,
            touchedMax: false
        };
    }

    public render(): JSX.Element | undefined {
        const { productRefinerValue, parentProductRefinerHierarchy, refineItemCommonProps } = this.props;

        if (!productRefinerValue || !parentProductRefinerHierarchy) {
            refineItemCommonProps.telemetry.error('Cannot render refine value range without productRefinerValue and parentProductRefinerHierarchy');
            return undefined;
        }

        if (this.props.rangeType === 'input') {
            return this._renderInputFields();
        }

        return this._renderSlider();
    }

    private _renderInputFields(): JSX.Element | undefined {
        const { isDisabled, parentProductRefinerHierarchy, refineItemCommonProps } = this.props;
        const { selectedMin, selectedMax, touchedMin, touchedMax, validationErrorMin, validationErrorMax } = this.state;

        const rangeAriaLabel = (refineItemCommonProps.rangeNameFormat || '{0}').replace('{0}', (parentProductRefinerHierarchy.KeyName || ''));
        const formAttrs = {
            'aria-label': rangeAriaLabel,
            'aria-disabled': isDisabled
        };

        // To enable price formatting of selected fields, this is the approach:
        // initial value: min=0 formatted as price, max=undefined
        // onFocus/onChange: convert to number (unformat) and mark as touched to indicate value is being edited
        // onBlur: validate and format entered value as price
        const minInputClassName = `ms-refine-submenu__input-range refine-submenu__input-range-min ${validationErrorMin ? 'refine-submenu__input-range--error' : ''}`;
        const maxInputClassName = `ms-refine-submenu__input-range refine-submenu__input-range-max ${validationErrorMax ? 'refine-submenu__input-range--error' : ''}`;
        const minLabelClassName = 'ms-refine-submenu__input-range-label refine-submenu__input-range-label-min';
        const maxLabelClassName = 'ms-refine-submenu__input-range-label refine-submenu__input-range-label-max';
        const formattedSelectedMin = this._getFormattedSelectedValue(selectedMin, touchedMin, validationErrorMin);
        const formattedSelectedMax = this._getFormattedSelectedValue(selectedMax, touchedMax, validationErrorMax);
        return (
            <form className='ms-refine-submenu__input-range-refiner' {...formAttrs}>
                <label className={minLabelClassName}>
                    {refineItemCommonProps.minLabel}
                    <input
                        className={minInputClassName}
                        onChange={this._changeMin}
                        onFocus={this._changeMin}
                        onBlur={this._finishChangeMin}
                        value={formattedSelectedMin}
                        ref={this.minInput}
                    />
                </label>
                <label className={maxLabelClassName}>
                    {refineItemCommonProps.maxLabel}
                    <input
                        className={maxInputClassName}
                        placeholder={formattedSelectedMax ? undefined : refineItemCommonProps.placeholderTextMax}
                        onChange={this._changeMax}
                        onFocus={this._changeMax}
                        onBlur={this._finishChangeMax}
                        value={formattedSelectedMax}
                        ref={this.maxInput}
                    />
                </label>
                {validationErrorMin &&
                    <span className='ms-refine-submenu__input-range-error-text refine-submenu__input-range-min-error-text'>{validationErrorMin}</span>
                }
                {validationErrorMax && validationErrorMin !== validationErrorMax &&
                    <span className='ms-refine-submenu__input-range-error-text refine-submenu__input-range-max-error-text'>{validationErrorMax}</span>
                }
            </form>
        );
    }

    private _renderSlider(): JSX.Element | undefined {
        const { isDisabled, productRefinerValue, parentProductRefinerHierarchy, selectedRefinementCriterion } = this.props;
        const min = productRefinerValue.LeftValueBoundString;
        const max = productRefinerValue.RightValueBoundString;
        const selectedMin = selectedRefinementCriterion && selectedRefinementCriterion.LeftValueBoundString || productRefinerValue.LeftValueBoundString || '0';
        const selectedMax = selectedRefinementCriterion && selectedRefinementCriterion.RightValueBoundString || productRefinerValue.RightValueBoundString || max;
        const sliderId = `slider_${parentProductRefinerHierarchy.RecordId}_${productRefinerValue.RefinerRecordId}`;
        const ariaAttributes = {
            'aria-disabled': isDisabled
        };

        const minPrice = this._formatPrice(min);
        const maxPrice = this._formatPrice(max);
        const selectedMinPrice =this._formatPrice(selectedMin);
        const selectedMaxPrice =this._formatPrice(selectedMax);

        return (
            <Slider
                className={'ms-refine-submenu__range-refiner'}
                key={sliderId}
                id={sliderId}
                inForm={false}
                min={min && Number(min) || undefined}
                max={max && Number(max) || undefined}
                step={1}
                orientation={'horizontal'}
                labels={[
                    {
                        labelId: `${sliderId}_start`,
                        labelString: `${minPrice}`,
                        labelPositioning: 'start'
                    },
                    {
                        labelId: `${sliderId}_end`,
                        labelString: `${maxPrice}`,
                        labelPositioning: 'end'
                    }
                ]}
                showLabels={true}
                showTooltip={true}
                sliderThumbs={[
                    {
                        id: `${sliderId}_slider_thumb_start`,
                        value: selectedMin && Number(selectedMin) || 0,
                        ariaLabel: `${this.props.minValueSliderThumbAriaLabel} ${this.currencyCode}`,
                        ariaValueText: `${selectedMinPrice}`
                    },
                    {
                        id: `${sliderId}_slider_thumb_end`,
                        value: Number(selectedMax) || Number(maxPrice),
                        ariaLabel: `${this.props.maxValueSliderThumbAriaLabel} ${this.currencyCode}`,
                        ariaValueText: `${selectedMaxPrice}`
                    }
                ]}
                onChangeEnd={this._onRangeUpdateEnd}
                onChange={debounce(this._onRangeUpdate, 500)}
                handleTooltipText={this._handleRangeTooltipText}
                {...ariaAttributes}
            />
        );
    }

    private _changeMin(event: React.FocusEvent<HTMLInputElement>): void {
        this._changeValue(event, 'Min');
    }

    private _changeMax(event: React.FocusEvent<HTMLInputElement>): void {
        this._changeValue(event, 'Max');
    }

    private _changeValue(event: React.FocusEvent<HTMLInputElement>, inputType: InputType): void {
        const selectedKey = `selected${inputType}`;
        const touchedKey = `touched${inputType}`;
        this.setState({
            [selectedKey]: this._getInputWithoutFormatting(event.currentTarget.value),
            [touchedKey]: true
        });
    }

    private _finishChangeMin(event: React.FocusEvent<HTMLInputElement>): boolean {
        const selectedMinValue = this._getInputWithoutFormatting(event.currentTarget.value);
        this.setState({
            selectedMin: selectedMinValue,
            minTouched: false
        });
        const minInput = Number(selectedMinValue);
        const { onToggle, parentProductRefinerHierarchy, productRefinerValue, refineItemCommonProps, selectedRefinementCriterion } = this.props;
        const max = selectedRefinementCriterion && selectedRefinementCriterion.RightValueBoundString || undefined;

        const maxNum = max ? Number(max) : undefined;

        if (isNaN(minInput)) {
            this.setState({validationErrorMin: refineItemCommonProps.validationErrorNaN});
            this._focus('Min');
            return false;
        }

        if (this._validateRange(minInput, maxNum)) {
            onToggle({
                parentProductRefinerHierarchy: parentProductRefinerHierarchy,
                productRefinerValue: productRefinerValue,
                isSelecting: true,
                rangeStart: minInput,
                rangeEnd: maxNum
            });
            return true;
        } else {
            this._focus('Min');
        }

        return false;
    }

    private _finishChangeMax(event: React.FocusEvent<HTMLInputElement>): boolean {
        const selectedMaxValue = this._getInputWithoutFormatting(event.currentTarget.value);
        this.setState({
            selectedMax: selectedMaxValue,
            maxTouched: false
        });
        const maxInput = Number(selectedMaxValue);
        const { onToggle, parentProductRefinerHierarchy, productRefinerValue, refineItemCommonProps, selectedRefinementCriterion } = this.props;
        const min = selectedRefinementCriterion && selectedRefinementCriterion.LeftValueBoundString || '0';

        const minNum = Number(min);

        if (isNaN(maxInput)) {
            this.setState({validationErrorMax: refineItemCommonProps.validationErrorNaN});
            this._focus('Max');
            return false;
        }

        if (this._validateRange(minNum, maxInput)) {
            if (productRefinerValue) {
                onToggle({
                    parentProductRefinerHierarchy: parentProductRefinerHierarchy,
                    productRefinerValue: productRefinerValue,
                    isSelecting: true,
                    rangeStart: minNum,
                    rangeEnd: maxInput
                });
            } else {
                this._focus('Max');
            }
            return true;
        }

        return false;
    }

    private _focus(inputType: InputType): void {
        const ref = inputType === 'Max' ? this.maxInput : this.minInput;

        setTimeout(() => {
            if (ref && ref.current) {
                ref.current.focus();
            }
        },         50);
    }

    private _getFormattedSelectedValue(selected: string | undefined, touched: boolean, validationError: string | undefined): string | undefined {
        if (touched || validationError || selected === undefined) {
            return selected;
        }
        return this._formatPrice(selected);
    }

    private _validateRange(min: number, max: number | undefined): boolean {
        const { refineItemCommonProps } = this.props;
        if (max === undefined) {
            return true;
        }

        if (min > max) {
            this.setState({
                validationErrorMin: refineItemCommonProps.validationErrorRange,
                validationErrorMax: refineItemCommonProps.validationErrorRange
            });
            return false;
        }

        return true;
    }

    private _formatPrice(amount: string | undefined): string {
        const locale = this.props.refineItemCommonProps.locale;
        const result = formatPrice(amount, this.currencyCode, locale, this.props.refineItemCommonProps.telemetry);

        if (amount !== undefined && !this._formattedPriceReverseLookup.has(result)) {
            this._formattedPriceReverseLookup.set(result, amount);
        }

        return result;
    }

    private _getInputWithoutFormatting(input: string): string {
        // First try to cast raw input to a number
        const inputAsNum = Number(input);
        if (!isNaN(inputAsNum)) {
            return input;
        }

        // Otherwise try a reverse lookup and fall back to the raw input if all else fails
        const reverseLookupResult = this._formattedPriceReverseLookup.get(input);
        return reverseLookupResult || input;
    }

    // NOTE: Fix types once Shared Components build pipeline bug fixed
    // tslint:disable-next-line:no-any
    private _onRangeUpdate(sliderChangeNotification: any): void {
        // Need to filter out mousemove events as these cause errors after the menu updates and slider re-renders
        if (sliderChangeNotification.eventType !== 'mousemove') {
            const { onToggle, parentProductRefinerHierarchy, productRefinerValue } = this.props;
            if (productRefinerValue && sliderChangeNotification) {
                onToggle({
                    parentProductRefinerHierarchy: parentProductRefinerHierarchy,
                    productRefinerValue: productRefinerValue,
                    isSelecting: true,
                    rangeStart: sliderChangeNotification.firstThumbValue,
                    rangeEnd: sliderChangeNotification.secondThumbValue
                });

                this._focusOnSliderThumb(sliderChangeNotification);
            }
        }
    }

    // tslint:disable-next-line
    private _onRangeUpdateEnd(sliderChangeNotification: any): void {
        const { onToggle, parentProductRefinerHierarchy, productRefinerValue } = this.props;
        if (productRefinerValue && sliderChangeNotification) {
            onToggle({
                parentProductRefinerHierarchy: parentProductRefinerHierarchy,
                productRefinerValue: productRefinerValue,
                isSelecting: true,
                rangeStart: sliderChangeNotification.firstThumbValue,
                rangeEnd: sliderChangeNotification.secondThumbValue
            });

            this._focusOnSliderThumb(sliderChangeNotification);
        }
    }

    // tslint:disable-next-line
    private _focusOnSliderThumb(sliderChangeNotification: any): void {
        if (sliderChangeNotification.id) {
            const element = document.getElementById(sliderChangeNotification.id);
            if (!!element) {
                setTimeout(
                    () => {
                        element.focus();
                },  0);
            }
        }
    }

    private _handleRangeTooltipText(tooltip: number): string {
        return this._formatPrice(`${tooltip}`);
    }
}