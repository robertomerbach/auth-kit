import AuthHeader from "@/components/auth/auth-header"
import AuthFooter from "@/components/auth/auth-footer"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthHeader />
      <div className="flex-grow flex flex-col h-full py-4 px-4 sm:px-6 md:px-10 items-center justify-center">
        <div className="flex-grow flex items-center justify-center w-full">
          <div className="w-full mx-auto flex flex-col gap-6 max-w-sm">
              {children}
          </div>
        </div>
      </div>
      <AuthFooter />
    </>
  );
}
