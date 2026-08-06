import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

const stats = [
  ["148K+", "Rooms hosted"],
  ["9.2M+", "Questions answered"],
  ["24K", "Active players"],
];

const Logo = () => (
  <Link aria-label="Quiz Room home" className="brand" to="/">
    <span>QUIZ</span> ROOM <b aria-hidden="true">ϟ</b>
  </Link>
);

const HomePage = () => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const joinRoom = (event: FormEvent) => {
    event.preventDefault();
    if (roomCode.trim()) navigate(`/room/${encodeURIComponent(roomCode.trim())}`);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="site-header">
        <Logo />
        <nav className="flex items-center gap-5 sm:gap-10" aria-label="Account navigation">
          <Link className="nav-link" to="/auth/login">Log in</Link>
          <Link className="neon-button h-12 px-6 sm:h-14 sm:px-9" to="/auth/signup">Sign up</Link>
        </nav>
      </header>

      <main>
        <section className="hero-shell">
          <div className="live-badge"><span aria-hidden="true">◉</span> Live quiz platform</div>
          <h1 className="hero-title">
            <span>Host.</span>
            <span className="text-primary-500">Play.</span>
            <span>Win.</span>
          </h1>
          <p className="hero-copy">Create trivia rooms in seconds. Share a link. Watch<br className="hidden sm:block" /> your friends battle it out in real time.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link className="neon-button h-14 px-7 text-sm" to="/auth/signup"><span className="text-xl font-light">＋</span> Start hosting free</Link>
            <Link className="outline-button h-14 px-7 text-sm" to="/auth/login"><span aria-hidden="true">▷</span> Log in</Link>
          </div>

          <form className="join-panel" onSubmit={joinRoom}>
            <label htmlFor="room-code">Have an invite link?</label>
            <div className="mt-4 flex gap-3">
              <input id="room-code" onChange={(event) => setRoomCode(event.target.value)} placeholder="Paste room code or link..." value={roomCode} />
              <button aria-label="Join room" type="submit">›</button>
            </div>
          </form>
        </section>

        <section className="stats-grid" aria-label="Quiz Room statistics">
          {stats.map(([value, label]) => (
            <div className="stat" key={label}><strong>{value}</strong><span>{label}</span></div>
          ))}
        </section>
      </main>
      <button aria-label="Help" className="help-button">?</button>
    </div>
  );
};

export default HomePage;
