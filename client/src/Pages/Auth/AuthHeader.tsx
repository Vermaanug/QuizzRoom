interface AuthHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

const AuthHeader = ({ eyebrow, title, description }: AuthHeaderProps) => (
  <header className="mb-7 text-center">
    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary-600">{eyebrow}</p>
    <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">{title}</h1>
    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">{description}</p>
  </header>
);

export default AuthHeader;
