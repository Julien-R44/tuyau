/**
 * Code was stolen from https://gist.github.com/zaripych/963fa6584524e5b446b70548dbabbf65
 * and tweaked a bit to work with tuyau
 *
 * Purpose is to generates a "resolved" typescript type definition for a given type in a given file.
 *
 * Means if we pass an interface like `interface A { b: User }` to this function, it will generate a
 * resolved type like : `interface A { b: { id: string, name: string } }`
 */

import type { Type, Symbol, Signature, Node } from 'ts-morph'
import { Project, SymbolFlags, TypeFormatFlags } from 'ts-morph'

const projects = new Map<string, Project>()

const project = (tsConfigFilePath: string) => {
  const project = projects.get(tsConfigFilePath)
  const result = project ?? new Project({ tsConfigFilePath })
  projects.set(tsConfigFilePath, result)

  return result
}

export function typeFootprint(
  fileName: string,
  typeName: string,
  opts: { overrides?: Record<string, string>; tsConfigFilePath: string },
) {
  const p = project(opts.tsConfigFilePath)
  const s = p.addSourceFileAtPath(fileName)
  const a = s.getInterfaceOrThrow(typeName)
  const t = a.getType()

  const text = footprintOfType({ type: t, node: a, overrides: opts?.overrides })

  return `interface ${typeName} ` + text
}

function isPrimitive(type: Type) {
  if (type.isString()) return true
  if (type.isStringLiteral()) return true
  if (type.isUndefined()) return true
  if (type.isNull()) return true
  if (type.isUnknown()) return true
  if (type.isAny()) return true
  if (type.isNumber()) return true
  if (type.isNumberLiteral()) return true
  if (type.isBoolean()) return true
  if (type.isBooleanLiteral()) return true
  if (intrinsicNameOf(type) === 'void') return true

  return false
}

function isPromise(type: Type) {
  const symbol = type.getSymbol()
  if (!type.isObject() || !symbol) return false

  const args = type.getTypeArguments()
  return symbol.getName() === 'Promise' && args.length === 1
}

function isSimpleSignature(type: Type) {
  if (!type.isObject()) return false

  const sigs = type.getCallSignatures()
  const props = type.getProperties()
  const args = type.getTypeArguments()
  const indexType = type.getNumberIndexType()
  const stringType = type.getStringIndexType()
  return sigs.length === 1 && props.length === 0 && args.length === 0 && !indexType && !stringType
}

function intrinsicNameOf(type: Type) {
  return (type.compilerType as unknown as { intrinsicName: string }).intrinsicName
}

type FormatFlags =
  | false // <- to be able to pass down conditional flags
  | 'remove-undefined-from-intersections'

