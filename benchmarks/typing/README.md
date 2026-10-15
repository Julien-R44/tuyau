# Type-checking benchmarks

`pnpm bench:types` measures consumer type-checking as the route registry grows. It uses the built package declarations, not the cost of checking Tuyau's implementation.

## Reproduce the measurements

Build before each comparison. The runner does not rebuild packages, so a source edit alone does not change the measured declarations.

```sh
pnpm build
pnpm bench:types --out tmp/typing-results.json
```

The default matrix contains 10, 100, 300, 1,000, and 3,000 routes, eight scenarios, and three samples per case. Runs are sequential. Each sample starts a fresh `tsc --noEmit --extendedDiagnostics` process. One unrecorded run warms the filesystem cache, and alternate rounds reverse the case order.

The runner saves every sample and the medians. Compiler diagnostics remain in the JSON with `ok: false`, and the command exits with status 1 if any case fails. Process failures and the 180-second per-process timeout abort the run. A failed compilation's timing is **not** a successful performance result.

For a shorter run or a larger workload:

```sh
pnpm bench:types --sizes 100,300 --scenarios named,path --samples 3
pnpm bench:types --sizes 1000 --calls 100 --scenarios tree,path,react --samples 3
```

`--calls` counts endpoint operations, split equally between reads and writes. Sizes and call counts must be even, at least 2, and the call count cannot exceed the smallest registry. `registry` and `client` do not issue endpoint operations.

To investigate a case, use `--keep` and the fixture directory printed by the runner:

```sh
pnpm bench:types --sizes 300 --scenarios path --samples 1 --keep
pnpm exec tsc -p tmp/typing-bench-<id>/300/tsconfig.path.json --generateTrace tmp/typing-trace
pnpm --filter @tuyau/core exec analyze-trace ../../tmp/typing-trace
```

Trace collection adds overhead and is separate from the recorded benchmark timings.

## What each case measures

| Scenario   | Consumer workload                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| `registry` | Import the generated registry without creating a client                                                       |
| `client`   | Import the registry and call `createTuyau`                                                                    |
| `named`    | Call `client.request` and check inferred responses                                                            |
| `tree`     | Call `client.api` and check inferred responses                                                                |
| `path`     | Call `client.get` and `client.post` and check inferred responses                                              |
| `url`      | Build URLs with `client.urlFor.get` and `.post`                                                               |
| `react`    | Create the React Query client, call `queryOptions` with `select`, and call `mutationOptions` with `onSuccess` |
| `vue`      | Equivalent Vue Query workload                                                                                 |

The fixtures are deterministic. They follow the generated registry's three-file structure, including `as const satisfies`, typed placeholders, module augmentation, and a precomputed tree. Each resource has a GET/HEAD endpoint and a POST endpoint on the same URL. The tree includes nodes that are both callable endpoints and parents. Groups contain up to 25 resources.

Each route has separately declared params, query, body, response, and error types. Literal response tags distinguish resources and methods. The consumer asserts those tags and rejects nonexistent response properties with `@ts-expect-error`, so a benchmark cannot silently pass after response inference becomes `any`.

The default workload accesses ten distinct endpoints spread across each registry. Increasing the registry size does not also increase the number of calls.

## Recorded results

