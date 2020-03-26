import * as React from 'react';
interface ISeparator {
   separator: string;
}

export const Separator: React.FC<ISeparator> = ({ separator }) => (<span> {separator} </span>);