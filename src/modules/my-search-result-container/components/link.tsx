import * as React from 'react';
interface ILink {
   className?: string;
   text?: string;
   href?: string;
   ariaLabel?: string;
}

export const Link: React.FC<ILink> = ({ text, className, href, ariaLabel }) => (<a className = {className} href={href} aria-label={ariaLabel}> {text} </a>);