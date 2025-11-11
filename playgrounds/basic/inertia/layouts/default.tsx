import { toast, Toaster } from 'sonner'
import { ReactElement, useEffect } from 'react'
import { Form, Link, usePage } from '@inertiajs/react'

import { Data } from '~/generated/data'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  useEffect(() => {
    toast.dismiss()
  }, [usePage().url])

  if (children.props.flash.error) {
    toast.error(children.props.flash.error)
  }

  return (
    <>
      <header>
        <div>
          <div>
            <Link href="/">
              <svg
                width="120"
                height="24"
                viewBox="0 0 195 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M180 37.5v-30h-7.5V0H195v7.5h-7.5v30H180ZM150 15V7.5h-15V0h15v7.5h7.5V15H150Zm-15 22.5V30h-7.5V7.5h7.5V30h15v7.5h-15Zm15-7.5v-7.5h7.5V30H150ZM82.5 37.5v-30H90V0h15v7.5h7.5v30H105v-15H90v15h-7.5ZM90 15h15V7.8H90V15ZM45 37.5V0h22.5v7.5h-15V15h15v7.5h-15V30h15v7.5H45ZM0 37.5V0h22.5v7.5H30V15h-7.5v15H30v7.5h-7.5V30H15v-7.5H7.5v15H0ZM7.5 15h14.7V7.5H7.5V15Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
          <div>
            <nav>
              {children.props.user ? (
                <Link href="logout" method="post">
                  Logout
                </Link>
              ) : (
                <>
                  <Link href="/signup">Signup</Link>
                  <Link href="/login">Login</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main>
        <Toaster position="top-center" richColors />
        {children}
      </main>
    </>
  )
}
