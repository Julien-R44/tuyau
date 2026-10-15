import { createHash } from 'node:crypto'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { cpus, totalmem } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import ts from 'typescript'

const root = fileURLToPath(new URL('../../', import.meta.url))
const scenarioNames = ['registry', 'client', 'named', 'tree', 'path', 'url', 'react', 'vue']
const { values } = parseArgs({
  options: {
    sizes: { type: 'string', default: '10,100,300,1000,3000' },
    samples: { type: 'string', default: '3' },
    calls: { type: 'string', default: '10' },
    scenarios: { type: 'string', default: scenarioNames.join(',') },
    out: { type: 'string', default: 'tmp/typing-bench-results.json' },
    keep: { type: 'boolean', default: false },
  },
})
const sizes = values.sizes.split(',').map(Number)
const samples = Number(values.samples)
const calls = Number(values.calls)
const scenarios = values.scenarios.split(',')
if (
  sizes.some((n) => !Number.isInteger(n) || n < 2 || n % 2 !== 0) ||
  !Number.isInteger(samples) ||
  samples < 1 ||
  !Number.isInteger(calls) ||
  calls < 2 ||
  calls % 2 !== 0 ||
  sizes.some((n) => n < calls) ||
  scenarios.some((name) => !scenarioNames.includes(name))
) {
  throw new Error(
    'Use positive samples, even sizes/calls >= 2, calls <= sizes, and known scenarios',
  )
}

const packages = ['core', 'query-core', 'react-query', 'vue-query']
const declarations = [
  'packages/core/build/client/index.d.ts',
  'packages/core/build/client/types/index.d.ts',
  ...packages.slice(1).map((name) => `packages/${name}/build/index.d.ts`),
]
// Measure the declarations consumers actually import, not library implementation checks.
const declarationHashes = Object.fromEntries(
  declarations.map((path) => [
    path,
    createHash('sha256')
      .update(readFileSync(join(root, path)))
      .digest('hex'),
  ]),
)
const paths = {
  '@tuyau/core/client': [join(root, declarations[0])],
  '@tuyau/core/types': [join(root, declarations[1])],
  ...Object.fromEntries(
    packages
      .slice(1)
      .map((name) => [`@tuyau/${name}`, [join(root, `packages/${name}/build/index.d.ts`)]]),
  ),
}

function fixture(count) {
  const schema = []
  const routes = []
  const groups = new Map()
  for (let i = 0; i < count / 2; i++) {
    const group = `g${Math.floor(i / 25)}`
    const name = `${group}.r${i}`
    const pattern = `/resources/${i}/:id`
    for (const mutation of [false, true]) {
      const key = mutation ? `${name}.update` : name
      const methods = mutation ? '["POST"]' : '["GET", "HEAD"]'
      schema.push(`'${key}': {
        methods: ${methods}; pattern: '${pattern}';
        types: {
          params: { id: string | number }; paramsTuple: [id: string | number];
          query: ${mutation ? '{}' : '{ page?: number; search?: string }'};
          body: ${mutation ? '{ title: string; published?: boolean }' : '{}'};
          response: { resource: ${i}; kind: '${mutation ? 'updated' : 'read'}'; id: number; title: string; tags: string[] };
          errorResponse: { status: 404; response: { code: 'NOT_FOUND'; resource: ${i} } }
            | { status: 422; response: { errors: { field: string; message: string }[] } };
        }
      }`)
      routes.push(`'${key}': {
        methods: ${methods}, pattern: '${pattern}',
        tokens: [{ type: 0, val: 'resources', end: '' }, { type: 0, val: '${i}', end: '' }, { type: 1, val: 'id', end: '' }],
        types: placeholder as Registry['${key}']['types'],
      }`)
    }
    if (!groups.has(group)) groups.set(group, [])
    groups
      .get(group)
      .push(`r${i}: typeof routes['${name}'] & { update: typeof routes['${name}.update'] }`)
  }
  return {
    'schema.d.ts': `export interface Registry { ${schema.join('\n')} }`,
    'tree.d.ts': `import type { routes } from './registry.js'
      export interface ApiDefinition {
        ${[...groups].map(([name, entries]) => `${name}: { ${entries.join('\n')} }`).join('\n')}
      }`,
    'registry.ts': `import type { AdonisEndpoint } from '@tuyau/core/types'
      import type { Registry } from './schema.js'
      import type { ApiDefinition } from './tree.js'
      const placeholder: any = {}
      export const routes = { ${routes.join(',\n')} } as const satisfies Record<string, AdonisEndpoint>
      export const registry = { routes, $tree: {} as ApiDefinition }
      declare module '@tuyau/core/types' {
        interface UserRegistry { routes: typeof routes; $tree: ApiDefinition }
      }`,
  }
}

