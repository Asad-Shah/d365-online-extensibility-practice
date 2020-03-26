/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// tslint:disable-next-line:no-unused-variable
import { render } from 'enzyme';
import * as React from 'react';
import {Title} from '../../components';

describe('Title component test', () => {
    it('renders correctly', () => {
        const mockProps = { text: 'sample title',
                            className: 'test' };
        const component = render(<Title {...mockProps} />);
        expect(component).toMatchSnapshot();
    });
});
