/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as React from 'react';
import { ISampleButtonViewProps } from './sample-button';
import { SampleStateInput } from '../../actions/sample-state';


export default class SampleButtonView extends React.Component<ISampleButtonViewProps> {
    constructor(props: ISampleButtonViewProps) {
        super(props);
        this._onClick.bind(this);
    }
    public render(): JSX.Element {
        return (
            <button onClick={this._onClick}>
                Click Me!
            </button>
        );
    }

    // OnClick Handler should update application state
    private _onClick = (e: React.MouseEvent): void => {
        if (this.props.data.sampleState.result) {
            // This will directly update our application state, which should trigger all modules observing the state to update
            this.props.context.actionContext.update(new SampleStateInput(), { clickCount: this.props.data.sampleState.result.clickCount + 1 });
        }
    }
}
