"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/retro90.module.css";

const FAKE_VISITOR = 4217;

export default function Retro90() {
  const [visitors, setVisitors] = useState(FAKE_VISITOR);
  const [guestbookMsg, setGuestbookMsg] = useState("");
  const [guestbookSubmitted, setGuestbookSubmitted] = useState(false);

  useEffect(() => {
    document.body.classList.add("retro90-page");
    return () => document.body.classList.remove("retro90-page");
  }, []);

  // Fake visitor counter tick on load
  useEffect(() => {
    const t = setTimeout(() => setVisitors((v) => v + 1), 800);
    return () => clearTimeout(t);
  }, []);

  function handleGuestbook(e: React.FormEvent) {
    e.preventDefault();
    setGuestbookSubmitted(true);
  }

  return (
    <div className={styles.page}>

      {/* Scrolling marquee */}
      <div className={styles.marqueeBar}>
        <div className={styles.marqueeTrack}>
          ★ WELCOME TO MY HOMEPAGE ★ &nbsp;&nbsp; UNDER CONSTRUCTION 🚧 &nbsp;&nbsp;
          BEST VIEWED IN NETSCAPE NAVIGATOR 4.0 AT 800×600 &nbsp;&nbsp;
          ★ YOU ARE VISITOR #{visitors.toString().padStart(6, "0")} ★ &nbsp;&nbsp;
          DO NOT STEAL MY HTML!!! &nbsp;&nbsp;
          ★ WELCOME TO MY HOMEPAGE ★ &nbsp;&nbsp; UNDER CONSTRUCTION 🚧 &nbsp;&nbsp;
          BEST VIEWED IN NETSCAPE NAVIGATOR 4.0 AT 800×600 &nbsp;&nbsp;
          ★ YOU ARE VISITOR #{visitors.toString().padStart(6, "0")} ★ &nbsp;&nbsp;
          DO NOT STEAL MY HTML!!!
        </div>
      </div>

      {/* Rainbow divider */}
      <div className={styles.rainbow} />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.spinStar}>★</div>
        <h1 className={styles.title}>
          <span className={styles.r}>B</span>
          <span className={styles.o}>R</span>
          <span className={styles.y}>A</span>
          <span className={styles.g}>D</span>
          <span className={styles.b}>L</span>
          <span className={styles.i}>E</span>
          <span className={styles.v}>Y</span>
          <span className={styles.r}>&apos;</span>
          <span className={styles.o}>S</span>
        </h1>
        <h2 className={styles.subtitle}>~~*~ KEWL HOMEPAGE ~*~~</h2>
        <p className={styles.blink}>*** SITE UNDER CONSTRUCTION ***</p>
        <div className={styles.spinStar}>★</div>
      </header>

      {/* Rainbow divider */}
      <div className={styles.rainbow} />

      {/* Under construction banner */}
      <div className={styles.construction}>
        <span className={styles.constructionIcon}>🚧</span>
        <span>THIS PAGE IS UNDER CONSTRUCTION — PLEASE CHECK BACK SOON!!</span>
        <span className={styles.constructionIcon}>🚧</span>
      </div>

      {/* Main content table layout */}
      <div className={styles.layout}>

        {/* Left sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarBox}>
            <p className={styles.sidebarTitle}>★ LINKS ★</p>
            <ul className={styles.linkList}>
              <li><a href="#about">About Me</a></li>
              <li><a href="#interests">My Interests</a></li>
              <li><a href="#music">Fav Music</a></li>
              <li><a href="#guestbook">Guestbook</a></li>
              <li><Link href="/">← Back to Portfolio</Link></li>
            </ul>
          </div>

          <div className={styles.sidebarBox}>
            <p className={styles.sidebarTitle}>★ WEB AWARDS ★</p>
            <div className={styles.badge}>KEWL SITE<br />AWARD 1998</div>
            <div className={styles.badge2}>100% HTML<br />HAND CODED</div>
            <div className={styles.badge3}>NO<br />FRAMES!</div>
          </div>

          <div className={styles.sidebarBox}>
            <p className={styles.sidebarTitle}>★ VISITOR COUNT ★</p>
            <div className={styles.counter}>
              {visitors.toString().padStart(6, "0").split("").map((d, i) => (
                <span key={i} className={styles.digit}>{d}</span>
              ))}
            </div>
            <p className={styles.counterLabel}>You are visitor<br />#{visitors.toString().padStart(6, "0")}!!</p>
          </div>
        </aside>

        {/* Main content */}
        <main className={styles.main}>

          <section id="about" className={styles.section}>
            <h2 className={styles.sectionTitle}>✦ ABOUT ME ✦</h2>
            <div className={styles.sectionBody}>
              <p>
                HI!!! My name is <span className={styles.highlight}>Bradley</span> and welcome 2 my totally KEWL homepage!!!
                I made this site all by myself with NOTEPAD!! It took me like 4ever lol.
              </p>
              <p>
                I am a <span className={styles.neon}>web developer</span> and I like computers and stuff.
                This is my little corner of the <span className={styles.rainbow2}>INFORMATION SUPERHIGHWAY</span>!!
              </p>
              <p className={styles.email}>
                📧 E-MAIL ME: <a href="mailto:brad@aol.com">brad@aol.com</a>
              </p>
              <p className={styles.aim}>
                💬 AIM: xX_Brad_Kewl_Xx (I&apos;m usually on after school!!)
              </p>
            </div>
          </section>

          <div className={styles.rainbow} />

          <section id="interests" className={styles.section}>
            <h2 className={styles.sectionTitle}>✦ MY INTERESTS ✦</h2>
            <div className={styles.sectionBody}>
              <table className={styles.interestTable}>
                <tbody>
                  <tr>
                    <td>🎮 Video Games</td>
                    <td>🎵 Music</td>
                    <td>💻 Web Design</td>
                  </tr>
                  <tr>
                    <td>🌐 The Internet</td>
                    <td>🎬 Movies</td>
                    <td>🍕 Pizza</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className={styles.rainbow} />

          <section id="music" className={styles.section}>
            <h2 className={styles.sectionTitle}>✦ FAV MUSIC ✦</h2>
            <div className={styles.sectionBody}>
              <p className={styles.blink2}>🎵 NOW PLAYING: All Star - Smash Mouth 🎵</p>
              <ul className={styles.musicList}>
                <li>🎸 Smash Mouth</li>
                <li>🎸 Blink-182</li>
                <li>🎸 Backstreet Boys</li>
                <li>🎸 Britney Spears</li>
                <li>🎸 N*SYNC</li>
              </ul>
            </div>
          </section>

          <div className={styles.rainbow} />

          {/* Guestbook */}
          <section id="guestbook" className={styles.section}>
            <h2 className={styles.sectionTitle}>✦ SIGN MY GUESTBOOK!! ✦</h2>
            <div className={styles.sectionBody}>
              {guestbookSubmitted ? (
                <p className={styles.guestbookThanks}>
                  THANX 4 SIGNING!!! U R AWESOME!!! Come back soon!! ✨
                </p>
              ) : (
                <form onSubmit={handleGuestbook} className={styles.guestbookForm}>
                  <label>
                    Ur Name:<br />
                    <input type="text" className={styles.gbInput} placeholder="coolkid99" required />
                  </label>
                  <label>
                    Ur Message:<br />
                    <textarea
                      className={styles.gbTextarea}
                      rows={3}
                      placeholder="ur site is sooo kewl!!! ^_^"
                      value={guestbookMsg}
                      onChange={(e) => setGuestbookMsg(e.target.value)}
                    />
                  </label>
                  <button type="submit" className={styles.gbSubmit}>
                    ★ SIGN IT!! ★
                  </button>
                </form>
              )}
            </div>
          </section>

        </main>
      </div>

      {/* Rainbow divider */}
      <div className={styles.rainbow} />

      {/* Footer */}
      <footer className={styles.footer}>
        <p>✨ © 1998 Bradley&apos;s Kewl Homepage ✨</p>
        <p className={styles.footerSmall}>
          Best viewed in <strong>Netscape Navigator 4.0</strong> or <strong>Internet Explorer 5</strong> at <strong>800×600</strong> resolution
        </p>
        <p className={styles.footerSmall}>
          This page has been visited <strong>{visitors}</strong> times since November 1998!!
        </p>
        <p className={styles.footerSmall}>
          <a href="mailto:brad@aol.com">📧 Email Me</a> &nbsp;|&nbsp;
          <a href="#guestbook">📝 Sign Guestbook</a> &nbsp;|&nbsp;
          <Link href="/">🏠 Back to Portfolio</Link>
        </p>
        <p className={styles.footerTiny}>DO NOT STEAL MY HTML!!! Made with ❤️ and Notepad</p>
      </footer>

    </div>
  );
}
