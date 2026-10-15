# Type-checking benchmarks

Measure consumer type-checking as the route registry grows. Build first: the runner imports built declarations, so source edits alone do not affect the measurements.

```sh
pnpm build
pnpm bench:types --out tmp/typing-results.json
```

The default matrix uses 10, 100, 300, 1,000, and 3,000 routes, ten endpoint operations, and three samples per case. It covers registry imports, client creation, `request`, `api`, path calls, `urlFor`, React Query, and Vue Query.

For a shorter run or more calls:

```sh
pnpm bench:types --sizes 100,300 --scenarios named,path --samples 3
pnpm bench:types --sizes 1000 --calls 100 --scenarios tree,path,react --samples 3
```

Sizes and call counts must be even, at least two, and the call count cannot exceed the smallest registry. Calls are split equally between reads and writes. Registry and client-creation scenarios do not issue calls.

## Compare measurements

Use the same compiler, dependencies, machine, and workload for both versions. Keep generated results in `tmp/`, not in Git.

- Each sample starts a fresh `tsc --noEmit --extendedDiagnostics` process with strict checking, `skipLibCheck`, and no incremental cache. Runs are sequential, with one unrecorded warmup and alternating case order.
- Deterministic fixtures keep the call count fixed as the registry grows. Response assertions detect lost inference.
- The JSON includes samples, medians, diagnostics, and environment metadata. `checkMs` measures the check phase; `wallMs` includes startup and parsing. `memoryKib` is reported compiler memory, not peak RSS.
- Compilation errors set `ok: false` and make the command exit with status 1. Process failures and the 180-second timeout abort the run. Failed compilations are not performance improvements.
- Synthetic fixtures do not measure application payload complexity, editor latency, or runtime performance. Small timing differences can be noise.

Pass `--keep` to retain fixtures. Use the printed fixture directory with `tsc --generateTrace` when investigating a slow case; trace collection adds overhead.
