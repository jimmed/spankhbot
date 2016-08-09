import React from 'react'
import cx from 'suitcx'
import ExternalLink from '../ExternalLink'

const { env } = process
const pkg = mapEnvToProps(env, 'npm_package')
const appName = pkg.displayName || pkg.name
const versionString = `v${pkg.version}`
const hash = pkg.gitHead.slice(0, 8)
const commitUrl = pkg.repository_url.replace(/(^git\+|\.git$)/g, '') + '/commit/' + hash

export default function AboutPanel () {
  return (
    <div className={cx('Panel', { background: 'fill', center: true })}>
      <h1>{appName} <small>{versionString}</small></h1>
      <h4>Crafted with love by <strong>jimotosan</strong></h4>
      <h5><small>{process.platform} ({process.arch}) &mdash; electron v{process.versions.electron}</small></h5>
      <div className={'version-info'}>
        <small>
          <ExternalLink href={commitUrl}>
            <code>{hash}</code>
          </ExternalLink>
        </small>
      </div>
    </div>
  )
}

function mapEnvToProps (env, prefix, name) {
  const prefixPath = prefix.split(/_/g)
  return Object.keys(env)
    .reduce((out, key) => {
      if (key.startsWith(`${prefix}_`)) {
        const path = key.split(/_/g).slice(prefixPath.length).join('_')
        out[path] = env[key]
      }
      return out
    }, {})
}