function footprintOfType(params: {
  type: Type
  node: Node
  overrides?: Record<string, string>
  flags?: FormatFlags[]
  callStackLevel?: number
}): string {
  const { type, node, overrides, flags = [], callStackLevel = 0 } = params

  if (callStackLevel > 10) {
    // too deep?
    return "'...'"
  }

  const next = (nextType: Type, nextFlags: FormatFlags[] = []) => {
    return footprintOfType({
      node,
      overrides,
      type: nextType,
      flags: nextFlags,
      callStackLevel: callStackLevel + 1,
    })
  }

  const indent = (text: string, lvl: number = 1) => text.replace(/^/gm, ' '.repeat(lvl * 2))

  const defaultFormat = () => {
    return type.getText(node, TypeFormatFlags.UseSingleQuotesForStringLiteralType)
  }

  const symbol = type.getAliasSymbol()
  if (overrides && symbol) {
    const result = overrides[symbol.getName()]
    if (result) {
      return result
    }
  }

  if (isPrimitive(type)) {
    return defaultFormat()
  }

  if (type.getText() === 'Blob') {
    return defaultFormat()
  }

  if (type.isArray()) {
    const subType = type.getArrayElementTypeOrThrow()
    if (isPrimitive(subType)) return `${next(subType)}[]`

    return `Array<\n${indent(next(subType))}\n>`
  }

  if (type.isTuple()) {
    const types = type.getTupleElements()
    return ['[\n', indent(types.map((type) => next(type)).join(',\n')), '\n]'].join('')
  }

  if (type.isObject() && isPromise(type)) {
    const first = type.getTypeArguments()[0]
    if (!first) throw new Error('This should not have happened')
    if (isPrimitive(first)) return `Promise<${next(first)}>`

    return `Promise<\n${indent(next(first))}\n>`
  }

  /**
   * TODO: I didn't find a way to get the type of the enum values
   * enum.getMembers() returns an array of symbols. Not sure why.
   * So let's just return a string | number for now
   */
  if (type.isEnum()) {
    return `string | number`
  }

  if (type.isObject() && isSimpleSignature(type)) {
    return signatures(type.getCallSignatures(), 'type', next)
  }

  if (type.isObject()) {
    const props = type.getProperties()
    const sigs = type.getCallSignatures()
    const numIndex = type.getNumberIndexType()
    const stringIndex = type.getStringIndexType()
    if (props.length === 0 && sigs.length === 0 && !numIndex && !stringIndex) {
      return '{}'
    }
    const sigsText = signatures(sigs, 'declaration', next)
    const propsText = properties(props, node, next)
    const numIndexText = numIndex && `[index: number]: ${next(numIndex)};`
    const stringIndexText = stringIndex && `[index: string]: ${next(stringIndex)};`
    return [
      '{\n',
      numIndexText && indent(numIndexText),
      stringIndexText && indent(stringIndexText),
      sigs.length > 0 && indent(sigsText),
      props.length > 0 && indent(propsText),
      '\n}',
    ]
      .filter(Boolean)
      .join('')
  }

  if (type.isUnion()) {
    return type
      .getUnionTypes()
      .filter((type) => {
        if (flags.includes('remove-undefined-from-intersections')) {
          return !type.isUndefined()
        }
        return true
      })
      .map((type) => next(type))
      .join(' | ')
  }

  if (type.isIntersection()) {
    return type
      .getIntersectionTypes()
      .map((type) => next(type))
      .join(' & ')
  }

  // when you encounter this, consider opening an issue to add support for it
  return 'TODO'
}

function properties(
  props: Symbol[],
  node: Node,
  next: (type: Type, flags: FormatFlags[]) => string,
) {
  return props.map((value) => property(value, node, next)).join('\n')
}

function property(
  prop: Symbol,
  node: Node,
  next: (type: Type, flags: FormatFlags[]) => string,
): string {
  const type = prop.getTypeAtLocation(node)
  const sigs = type.getCallSignatures()
  const firstSig = sigs?.[0]
  if (isSimpleSignature(type) && !prop.hasFlags(SymbolFlags.Optional) && firstSig) {
    return signature(firstSig, 'declaration', next, prop.getName()) + ';'
  }

  const isOptional = prop.hasFlags(SymbolFlags.Optional)
  return [
    `'${prop.getName()}'`,
    isOptional ? '?' : '',
    ': ',
    next(type, [isOptional && 'remove-undefined-from-intersections']),
    ';',
  ].join('')
}

function signatures(
  sigs: Signature[],
  variant: 'type' | 'declaration',
  next: (type: Type, flags: FormatFlags[]) => string,
) {
  return sigs.map((sig) => signature(sig, variant, next)).join('\n')
}

function signature(
  sig: Signature,
  variant: 'type' | 'declaration',
  next: (type: Type, flags: FormatFlags[]) => string,
  methodName?: string,
): string {
  const name = sig.getDeclaration().getSymbol()?.getName()
  const nameToUse = methodName ?? (['__type', '__call'].includes(name ?? '') ? '' : name)
  const params = sig.getParameters()

  return [
    variant === 'declaration' ? nameToUse : '',
    '(',
    params
      .map((param) => {
        return [
          param.getName(),
          param.hasFlags(SymbolFlags.Optional) ? '?' : '',
          ': ',
          param
            .getDeclarations()
            .map((decl) => next(decl.getType(), []))
            .join(','),
        ].join('')
      })
      .join(', '),
    ')',
    variant === 'declaration' ? ': ' : ' => ',
    next(sig.getReturnType(), []),
  ].join('')
}
