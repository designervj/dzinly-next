export const metadata = {
  title: 'Authentication',
  description: 'Sign in to your account',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