The initial run used the [pre-optimization source](https://github.com/Julien-R44/tuyau/commit/304153a1339ccfa3bc2ef05ca7bfa9be30c273a2), Node 26.10.0, and TypeScript 6.0.3 in a two-vCPU Linux orb. The tables show median **check-phase milliseconds**, not total command duration.

The raw samples are in [baseline.json](./baseline.json), [strict-optimized.json](./strict-optimized.json), and [strict-optimized-100-calls.json](./strict-optimized-100-calls.json). The earlier [optimized.json](./optimized.json) and [optimized-100-calls.json](./optimized-100-calls.json) record the rejected `Record<never, never>` candidate, not the final implementation. All runs use the same runner and lockfile hashes. Each case has three samples with identical instantiation counts.

### Before the change

| Scenario         | 10 routes | 100 routes | 300 routes | 1,000 routes | 3,000 routes |
| ---------------- | --------: | ---------: | ---------: | -----------: | -----------: |
| Registry only    |        60 |        160 |        260 |          720 |        1,510 |
| Create client    |        70 |        180 |        330 |          830 |        1,820 |
| `request`        |       350 |     TS2590 |     TS2590 |       TS2590 |       TS2590 |
| `api`            |       130 |        240 |        400 |          830 |        1,770 |
| GET/POST by path |       270 |      2,650 |     18,280 |       TS2590 |       TS2590 |
| `urlFor`         |       120 |        330 |        620 |        1,440 |        3,660 |
| React Query      |       260 |        330 |        490 |          970 |        2,030 |
| Vue Query        |       330 |        440 |        550 |        1,120 |        2,240 |

TS2590 means "Expression produces a union type that is too complex to represent." The failing cases finish sooner because the compiler stops expanding the problematic union. Their durations do not indicate better scaling.

### Empty argument types caused the largest slowdown

The 100-route `request` trace reports `checkCrossProductUnion_DepthLimit` with a size of 300,348. The 300-route path trace spends about 17.7 seconds checking the consumer file, mostly the inline request argument expressions. This cost is not visible from instantiation counts alone.

`ParamsArg`, `QueryArg`, and `BodyArg` previously returned an anonymous `{}` in their empty branch. Returning `unknown` makes that branch neutral in intersections and avoids the expensive generic-constraint expansion. A final `& {}` in `RawRequestArgs` still excludes `null` and `undefined` when all three helpers return `unknown`. No runtime code changes.

The first candidate used `Record<never, never>`. It was fast but disabled TypeScript's weak-type checks on optional request arguments. For example, a variable containing only a misspelled `qurey` property compiled when passed to `request`, `get`, or `api`. The final implementation rejects those calls again.

| Case                     |    Before | Rejected `Record` | Final `unknown` |
| ------------------------ | --------: | ----------------: | --------------: |
| 100 routes, path calls   |  2,650 ms |            400 ms |          370 ms |
| 300 routes, path calls   | 18,280 ms |            570 ms |          530 ms |
| 300 routes, path memory  |   632 MiB |           113 MiB |         100 MiB |
| 100 routes, `request`    |    TS2590 |            290 ms |          260 ms |
| 3,000 routes, `request`  |    TS2590 |          1,930 ms |        1,840 ms |
| 3,000 routes, path calls |    TS2590 |          3,250 ms |        3,100 ms |

The 300-route path case improves by about 34 times in the check phase. Total process duration drops from 18,996 ms to 1,206 ms, about 16 times. All 40 final cases compile, compared with 34 of 40 before the change. The final implementation retains the rejected candidate's performance gains. Small differences between the two optimized runs are not evidence of another speedup.

The tests in `packages/core/tests/typings.spec.ts` cover both regressions. The existing 300-route fixture fails with TS2590 at both `request` and `post` on the original types. The optional-arguments test fails with four unused `@ts-expect-error` directives on the rejected `Record` candidate. Both pass with the final implementation. The tests also check inferred response properties, required request fields, and rejection of nullish raw arguments. Like the other tests in that group, they run through `tsc`, not at runtime. `pnpm checks` passes, including workspace type-checking and 284 runtime tests. The 85 typing tests are skipped by the runtime runner.

A separate temporary compiler probe compared 4,906 cases across the original, rejected, and final declarations, with `exactOptionalPropertyTypes` both enabled and disabled. It covered 17 endpoint shapes, 32 argument values, public core APIs, React Query, Vue Query, response inference, and generic wrappers. The final types restored the original acceptance results for all tested calls. Five generic wrapper implementations previously rejected by TypeScript now compile; tested invalid calls through those wrappers remain rejected. This is evidence for the covered cases on TypeScript 6.0.3, not proof of universal generic equivalence.

Other local probes did not solve the problem. Wrapping `RequestArgs` in `NoInfer` kept the failures. A non-distributive conditional fixed `request` but left the 300-route path case around 18 seconds. A distributive conditional reduced that case to about 4 seconds but timed out after 180 seconds at 3,000 routes. These were single-sample diagnostic experiments, not accepted optimizations.

### Path lookup remains the next optimization target

After the fix, increasing the workload from ten to 100 endpoint operations at 1,000 routes gives:

| Scenario    | 10 calls, ms | 100 calls, ms | 10 calls, instantiations | 100 calls, instantiations |
| ----------- | -----------: | ------------: | -----------------------: | ------------------------: |
| `request`   |          870 |         1,070 |                   21,151 |                    27,001 |
| `api`       |          840 |         1,000 |                   16,314 |                    24,144 |
| Path        |        1,290 |         3,510 |                  156,566 |                   884,306 |
| React Query |          910 |         1,270 |                   23,547 |                    56,622 |
| Vue Query   |          950 |         1,590 |                   37,658 |                   194,213 |

`FilterByMethodPathForRegistry` maps over every route for each distinct method/path lookup. A reusable method/path index is the next candidate to measure, either as a cached mapped type or emitted alongside the existing tree. It must preserve multiple methods and different endpoints on the same path. No index optimization is included here.

`urlFor` is another candidate. At 3,000 routes, the final run still takes 3,500 ms and 453,939 instantiations for ten URL operations. `RegistryGroupedByMethod` builds method-specific route maps; precomputing those maps needs its own benchmark.

The registry-only case already costs 1,450 ms at 3,000 routes after the fix. Comparing generated TypeScript registries with precompiled declaration imports would isolate how much of that cost applications can avoid. These follow-up ideas are not measured improvements.

## Limits of this baseline

- The measurements use TypeScript 6.0.3, `strict: true`, `skipLibCheck: true`, and no incremental cache. Node, CPU, lockfile hash, declaration entry-point hashes, and runner hash are recorded in each JSON file.
- `checkMs` is TypeScript's check phase, with 10 ms reporting precision. `wallMs` includes process startup, parsing, and module resolution. `memoryKib` is TypeScript's reported memory, not peak process RSS.
- Small timing differences can be noise. Instantiation counts are more stable, but do not capture all expensive type operations.
- These are synthetic, shallow payloads. They exclude controller imports, Vine validator inference, application components, bundling, and server-side route generation.
- The runner does not measure editor completion, hover latency, watch-mode rechecks, React or Vue component rendering, or infinite-query inference.
- The old per-package Attest benchmarks use different route fixtures and workloads. Their stored instantiation counts are not comparable to this baseline.
