/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { buildMockModuleProps } from '@msdyn365-commerce/core';
import { render } from 'enzyme';
import * as React from 'react';
import { ISearchResultContainerViewProps, ITitleViewProps, SearchResultContainerView } from '../../..';

describe('Search result container tests - View', () => {
    it('renders correctly', () => {
        const moduleProps: ISearchResultContainerViewProps= buildMockModuleProps({}, {}) as ISearchResultContainerViewProps;
        const mockTitle:ITitleViewProps = {
            TitleContainer: { className: 'node-class-TitleContent' },
            title:{
            titlePrefix: <span> results for </span>,
            titleText: <span> Products </span>,
            titleCount: <span> 97 </span>
            }
        };
        const mockProps = {
            ...moduleProps,
            className: 'className',
            products:<div>Products</div>,
            TitleViewProps:mockTitle,
            SearchResultContainer: { moduleProps, className: 'module-class' },
        };
        const component = render(<SearchResultContainerView {...mockProps} />);
        expect(component).toMatchSnapshot();
    });
});