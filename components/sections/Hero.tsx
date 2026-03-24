export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center max-w-2xl mx-auto px-6 py-24 border-b border-dashed border-border"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-6">
        Available for work
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-3">
        Name Placeholder
      </h1>
      <p className="text-lg text-muted mb-8">
        Title Placeholder — Brief intro placeholder.
      </p>
      <div className="flex gap-3">
        <a
          href="#contact"
          className="px-4 py-2 bg-foreground text-background text-sm rounded-full"
        >
          Contact
        </a>
        <a
          href="#projects"
          className="px-4 py-2 border border-border text-sm rounded-full text-foreground"
        >
          Projects
        </a>
      </div>
    </section>
  );
}
