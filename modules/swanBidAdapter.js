import {config} from '../src/config.js';
import {registerBidder} from '../src/adapters/bidderFactory.js';
import * as utils from '../src/utils.js';
import {BANNER, VIDEO} from '../src/mediaTypes.js';
import includes from 'core-js-pure/features/array/includes.js'

const bidderConfig = 'hb_pb_ortb';
const bidderVersion = '1.0';
const VIDEO_TARGETING = ['startdelay', 'mimes', 'minduration', 'maxduration',
  'startdelay', 'skippable', 'playbackmethod', 'api', 'protocols', 'boxingallowed',
  'linearity', 'delivery', 'protocol', 'placement', 'minbitrate', 'maxbitrate', 'ext'];

export const spec = {
  code: 'swan',
  supportedMediaTypes: [BANNER, VIDEO],
  isBidRequestValid,
  buildRequests,
  interpretResponse,
  getUserSyncs,
  transformBidParams
};

registerBidder(spec);

function transformBidParams(params, isOpenRtb) {
  return utils.convertTypes({
    'unit': 'string',
    'customFloor': 'number'
  }, params);
}

function isBidRequestValid(bidRequest) {
  return !!(bidRequest.params.offerId);
}

function buildRequests(bids, bidderRequest) {
  let videoBids = bids.filter(bid => isVideoBid(bid));
  let bannerBids = bids.filter(bid => isBannerBid(bid));
  let requests = bannerBids.length ? [createBannerRequest(bannerBids, bidderRequest)] : [];
  videoBids.forEach(bid => {
    requests.push(createVideoRequest(bid, bidderRequest));
  });
  return requests;
}

// just an example calling the demo advert
function createBannerRequest(bids, bidderRequest) {
  return {
    method: 'GET',
    url: '/advert?placement=' + bids[0].adUnitCode,
    bidId: bids[0].bidId
  }
}

function createVideoRequest(bid, bidderRequest) {
  return {
    method: 'GET',
    url: '/advert?placement=' + bids[0].adUnitCode,
    bidId: bids[0].bidId
  }
}

function isVideoBid(bid) {
  return utils.deepAccess(bid, 'mediaTypes.video');
}

function isBannerBid(bid) {
  return utils.deepAccess(bid, 'mediaTypes.banner') || !isVideoBid(bid);
}

function interpretResponse(resp, req) {
  let response = {
    ad: resp.body,
    requestId: req.bidId,
    cpm: 4,
    width: 300,
    height: 250,
    creativeId: 'crid',
    currency: 'USD',
    netRevenue: true,
    ttl: 300,
    mediaType: BANNER
  };
  return response;
}

/**
 * @param syncOptions
 * @param responses
 * @param gdprConsent
 * @param uspConsent
 * @return {{type: (string), url: (*|string)}[]}
 */
function getUserSyncs(syncOptions, responses, gdprConsent, uspConsent) {
}
