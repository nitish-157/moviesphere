function Footer() {
  return (
    <footer className="border-t border-cine-border mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-display text-sm tracking-wide text-cine-muted">
          MOVIE<span className="text-cine-gold">SPHERE</span>
          <span className="ml-2 font-body text-xs text-cine-muted/70">Where Stories Find You.</span>
        </p>
        <p className="text-xs text-cine-muted">
          Movie data provided by TMDB. Built for portfolio/learning purposes.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
