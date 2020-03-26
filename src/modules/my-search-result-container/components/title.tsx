import * as React from 'react';
interface ITitle {
   className: string;
   text: string;
}

export const Title: React.FC<ITitle> = ({ text, className }) => (<span className = {className}> {text} </span>);
