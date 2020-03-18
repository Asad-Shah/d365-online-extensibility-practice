/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as React from 'react';

import { IBackgroundImageData } from './background-image.data';
import { IBackgroundImageProps } from './background-image.props.autogenerated';

export interface IBackgroundImageViewProps extends IBackgroundImageProps<IBackgroundImageData> {

}

/**
 *
 * BackgroundImage component
 * @extends {React.PureComponent<IBackgroundImageProps<IBackgroundImageData>>}
 */
class BackgroundImage extends React.PureComponent<IBackgroundImageProps<IBackgroundImageData>> {
    constructor(props: IBackgroundImageProps<IBackgroundImageData>) {
        super(props);
    }
    public render(): JSX.Element | null {

        return this.props.renderView(this.props);
    }
}

export default BackgroundImage;
