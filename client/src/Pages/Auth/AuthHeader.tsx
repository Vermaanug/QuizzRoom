interface AuthHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

const AuthHeader = ({ eyebrow, title, description }: AuthHeaderProps) => (
  <header className="mb-8">
    <p className="sr-only">{eyebrow}</p>
    <h1 className="font-display text-3xl uppercase leading-none text-ink sm:text-4xl">{title}</h1>
    <p className="mt-2 text-base text-muted">{description}</p>
  </header>
);

export default AuthHeader;
