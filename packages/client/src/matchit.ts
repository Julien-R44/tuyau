/**
 * This nasty code was copy/pasted from https://github.com/poppinss/matchit since Vite doesn't like
 * this package. Things I changed and that should be fixed in the original package:
 * - Moved to ESM
 * - Remove the arr/every package -> That was the thing breaking Vite. And now unnecessary since slowest than
 *  original Array.prototype.every
 */

const SEP = '/'
// Types ~> static, param, any, optional
const STYPE = 0
const PTYPE = 1
const ATYPE = 2
const OTYPE = 3
// Char Codes ~> / : *
const SLASH = 47
const COLON = 58
const ASTER = 42
const QMARK = 63

function strip(str: string) {
  if (str === SEP) return str
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  str.charCodeAt(0) === SLASH && (str = str.substring(1))
  const len = str.length - 1
  return str.charCodeAt(len) === SLASH ? str.substring(0, len) : str
}

function split(str: any) {
  // eslint-disable-next-line no-cond-assign
  return (str = strip(str)) === SEP ? [SEP] : str.split(SEP)
}

function isMatch(arr: any, obj: any, idx: any) {
  idx = arr[idx]

  if (obj.val === idx && obj.type === STYPE) {
    return true
  }

  if (idx === SEP) {
    return obj.type > PTYPE
  }

  if (obj.type === STYPE) {
    return false
  }

  /**
   * When param is not the last param
   */
  if (idx === '') {
    return obj.end === '' && (obj.matcher ? obj.matcher.test(idx) : true)
  }

  /**
   * Last param
   */
  if (!idx) {
    return obj.end === ''
  }

  return idx.endsWith(obj.end) && (obj.matcher ? obj.matcher.test(idx) : true)
}

export function match(str: any, all: any) {
  const segs = split(str)
  const len = segs.length
  let l
  let i = 0
  let tmp
  const fn = isMatch.bind(isMatch, segs)

  for (; i < all.length; i++) {
    tmp = all[i]
    if (
      // eslint-disable-next-line no-cond-assign
      (l = tmp.length) === len ||
      (l < len && tmp[l - 1].type === ATYPE) ||
      (l > len && tmp[l - 1].type === OTYPE)
    ) {
      if (tmp.every(fn)) return tmp
    }
  }

  return []
}

export function parse(str: any, matchers?: any) {
  if (str === SEP) {
    return [{ old: str, type: STYPE, val: str, end: '' }]
  }

  if (typeof matchers !== 'object') {
    matchers = {}
  }

  let c
  let x
  let t
  let sfx
  let val
  let nxt = strip(str)
  let i = -1
  let j = 0
  let len = nxt.length
  const out = []

  while (++i < len) {
    c = nxt.charCodeAt(i)

    if (c === COLON) {
      j = i + 1 // begining of param
      t = PTYPE // set type
      x = 0 // reset mark
      sfx = ''

      while (i < len && nxt.charCodeAt(i) !== SLASH) {
        c = nxt.charCodeAt(i)
        if (c === QMARK) {
          x = i
          t = OTYPE
        } else if (c === 46 && sfx.length === 0) {
          sfx = nxt.substring((x = i))
        }
        i++ // move on
      }

      val = nxt.substring(j, x || i)
      const matcher = matchers[val]

      out.push({
        old: str,
        type: t,
        val,
        end: sfx,
        matcher: matcher && matcher.match,
        cast: matcher && matcher.cast,
      })

      // shorten string & update pointers
      nxt = nxt.substring(i)
      len -= i
      i = 0

      continue // loop
    } else if (c === ASTER) {
      out.push({ old: str, type: ATYPE, val: nxt.substring(i), end: '' })
      continue // loop
    } else {
      j = i
      while (i < len && nxt.charCodeAt(i) !== SLASH) {
        ++i // skip to next slash
      }

      val = nxt.substring(j, i)

      out.push({ old: str, type: STYPE, val, end: '' })

      // shorten string & update pointers
      nxt = nxt.substring(i)
      len -= i
      i = j = 0
    }
  }

  return out
}

export function exec(str: any, arr: any) {
  let i = 0
  let x
  let y
  const segs = split(str)
  const out = {}
  for (; i < arr.length; i++) {
    x = segs[i]
    y = arr[i]
    if (x === SEP) continue

    if (y.val === '*') {
      // @ts-expect-error osef
      out[y.val] = segs.slice(i)
      break
    }

    // @ts-expect-error osef
    if (x !== void 0 && y.type | (OTYPE === 2)) {
      const value = x.replace(y.end, '')
      // @ts-expect-error osef
      out[y.val] = y.cast ? y.cast(value) : value
    }
  }
  return out
}
