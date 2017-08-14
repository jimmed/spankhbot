import React from 'react';
import ExternalLink from '../../ExternalLink';

export default function ResetPanel({ actions }) {
  return (
    <div className="callout">
      <h5>Delete Local Settings</h5>
      <p>This will reset everything!</p>
      <p>
        <button
          type="button"
          onClick={actions.purgeStorage}
          className="small alert button"
        >
          Delete Local Settings
        </button>
        &nbsp;
        <ExternalLink
          href="https://www.twitch.tv/settings/connections#authorized"
          className="small hollow button"
        >
          View Authorized Apps on Twitch
        </ExternalLink>
      </p>
    </div>
  );
}
