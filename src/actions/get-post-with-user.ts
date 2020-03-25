import * as Msdyn365 from '@msdyn365-commerce/core';
import getPosts, { IPost, getPostAction } from './get-posts';
import getUser, { IUser, getUserAction } from './get-user';
/**
 * This interface will be the return type of our chain data action.
 * This contains both the basic product information in addition to the product's availability information.
 */
export interface IPostWithUser extends IPost {
    user: IUser
}

export class GetPostWithUserInput implements Msdyn365.IActionInput {
    public productId: number;
    constructor(productId: number) {
        this.productId = +productId;
    }
    public getCacheKey = () => `PostWithUser-${this.productId}`;
    public getCacheObjectType = () => 'PostWithUser';
    public dataCacheType = (): Msdyn365.CacheType => 'application';
}


/**
 * Creates the input required to make the retail api call
 */
export const createPostWitUserInput = (inputData: any): Msdyn365.IActionInput => {
    console.log("First");
    let productId = inputData.config && inputData.config.productId;
    return new GetPostWithUserInput(productId);
};

/**
 * Calls the Retail API and returns the Availability information for the passed Product
 */
async function getPostWithUserAction(input: GetPostWithUserInput, ctx: Msdyn365.IActionContext): Promise<IPostWithUser> {
    // First we get the product
    // const postWithUser: IPostWithUser = await getPosts(input, ctx);
    const post: IPost = await getPostAction(input, ctx);
    let user: IUser = {} as IUser;
    if (post) {
        const userInput = { ...input, userId: post.userId };
        user = await getUserAction(userInput, ctx);
    }
    return { ...post, user };
}

export default Msdyn365.createObservableDataAction({
    action: <Msdyn365.IAction<IPostWithUser>>getPostWithUserAction,
    input: createPostWitUserInput
})