import * as React from 'react';
interface IErrorMessage {
   text?: string;
}

export const ErrorMessage: React.FC<IErrorMessage> = ({ text }) => {
    return (
        <span className='ms-search-result-container__no-results-message'>
            <h5> {text} </h5>
        </span>
    );
};