import React from 'react';
import cx from 'suitcx';
import ExternalLink from '../ExternalLink';
import pkg from '../../../../package.json';

const appName = pkg.displayName || pkg.name;
const versionString = `v${pkg.version}`;
const hash = pkg.gitHead ? pkg.gitHead.slice(0, 8) : 'dev';
const commitUrl = pkg.repository.url
  ? pkg.repository.url.replace(/(^git\+|\.git$)/g, '') + '/commit/' + hash
  : '';

export default function AboutPanel() {
  return (
    <div className={cx('Panel', { background: 'fill', center: true })}>
      <h1>
        {appName} <small>{versionString}</small>
      </h1>
      <h4>
        Crafted with love by <strong>jimotosan</strong>
      </h4>
      <h5>
        <small>
          {process.platform} ({process.arch}) &mdash; electron v{process.versions.electron}
        </small>
      </h5>
      {commitUrl &&
        hash &&
        <div className={'version-info'}>
          <small>
            <ExternalLink href={commitUrl}>
              <code>
                {hash}
              </code>
            </ExternalLink>
          </small>
        </div>}
    </div>
  );
}