function workload(count, scenario) {
  const lines = [`import { registry } from './registry.js'`]
  if (scenario === 'registry') return `${lines.join('\n')}\nexport { registry }`
  lines.push(`import { createTuyau } from '@tuyau/core/client'
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry })`)
  if (scenario === 'client') return `${lines.join('\n')}\nexport { client }`
  if (scenario === 'react' || scenario === 'vue') {
    const framework = scenario === 'react' ? 'React' : 'Vue'
    lines.push(`import { createTuyau${framework}QueryClient } from '@tuyau/${scenario}-query'
      const query = createTuyau${framework}QueryClient({ client })`)
  }
  for (let call = 0; call < calls / 2; call++) {
    // Spread a fixed number of distinct accesses across the whole registry.
    const i = calls === 2 ? 0 : Math.floor((call * (count / 2 - 1)) / (calls / 2 - 1))
    const name = `g${Math.floor(i / 25)}.r${i}`
    const args = `{ params: { id: '123' }, query: { page: 2 } }`
    const updateArgs = `{ params: { id: 123 }, body: { title: 'Updated' } }`
    if (scenario === 'url') {
      lines.push(`const getUrl${i}: string = client.urlFor.get('${name}', { id: '123' }).url
        const postUrl${i}: string = client.urlFor.post('${name}.update', { id: 123 }).url`)
    } else if (scenario === 'react' || scenario === 'vue') {
      lines.push(`query.${name}.queryOptions(${args}, { select: (data) => {
        const resource: ${i} = data.resource
        const kind: 'read' = data.kind
        // @ts-expect-error The response must not become any.
        data.missing
        return data.title
      } })
      query.${name}.update.mutationOptions({ onSuccess: (data) => {
        const resource: ${i} = data.resource
        const kind: 'updated' = data.kind
        // @ts-expect-error The response must not become any.
        data.missing
      } })`)
    } else {
      const get =
        scenario === 'path'
          ? `client.get('/resources/${i}/:id', ${args})`
          : scenario === 'named'
            ? `client.request('${name}', ${args})`
            : `client.api.${name}(${args})`
      const post =
        scenario === 'path'
          ? `client.post('/resources/${i}/:id', ${updateArgs})`
          : scenario === 'named'
            ? `client.request('${name}.update', ${updateArgs})`
            : `client.api.${name}.update(${updateArgs})`
      lines.push(`const read${i} = await ${get}
        const update${i} = await ${post}
        const readResource${i}: ${i} = read${i}.resource
        const updateResource${i}: ${i} = update${i}.resource
        const readKind${i}: 'read' = read${i}.kind
        const updateKind${i}: 'updated' = update${i}.kind
        // @ts-expect-error The response must not become any.
        read${i}.missing
        // @ts-expect-error The response must not become any.
        update${i}.missing`)
    }
  }
  return lines.join('\n')
}

function measure(config) {
  const start = performance.now()
  const result = spawnSync(
    process.execPath,
    [join(root, 'node_modules/typescript/bin/tsc'), '-p', config, '--extendedDiagnostics'],
    { cwd: root, encoding: 'utf8', timeout: 180_000, maxBuffer: 8 * 1024 * 1024 },
  )
  const wallMs = performance.now() - start
  if (result.error || (result.status !== 0 && result.status !== 2)) {
    throw new Error(
      `Compiler process failed for ${config}\n${result.error ?? ''}\n${result.stdout}\n${result.stderr}`,
    )
  }
  const metric = (name) => {
    const match = result.stdout.match(new RegExp(`^${name}:\\s+([\\d.]+)`, 'm'))
    if (!match) throw new Error(`Missing ${name} in tsc output`)
    return Number(match[1])
  }
  return {
    diagnostics: result.stdout.split('\n').filter((line) => /error TS\d+:/.test(line)),
    wallMs: Math.round(wallMs),
    checkMs: Math.round(metric('Check time') * 1000),
    totalMs: Math.round(metric('Total time') * 1000),
    memoryKib: metric('Memory used'),
    types: metric('Types'),
    instantiations: metric('Instantiations'),
    files: metric('Files'),
  }
}

