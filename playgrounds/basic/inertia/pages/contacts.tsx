import { useState } from 'react'

import { client, type Route } from '~/tuyau'

/**
 * Playground page demonstrating:
 * - .safe() for non-throwing error handling
 * - isStatus() for narrowing typed errors
 * - Comparison with traditional try/catch
 */
export default function Contacts() {
  const [logs, setLogs] = useState<Array<{ type: 'success' | 'error' | 'info'; text: string }>>([])

  function log(type: 'success' | 'error' | 'info', text: string) {
    setLogs((prev) => [...prev, { type, text }])
  }

  function clearLogs() {
    setLogs([])
  }

  // ─── Example 1: basic .safe() usage ──────────────────────────────
  async function fetchContact(id: number) {
    log('info', `--- Fetching contact #${id} ---`)

    const [data, error] = await client.get('/contacts/:id', { params: { id: String(id) } }).safe()

    if (error) {
      log('error', `Error ${error.status}: ${error.message}`)
      return
    }

    log('success', `Got contact: ${data.contact.name} (${data.contact.email})`)
  }

  // ─── Example 2: isStatus() narrowing ──────────────────────────────
  async function createContact(name: string, email: string) {
    log('info', `--- Creating contact: ${name} <${email}> ---`)

    const [data, error] = await client.post('/contacts', { body: { name, email } }).safe()

    if (error) {
      if (error.isStatus(409)) {
        // error.response is narrowed to { message: string, existingEmail: string }
        log(
          'error',
          `Conflict! ${error.response.message} (existing: ${error.response.existingEmail})`,
        )
        return
      }

      // Catch-all for other errors (422 validation, etc.)
      log('error', `Error ${error.status}: ${JSON.stringify(error.response)}`)
      return
    }
    log('success', `Created contact #${data.contact.id}: ${data.contact.name}`)
  }

  // ─── Example 3: multiple isStatus() checks ───────────────────────
  async function updateContact(id: number, email: string) {
    log('info', `--- Updating contact #${id} email to ${email} ---`)

    const [data, error] = await client.api.contacts
      .update({ params: { id: String(id) }, body: { email } })
      .safe()

    if (error) {
      if (error.isStatus(404)) {
        // narrowed to { message: string }
        log('error', `Not found: ${error.response.message}`)
        return
      }

      if (error.isStatus(409)) {
        // narrowed to { message: string, existingEmail: string }
        log('error', `Conflict: ${error.response.message} (${error.response.existingEmail})`)
        return
      }

      log('error', `Unexpected error ${error.status}`)
      return
    }

    log('success', `Updated: ${data.contact.name} -> ${data.contact.email}`)
  }

  // ─── Example 4: delete with safe() ─────────────────────────────
  async function deleteContact(id: number) {
    log('info', `--- Deleting contact #${id} ---`)

    const [data, error] = await client
      .delete('/contacts/:id', { params: { id: String(id) } })
      .safe()

    if (error) {
      if (error.isStatus(404)) {
        log('error', `Not found: ${error.response.message}`)
        return
      }

      log('error', `Error: ${error.message}`)
      return
    }

    log('success', `Deleted: success=${data.success}`)
  }

  // ─── Example 5: typed try/catch with Route.Error ──────────────
  async function fetchContactTypedCatch(id: number) {
    log('info', `--- Fetching contact #${id} with typed try/catch ---`)

    try {
      const data = await client.get('/contacts/:id', { params: { id: String(id) } })
      log('success', `Got contact: ${data.contact.name}`)
    } catch (e) {
      const error = e as Route.Error<'contacts.show'>

      if (error.isStatus(404)) {
        // error.response is narrowed to { message: string, id: number }
        log('error', `Not found (id: ${error.response.id}): ${error.response.message}`)
        return
      }

      log('error', `Unexpected: ${error.message}`)
    }
  }

  // ─── Example 6: using .request() with safe() ─────────────────
  async function fetchContactByName(id: number) {
    log('info', `--- Using .request() with safe() ---`)

    const [data, error] = await client
      .request('contacts.show', { params: { id: String(id) } })
      .safe()

    if (error) {
      if (error.isStatus(404)) {
        log('error', `Not found: ${error.response.message} (id: ${error.response.id})`)
        return
      }

      log('error', `Error: ${error.message}`)
      return
    }

    log('success', `Found: ${data.contact.name}`)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">safe() & isStatus() Playground</h1>
        <p className="text-slate-400 mb-8">
          Click buttons to trigger API calls and see typed error handling in action.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Actions panel */}
          <div className="space-y-6">
            <Section title="1. Basic safe()">
              <Btn onClick={() => fetchContact(1)} color="emerald">
                Fetch contact #1 (exists)
              </Btn>
              <Btn onClick={() => fetchContact(999)} color="red">
                Fetch contact #999 (404)
              </Btn>
            </Section>

            <Section title="2. isStatus() narrowing on create">
              <Btn onClick={() => createContact('Dave', 'dave@example.com')} color="emerald">
                Create "Dave" (new)
              </Btn>
              <Btn onClick={() => createContact('Alice Clone', 'alice@example.com')} color="red">
                Create with alice@... (409 conflict)
              </Btn>
              <Btn onClick={() => createContact('X', 'bad')} color="yellow">
                Create invalid (422)
              </Btn>
            </Section>

            <Section title="3. Multiple isStatus() on update">
              <Btn onClick={() => updateContact(1, 'alice-new@example.com')} color="emerald">
                Update #1 email (ok)
              </Btn>
              <Btn onClick={() => updateContact(999, 'test@test.com')} color="red">
                Update #999 (404)
              </Btn>
              <Btn onClick={() => updateContact(1, 'bob@example.com')} color="yellow">
                Update #1 to bob's email (409)
              </Btn>
            </Section>

            <Section title="4. Delete">
              <Btn onClick={() => deleteContact(3)} color="emerald">
                Delete #3 (exists)
              </Btn>
              <Btn onClick={() => deleteContact(999)} color="red">
                Delete #999 (404)
              </Btn>
            </Section>

            <Section title="5. Typed try/catch (Route.Error)">
              <Btn onClick={() => fetchContactTypedCatch(1)} color="emerald">
                Fetch #1 (success)
              </Btn>
              <Btn onClick={() => fetchContactTypedCatch(999)} color="red">
                Fetch #999 (typed 404)
              </Btn>
            </Section>

            <Section title="6. .request() + safe()">
              <Btn onClick={() => fetchContactByName(2)} color="emerald">
                .request('contacts.show') #2
              </Btn>
              <Btn onClick={() => fetchContactByName(999)} color="red">
                .request('contacts.show') #999
              </Btn>
            </Section>
          </div>

          {/* Logs panel */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-300">Output</h2>
              <button
                onClick={clearLogs}
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-sm space-y-1 max-h-[80vh] overflow-y-auto">
              {logs.length === 0 && (
                <span className="text-slate-600">Click a button to see output...</span>
              )}
              {logs.map((entry, i) => (
                <div
                  key={i}
                  className={
                    entry.type === 'success'
                      ? 'text-emerald-400'
                      : entry.type === 'error'
                        ? 'text-red-400'
                        : 'text-slate-500'
                  }
                >
                  {entry.type === 'success' ? '✓' : entry.type === 'error' ? '✗' : '→'} {entry.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-400 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function Btn({
  onClick,
  color,
  children,
}: {
  onClick: () => void
  color: 'emerald' | 'red' | 'yellow'
  children: React.ReactNode
}) {
  const colors = {
    emerald: 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border-emerald-700/50',
    red: 'bg-red-600/20 text-red-300 hover:bg-red-600/30 border-red-700/50',
    yellow: 'bg-yellow-600/20 text-yellow-300 hover:bg-yellow-600/30 border-yellow-700/50',
  }

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${colors[color]}`}
    >
      {children}
    </button>
  )
}
