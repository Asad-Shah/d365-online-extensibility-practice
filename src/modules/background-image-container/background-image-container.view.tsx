/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as React from 'react';
import { IBackgroundImageContainerViewProps } from './background-image-container';

export default (props: IBackgroundImageContainerViewProps) => {
    const { slots } = props;
    return (
        <div>
            <div className='row'>
                <div style={{ width: '50%', float: 'left' }}>
                    {slots?.slot1[0]}
                </div>
                <div style={{ width: '50%', float: 'right' }}>
                    {slots?.slot2[0]}
                </div>
            </div>
            <div className='row'>
                <div style={{ width: '50%', float: 'left' }}>
                    {slots?.slot3[0]}
                </div>
                <div style={{ width: '50%', float: 'right' }}>
                    {slots?.slot4[0]}
                </div>
            </div>
        </div>
    );
};