function median(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

mkdirSync(join(root, 'tmp'), { recursive: true })
const workspace = mkdtempSync(join(root, 'tmp/typing-bench-'))
const output = resolve(root, values.out)
mkdirSync(dirname(output), { recursive: true })
const report = {
  metadata: {
    timestamp: new Date().toISOString(),
    commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    status: execFileSync('git', ['status', '--short'], { cwd: root, encoding: 'utf8' }).trim(),
    node: process.version,
    typescript: ts.version,
    platform: `${process.platform}/${process.arch}`,
    cpu: cpus()[0]?.model,
    cpuCount: cpus().length,
    memoryGib: totalmem() / 1024 ** 3,
    lockfileHash: createHash('sha256')
      .update(readFileSync(join(root, 'pnpm-lock.yaml')))
      .digest('hex'),
    runnerHash: createHash('sha256')
      .update(readFileSync(fileURLToPath(import.meta.url)))
      .digest('hex'),
    declarationHashes,
    sizes,
    samples,
    calls,
    scenarios,
    compilerOptions: { strict: true, skipLibCheck: true, incremental: false },
  },
  results: [],
}

try {
  const cases = []
  for (const count of sizes) {
    const directory = join(workspace, String(count))
    mkdirSync(directory)
    for (const [name, source] of Object.entries(fixture(count))) {
      writeFileSync(join(directory, name), source)
    }
    for (const scenario of scenarios) {
      writeFileSync(join(directory, `consumer-${scenario}.ts`), workload(count, scenario))
      const config = join(directory, `tsconfig.${scenario}.json`)
      writeFileSync(
        config,
        JSON.stringify(
          {
            compilerOptions: {
              target: 'ESNext',
              module: 'NodeNext',
              moduleResolution: 'NodeNext',
              lib: ['ESNext', 'DOM'],
              types: [],
              strict: true,
              skipLibCheck: true,
              noEmit: true,
              incremental: false,
              paths,
            },
            files: [`./consumer-${scenario}.ts`],
          },
          null,
          2,
        ),
      )
      cases.push({ routes: count, scenario, config, samples: [] })
    }
  }
  // Warm filesystem caches once. Every measured tsc still starts a fresh process.
  measure(cases[0].config)
  for (let sample = 0; sample < samples; sample++) {
    // Reverse alternate rounds so increasing load does not always penalize large cases.
    const order = sample % 2 ? [...cases].reverse() : cases
    for (const entry of order) {
      const result = measure(entry.config)
      entry.samples.push(result)
      console.log(
        `${entry.routes}\t${entry.scenario}\t${sample + 1}/${samples}\t${result.checkMs} ms\t${result.instantiations} instantiations\t${result.diagnostics.length ? result.diagnostics[0] : 'OK'}`,
      )
      report.results = cases
        .filter((item) => item.samples.length)
        .map((item) => ({
          routes: item.routes,
          scenario: item.scenario,
          ok: item.samples.every((value) => value.diagnostics.length === 0),
          samples: item.samples,
          median: Object.fromEntries(
            Object.keys(item.samples[0])
              .filter((key) => key !== 'diagnostics')
              .map((key) => [key, median(item.samples.map((value) => value[key]))]),
          ),
        }))
      writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`)
    }
  }
  console.table(
    report.results.map(({ routes, scenario, ok, median: m }) => ({
      routes,
      scenario,
      ok,
      checkMs: m.checkMs,
      wallMs: m.wallMs,
      memoryMiB: Math.round(m.memoryKib / 1024),
      instantiations: m.instantiations,
    })),
  )
  console.log(`Results: ${output}`)
  if (report.results.some((result) => !result.ok)) process.exitCode = 1
} finally {
  if (values.keep) console.log(`Fixtures: ${workspace}`)
  else rmSync(workspace, { recursive: true, force: true })
}
