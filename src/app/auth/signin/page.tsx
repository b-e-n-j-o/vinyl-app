// src/app/auth/signin/page.tsx
import Auth from '../../../components/Auth'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>
        <Auth />
      </div>
    </div>
  )
}