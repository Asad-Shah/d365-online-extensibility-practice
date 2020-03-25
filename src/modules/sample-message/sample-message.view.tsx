/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as React from 'react';
import { ISampleMessageViewProps } from './sample-message';

export default class SampleMessageView extends React.Component<ISampleMessageViewProps> {

    constructor(props: ISampleMessageViewProps) {
        super(props);
    }
    public render(): JSX.Element {
        if (this.props.data.sampleState.result) {
            return (<h3>The Button has been clicked {this.props.data.sampleState.result.clickCount} times.</h3>);
        }
        return (<h3>Error: No Sample State Detected</h3>);
    }
}
