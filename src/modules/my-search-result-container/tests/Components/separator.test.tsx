/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// tslint:disable-next-line:no-unused-variable
import { render } from 'enzyme';
import * as React from 'react';
import {Separator} from '../../components';

describe('Separator component test', () => {
    it('renders correctly', () => {
        const mockProps = { separator: '/' };
        const component = render (<Separator {...mockProps} />);
        expect(component).toMatchSnapshot();
    });
});
