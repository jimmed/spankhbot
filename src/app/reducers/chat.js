import { REHYDRATE } from 'redux-persist/constants';
import {
  CHAT_CONNECT,
  CHAT_CONNECTING,
  CHAT_DISCONNECT,
  CHAT_EVENT,
  CHAT_SEND
} from '../constants/ActionTypes';
import { fromJS } from 'immutable';

const initialState = fromJS({});

export default function accounts(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      return rehydrate(state, action);
    case CHAT_CONNECTING:
      return onConnecting(state, action);
    case CHAT_CONNECT:
      return onConnected(state, action);
    case CHAT_DISCONNECT:
      return onDisconnected(state, action);
    case CHAT_EVENT:
      return updatePingTime(addMessage(state, action), action);
    case CHAT_SEND:
      return addMessage(state, action);
    default:
      return state;
  }
}

function rehydrate(state, { payload: { chat } }) {
  if (!chat) {
    return state;
  }
  const incoming = onDisconnected(
    onDisconnected(chat, { accountType: 'streamer' }),
    { accountType: 'bot' }
  );
  return state ? state.merge(incoming) : incoming;
}

function onConnecting(state, { accountType }) {
  return updateChat(state, accountType, chat =>
    chat.delete('connected').set('connecting', true)
  );
}

function onConnected(state, { accountType }) {
  return updateChat(state, accountType, chat =>
    chat.delete('connecting').set('connected', true)
  );
}

function onDisconnected(state, { accountType }) {
  return updateChat(state, accountType, chat =>
    chat.delete('connecting').delete('connected')
  );
}

function updatePingTime(state, { accountType, date }) {
  return updateChat(state, accountType, chat => chat.set('lastPing', date));
}

function addMessage(state, { accountType, message, date }) {
  return updateChat(state, accountType, chat =>
    chat.update('messages', messages =>
      messages.push(fromJS({ date, ...message })).takeLast(1000)
    )
  );
}

function updateChat(state, accountType, modifier) {
  if (!state.has(accountType)) {
    state = state.set(
      accountType,
      fromJS({
        messages: []
      })
    );
  }
  return state.update(accountType, modifier);
}
