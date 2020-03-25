import { CacheType, createObservableDataAction, IAction, IActionContext, IActionInput, IAny, ICreateActionContext, IGeneric } from '@msdyn365-commerce/core';
export interface ISampleState {
    clickCount: number;
}

/**
 * SampleState - action input
 */
export class SampleStateInput implements IActionInput {
    public getCacheKey = () => `SampleState`;
    public getCacheObjectType = () => 'SampleState';
    public dataCacheType = (): CacheType => 'request';
}

/**
 * SampleState - action
 */
export async function sampleStateAction(input: SampleStateInput, ctx: IActionContext): Promise<ISampleState> {
    return { clickCount: 0 };
}

/**
 * SampleState - create new input for create action
 */
const createInput = (inputData: ICreateActionContext<IGeneric<IAny>>): IActionInput => {
    return new SampleStateInput();
};

/**
 * SampleState - create action
 */
export default createObservableDataAction<ISampleState>({
    action: <IAction<ISampleState>>sampleStateAction,
    input: createInput
});