import React from 'react';
import { shell } from 'electron';

export default function ExternalLink({ href, children, ...props }) {
  const onClick = () => shell.openExternal(href);
  return (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );
}
