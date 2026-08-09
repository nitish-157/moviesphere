import { Link } from "react-router-dom";

// Left branding panel is shared between Login and Register so the
// experience feels continuous when switching between them.
function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex bg-cine-bg font-body">
      {/* Left panel - brand + spotlight, hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-cine-bg items-center justify-center px-16">
        {/* Spotlight glow */}
        <div
          className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #D4A73A 0%, transparent 70%)" }}
        />
        {/* Film-strip accent on the edge */}
        <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex-1 border-b border-cine-bg bg-cine-surface2" />
          ))}
        </div>

        <div className="relative z-10 max-w-md">
          <Link to="/" className="inline-block">
            <h1 className="font-display text-5xl tracking-wide text-cine-text">
              MOVIE<span className="text-cine-gold">SPHERE</span>
            </h1>
          </Link>
          <p className="mt-4 text-cine-muted text-lg leading-relaxed">
            Where Stories Find You. Sign in and pick up where you left off.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/">
              <h1 className="font-display text-3xl tracking-wide text-cine-text">
                MOVIE<span className="text-cine-gold">SPHERE</span>
              </h1>
            </Link>
          </div>

          <h2 className="font-display text-3xl text-cine-text tracking-wide">{title}</h2>
          <p className="mt-1.5 text-cine-muted text-sm">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
