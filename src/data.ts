import { build as astro } from 'astro:config/server';
import { siteBuild } from '@briskcms/kit/build.js';
import { content as given, origin, shareNames, sizes } from 'brisk:content';
import { content, site } from '../schema';

// The site's build helpers (@briskcms/kit/build.js), from the build's
// inputs: its content (brisk:content, which the Brisk integration reads
// from content/, or the folder a Brisk preview names, or else the seed),
// its address, the release's assets prefix, share image names and image
// sizes.
export const build = siteBuild({
  site,
  data: content.parse(given),
  origin,
  pinned:
    typeof astro.assetsPrefix === 'string' ? astro.assetsPrefix : undefined,
  shareNames,
  sizes,
});
export const {
  data,
  seo,
  identity,
  postPrefix,
  sizeOf,
  rootFrom,
  releaseUrl,
  linkFrom,
  linkValue,
  navigationLabel,
  routeOf,
  authorOf,
  longDate,
  openingHours,
  addressLines,
  socialLinks,
  postsNewestFirst,
  siteImage,
} = build;

/** The site's collections, each in its editors' order. */
export const { services, team, testimonials, plans, gallery } =
  data.collections;

/** A plan's inclusions: one a line, blank lines left out. */
export const includes = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

/** Plain text's paragraphs: a blank line starts a new one. */
export const paragraphsOf = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/**
 * The address on Google Maps (its search URL, which needs no key), for a
 * link rather than an embed: an embed would need a frame from another
 * site, its scripts and its cookies.
 */
export function mapLink() {
  const address = identity.address;
  if (!address) return undefined;
  const query = [
    address.street,
    address.locality,
    address.region,
    address.postcode,
    address.country,
  ]
    .filter(Boolean)
    .join(', ');
  // Well formed first: a lone surrogate, which text may hold, would throw.
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query.toWellFormed())}`;
}

/**
 * A phone number as people here write it: an Australian one in its
 * national form (02 5550 1234, 0412 345 678, 1300 123 456, 13 12 34), any
 * other as given.
 */
export function phoneText(phone: string) {
  const n = phone.startsWith('+61') ? '0' + phone.slice(3) : phone;
  if (/^04\d{8}$/.test(n))
    return `${n.slice(0, 4)} ${n.slice(4, 7)} ${n.slice(7)}`;
  if (/^0[2378]\d{8}$/.test(n))
    return `${n.slice(0, 2)} ${n.slice(2, 6)} ${n.slice(6)}`;
  if (/^1[38]00\d{6}$/.test(n))
    return `${n.slice(0, 4)} ${n.slice(4, 7)} ${n.slice(7)}`;
  if (/^13\d{4}$/.test(n))
    return `${n.slice(0, 2)} ${n.slice(2, 4)} ${n.slice(4)}`;
  return phone;
}
