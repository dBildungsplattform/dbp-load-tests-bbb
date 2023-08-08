const axios = require('axios');
const sha1 = require('crypto-js/sha1');
const conf = require('./conf');
const logger = require('./logger');

const { config } = conf;

const encodeURIParam = (value) => {
  return encodeURIComponent(value)
    .replace(/%20/g, '+')
    .replace(/[!'()]/g, escape)
    .replace(/\*/g, "%2A");
};

const buildQuery = params => {
  let keys = [];
  for (property in params) keys.push(property);
  keys = keys.sort();

  let list = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = params[key];
    if (params.hasOwnProperty(key)) {
      list.push(`${encodeURIParam(key)}=${encodeURIParam(value)}`);
    }
  }

  let query = '';
    if (list.length > 0) query = list.join('&');
    let userdata = '&userdata-bbb_auto_join_audio=true&userdata-bbb_enable_video=true&userdata-bbb_listen_only_mode=true&userdata-bbb_force_listen_only=false&userdata-bbb_skip_check_audio=false';
    let fullquery = query + userdata;

  return fullquery;
};

const getUserdata = (options) => options.userdata ? { ...config.bot.userdata, ...options.userdata } : config.bot.userdata;

const isModerator = (options) => options.moderator !== undefined ? options.moderator : config.url.moderator.value;

const getHost = (options) => options.host || config.url.host;

const getFetchHost = (options) => options.fetch || config.url.fetch;

const getSecret = (options) => options.secret || BIGBLUEBOT_SECRET;

const getMeetingID = (options) => options.room || BIGBLUEBOT_ROOM;

const getName = (options) => getMeetingID(options);

const getRecord = (options) => options.record;

const getVersion = (options) => options.version || config.url.version;

const getPassword = (role, options) => {
  return options.password && options.password[role] ?
    options.password[role] : config.api.password[role];
};

const getURL = (action, params, options) => {
  const query = buildQuery(params);
  const checksum = calculateChecksum(action, query, options);
  const host = getHost(options);
  const api = config.api.path;
  //const url = `${host}/${api}/${action}?${query}&checksum=${checksum}`;
  const url = `${host}/${api}/join?${query}&checksum=${checksum}`;

  return url;
};

const calculateChecksum = (action, query, options) => {
  const secret = getSecret(options);
  const checksum = sha1(action + query + secret);

  return checksum;
};

const getCreateURL = (options) => {
  const params = {
    meetingID: getMeetingID(options),
    name: getName(options),
    record: getRecord(options),
    moderatorPW: getPassword('moderator', options),
    attendeePW: getPassword('attendee', options),
  };

  return getURL('create', params, options);
};

const getEndURL = (options) => {
  const params = {
    meetingID: getMeetingID(options),
    password: getPassword('moderator', options),
  };

  return getURL('end', params, options);
};

const getJoinURL = (username, options) => {
  const params = {
    meetingID: getMeetingID(options),
    fullName: username,
    role: isModerator(options) ? "moderator" : "viewer",
    ...getUserdata(options),
  };

  return getURL('join', params, options);
};

const call = async (url) => {
  let data = null;
  await axios.get(url).then(response => {
    if (response.data.response && response.data.response.returncode === 'FAILED') {
      const { messageKey, message } = response.data.response;
      logger.error(`${messageKey}: ${message}`);
    } else {
      data = response.data;
    }
  }).catch(error => {
    logger.error(error);
  });

  return data;
};

const create = async (options) => {
  const url = getCreateURL(options);
  const data = await call(url);

  return data;
};

const end = async (options) => {
  const url = getEndURL(options);
  const data = await call(url);

  return data;
};

module.exports = {
  create,
  end,
  getHost,
  getFetchHost,
  getMeetingID,
  getVersion,
  getJoinURL,
};
