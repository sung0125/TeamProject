import { signIn } from '@/auth'
import Image from 'next/image'

export default function SignInButton() {
  return (
    <div className="flex flex-col mt-10 items-center">
      <form
        action={async () => {
          'use server'
          await signIn('google', { redirectTo: '/dashboard' })
        }}
      >
        <button
          type="submit"
          className="flex items-center justify-center gap-4 rounded-lg pl-3 mb-4"
        >
          <Image src="/google_logo.png" height={30} width={30} alt="google" />
          <span className="bg-sky-400 text-white px-4 py-3 rounded-md hover:bg-sky-200">
            Sign in with Google
          </span>
        </button>
      </form>
      <form
        action={async () => {
          'use server'
          await signIn('github', { redirectTo: '/dashboard' })
        }}
      >
        <button
          type="submit"
          className="flex items-center justify-center gap-4 rounded-lg pl-3 mb-4"
        >
          <Image src="/github_logo.png" height={30} width={30} alt="github" />
          <span className="bg-sky-400 text-white px-4 py-3 rounded-md hover:bg-sky-200">
            Sign in with Github
          </span>
        </button>
      </form>
    </div>
  )
}
