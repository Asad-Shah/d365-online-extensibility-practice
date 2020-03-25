/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { AsyncResult, SimpleProduct } from '@msdyn365-commerce/retail-proxy';
// import {SimpleProductWithAvailablility} from '../../actions/get-product-availability';
// import { IPost } from '../../actions/get-posts';
import { IPostWithUser } from '../../actions/get-post-with-user';
// import { IUser } from '../../actions/get-user';

export interface IBackgroundImageData {
    products: AsyncResult<SimpleProduct>[];
    test: any;
    // post: IPost;
    // user: IUser;
    postWithUser: IPostWithUser,
}