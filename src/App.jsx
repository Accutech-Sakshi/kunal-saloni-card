import React, { useEffect, useRef, useState } from 'react';
import { wedding } from './data.js';

const A = name => `/assets/${name}`;
const flowerData = Array.from({ length: 9 }, (_, i) => ({
  left: `${(i * 41.37 + 9) % 100}%`,
  delay: `${-((i * 2.07) % 33)}s`,
  duration: `${30 + ((i * 7) % 11)}s`,
  drift: `${((i % 2) ? -1 : 1) * (24 + ((i * 11) % 75))}px`,
  size: `${11 + (i % 5) * 2}px`,
  rose: i % 4 !== 0,
}));

function Petals() {
  return <div className="falling-petals" aria-hidden="true">
    {flowerData.map((f, i) => <img key={i} src={A(f.rose ? 'rose-petal.svg' : 'pink-flower.svg')}
      style={{ '--x': f.left, '--delay': f.delay, '--duration': f.duration, '--drift': f.drift, '--sz': f.size }} alt="" />)}
  </div>;
}
function Bells() {
  return <div className="bell-pair" aria-hidden="true">
    {['left a','left b','right a','right b'].map((pos, i) => <div className={`hanging-bell ${pos.replace(' ', '-')}`} key={pos} style={{'--phase': `${-i * .72}s`}}>
      <span className="bell-line"/><svg viewBox="0 0 50 56" width="48" height="54"><path fill="#aa671d" d="M25 7c-9 0-15 8-15 17v10L4 40h42l-6-6V24c0-9-6-17-15-17Z"/><path fill="#d99a40" d="M11 31h28l4 8H7Z"/><path fill="#bb7b26" d="M21 7c0-7 8-7 8 0"/><circle cx="25" cy="44" r="5" fill="#a76721"/><path d="M15 16c0-4 6-8 10-8" fill="none" stroke="#efc475" strokeWidth="2"/></svg>
    </div>)}
  </div>;
}
function Opening({ onOpen }) {
  const [leaving, setLeaving] = useState(false);
  const open = () => { if (leaving) return; setLeaving(true); window.setTimeout(onOpen, 780); };
  return <section className={`opening-screen ${leaving ? 'leaving' : ''}`} aria-label="Open invitation">
    <div className="opening-paper">
      <img className="opening-ganesh" src={A('ganesh.png')} alt="Lord Ganesh" />
      <button className="opening-envelope" onClick={open} type="button" aria-label="Open Kunal and Saloni's wedding invitation">
        <img src={A('envelope.png')} alt="Royal maroon floral envelope" />
        <span className="wax-seal">K<span>&amp;</span>S</span>
      </button>
      <h1>YOU’RE INVITED</h1>
      <p>Tap the envelope to open our invitation</p>
    </div>
  </section>;
}
function SectionHeader({ title, eyebrow }) {
  return <div className="section-heading reveal"><span>{eyebrow || '✦ WITH LOVE ✦'}</span><h2>{title}</h2><div className="tiny-flourish">❀</div></div>;
}
function RoyalHero() {
  return <section className="royal-hero" id="home" aria-label="Kunal and Saloni wedding invitation">
    <div className="royal-art">
      <img className="royal-art-bg" src={A('hero-bg.jpg')} alt="" />
      <Bells />
      <div className="royal-content">
        <img className="royal-ganesh" src={A('ganesh.png')} alt="Lord Ganesh" />
        <div className="royal-prayer">|| OM SHREE GANESHAYA NAMAH ||</div>
        <div className="royal-mantra">
          <p>मङ्गलं भगवान् विष्णुः मङ्गलं गरुडध्वजः ।<br />मङ्गलं पुण्डरीकाक्षः मङ्गलाय तनो हरिः ॥</p>
        </div>
        <p className="wedding-invite-text">We request the honour of your gracious presence on the auspicious<br className="desktop-only" /> occasion of the wedding celebration of</p>
        <h2 className="royal-name">{wedding.groom}</h2>
        <p className="royal-parent">S/o {wedding.groomParents}</p>
        <p className="royal-weds">weds</p>
        <h2 className="royal-name bride">{wedding.bride}</h2>
        <p className="royal-parent">D/o {wedding.brideParents}</p>
      </div>
      <img className="shiva-art" src={A('shiva-parvati.png')} alt="Shiva and Parvati wedding blessing illustration" />
    </div>
  </section>;
}
function useCountdown() {
  const calc = () => {
    let t = Math.max(0, new Date(wedding.dateISO).getTime() - Date.now());
    return [Math.floor(t / 86400000), Math.floor(t / 3600000) % 24, Math.floor(t / 60000) % 60, Math.floor(t / 1000) % 60];
  };
  const [values, setValues] = useState(calc);
  useEffect(() => { const timer = setInterval(() => setValues(calc()), 1000); return () => clearInterval(timer); }, []);
  return values;
}
function Scratch({ onReveal }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef(null);
  const active = useRef(false);
  const previous = useRef(null);
  const completed = useRef(false);
  const hasScratched = useRef(false);
  const lastPetal = useRef(0);
  const strokes = useRef(0);
  const pending = useRef([]);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => () => pending.current.forEach(clearTimeout), []);

  const emit = (x, y, burst = false) => {
    const layer = particlesRef.current;
    if (!layer) return;
    const el = document.createElement('img');
    el.src = A(burst && Math.random() > .6 ? 'pink-flower.svg' : 'rose-petal.svg');
    el.alt = '';
    el.className = burst ? 'scratch-burst-petal' : 'scratch-drag-petal';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    const radians = burst ? (-Math.PI + Math.random() * Math.PI) : Math.random() * Math.PI * 2;
    const distance = burst ? 45 + Math.random() * 65 : 10 + Math.random() * 16;
    el.style.setProperty('--px', `${Math.cos(radians) * distance}px`);
    el.style.setProperty('--py', `${Math.sin(radians) * distance - (burst ? 22 : 5)}px`);
    el.style.setProperty('--rot', `${Math.random() * 180 - 90}deg`);
    layer.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  };

  const finish = () => {
    if (completed.current) return;
    completed.current = true;
    active.current = false;
    setRevealed(true);
    // Flower fountain is now rendered by SaveDate, OUTSIDE the scratch card.
    // This keeps the petals visible even after the countdown replaces the card.
    onReveal?.();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const paint = () => {
      if (hasScratched.current || completed.current) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const gradient = ctx.createLinearGradient(0, 0, rect.width, 0);
      gradient.addColorStop(0, '#68111f');
      gradient.addColorStop(.5, '#a5283c');
      gradient.addColorStop(1, '#66101f');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.strokeStyle = 'rgba(242,199,147,.72)';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(2, 2, rect.width - 4, rect.height - 4);
      ctx.fillStyle = '#fff4e5';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `600 ${Math.min(17, Math.max(12, rect.width / 28))}px Georgia,serif`;
      ctx.fillText('✦  SCRATCH TO REVEAL  ✦', rect.width / 2, rect.height / 2);
    };
    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  const progress = () => {
    const canvas = canvasRef.current;
    if (!canvas || completed.current) return;
    const pixels = canvas.getContext('2d', {willReadFrequently:true})
      .getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0, inspected = 0;
    for (let n = 3; n < pixels.length; n += 80) {
      inspected++;
      if (pixels[n] < 90) cleared++;
    }
    if (strokes.current >= 3 && cleared / inspected >= .3) finish();
  };

  const erase = event => {
    if (!active.current || completed.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const prev = previous.current || {x,y};
    const ctx = canvas.getContext('2d', {willReadFrequently:true});
    const ratio = canvas.width / rect.width;
    ctx.save();
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(25, Math.min(44, rect.width * .085));
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    previous.current = {x,y};
    hasScratched.current = true;
    strokes.current++;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
        performance.now() - lastPetal.current > 550) {
      emit(x, y);
      lastPetal.current = performance.now();
    }
    if (strokes.current % 12 === 0) progress();
  };

  const stop = e => {
    if (!active.current) return;
    erase(e);
    active.current = false;
    previous.current = null;
    progress();
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return <div className={`scratch-card scratch-v2 ${revealed ? 'is-revealed' : ''}`}>
    <div className="scratch-under">
      <span>WE'RE GETTING MARRIED</span>
      <strong>2 December 2026</strong>
    </div>
    <canvas
      ref={canvasRef}
      onPointerDown={e => {
        if (completed.current) return;
        active.current = true;
        previous.current = null;
        e.currentTarget.setPointerCapture(e.pointerId);
        erase(e);
      }}
      onPointerMove={erase}
      onPointerUp={stop}
      onPointerCancel={stop}
      aria-label="Scratch the burgundy card to reveal the wedding date"
    />
    <div className="scratch-particles scratch-particles-v2" ref={particlesRef} aria-hidden="true" />
    {!revealed && <button className="scratch-skip" onClick={finish} type="button">Tap to reveal</button>}
  </div>;
}
const revealPetals = [
  {x:-104,y:-128,rot:-110,delay:0,scale:.85},
  {x:-66,y:-166,rot:-65,delay:65,scale:1},
  {x:-30,y:-112,rot:-45,delay:110,scale:.7},
  {x:18,y:-186,rot:25,delay:45,scale:1},
  {x:63,y:-149,rot:90,delay:130,scale:.9},
  {x:106,y:-113,rot:135,delay:80,scale:.8},
  {x:-83,y:-62,rot:-150,delay:180,scale:.7},
  {x:84,y:-62,rot:160,delay:200,scale:.75},
  {x:4,y:-87,rot:200,delay:235,scale:.65},
];

function SaveDate() {
  const [unlocked, setUnlocked] = useState(false);

  const values = useCountdown();
  const reveal = () => setUnlocked(true);
  return <section className="save-date save-date-floral" id="date">
    <SectionHeader title="Save The Date" eyebrow="✧" />
    {!unlocked && <div className="scratch-area">
      <Scratch onReveal={reveal} />
      <p className="scratch-help">Swipe gently across the card to reveal the date ✧</p>
    </div>}
    {unlocked && <div className="scratch-fountain-overlay" aria-hidden="true">
      {revealPetals.map((petal, i) => (
        <img key={i}
          src={A(i % 3 === 0 ? 'pink-flower.svg' : 'rose-petal.svg')}
          alt=""
          style={{
            '--fx': `${petal.x}px`, '--fy': `${petal.y}px`,
            '--fr': `${petal.rot}deg`, '--fd': `${petal.delay}ms`,
            '--fs': petal.scale,
          }}
        />
      ))}
    </div>}
    {unlocked && <div className="date-unlocked" role="status" aria-live="polite">
      <div className="date-ornate"><span>SAVE THE DATE</span><strong>2nd DECEMBER 2026</strong></div>
      <div className="countdown-boxes">{values.map((v,i)=><div className="counter" key={i}><strong>{String(v).padStart(2,'0')}</strong><span>{['DAYS','HOURS','MINUTES','SECONDS'][i]}</span></div>)}</div>
    </div>}
  </section>;
}
function EventCard({ e }) {
  const isWedding = e.id === 'wedding';
  return <article className={`event-poster theme-${e.tint} event-${e.id} reveal`}>
    <img className="poster-background" src={A(e.bg)} alt="" loading="lazy" />
    <div className="event-glass">
      <img className="event-symbol" src={A(e.icon)} alt="" loading="lazy" />
      <span className="event-pretitle">PLEASE JOIN US TO CELEBRATE</span>
      <p className="event-quote">{e.blurb}</p>
      <h3>{e.title}</h3>
      <div className="event-date">{e.date}</div>

{isWedding && (
  <>
    <div className="wedding-times">
      <div>
        <img
          src="/assets/pheras.webp"
          alt="Pheras"
          className="wedding-time-icon"
        />
        <strong>Pheras</strong>
        <b>{e.pheras}</b>
      </div>

      <div>
        <img
          src="/assets/reception.webp"
          alt="Reception"
          className="wedding-time-icon"
        />
        <strong>Reception</strong>
        <b>{e.reception}</b>
      </div>
    </div>

    <p className="wedding-place">
      {wedding.venue}
      <small>{wedding.address}</small>
    </p>
  </>
)}
    </div>
    {!isWedding && <img className="event-illustration" src={A(e.couple)} alt={`${e.title} illustration`} loading="lazy"/>}
    {isWedding && <img className="event-illustration wedding-illustration" src={A(e.couple)} alt="Kunal and Saloni wedding illustration" loading="lazy"/>}
  </article>;
}
function Events() { return <section className="events-section" id="events"><SectionHeader title="Events Schedule" eyebrow="INVITED WITH LOVE"/><div className="events-stack">{wedding.events.map(e=><EventCard key={e.id} e={e}/>)}</div></section>; }
const clothing=[['Haldi','Sunshine & Traditions','Bright, cheerful and effortlessly festive vibes','haldi-icon.png'],['Mehendi','Garden Romance','Fresh, floral and beautifully graceful looks','mehendi-icon.png'],['Carnival','Festive & Playful','Bold styles, statement outfits and joyful prints','carnival-icon.png'],['Cocktail','Glamour After Dark','Chic, sophisticated and effortlessly glamorous','coketail_icon.webp'],['Wedding','Timeless Grandeur','Traditional Indian elegance with a festive touch','wedding-icon.png']];
function Wardrobe() {return <section className="wardrobe-section"><SectionHeader title="Wardrobe Guide" eyebrow="✧"/><div className="wardrobe-grid">{clothing.map(([event,name,description,img])=><div className="wardrobe-card reveal" key={event}><img src={A(img)} alt="" loading="lazy"/><div><strong>{event}</strong><span>{name}</span><small>{description}</small></div></div>)}</div></section>;}

function Presence() {
  const companies = [
    "BDR Ingesta",
    "Consumer Mart",
    "MBS Lifescience Pvt Ltd",
    "MBS Formulation",
    "MBS Pharma",
    "Mgee Healthcare",
  ];

  return (
    <section className="presence-section" id="presence">
      <h2 className="presence-title">
        Awaiting Your Noble Presence
      </h2>

      <div className="presence-flourish">❀</div>

      <p className="presence-intro">
        Join us as we celebrate love, laughter, and the
        beginning of forever beautiful together.
      </p>

      <div className="presence-love">WITH LOVE</div>

      <strong className="presence-family">
        Garg Family
      </strong>

      <strong className="presence-names">
        {wedding.invitedBy}
      </strong>

      <p className="presence-blessing">
        Eagerly awaiting the pleasure of your presence
        and blessings.
      </p>

      <p className="rsvp-label">RSVP · Garg Family</p>

      <div className="phone-links">
        {wedding.phones.map((p) => (
          <a
            key={p}
            href={`tel:${p.replace(/[^+\d]/g, "")}`}
          >
            {p}
          </a>
        ))}
      </div>


    </section>
  );
}
function Venue() {const url=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wedding.mapQuery)}`;return <section className="venue-section"><SectionHeader title="The Best Route" eyebrow="WHERE WE CELEBRATE"/><p className="venue-title">{wedding.venue}</p><p>{wedding.address}</p><div className="map-box"><iframe title="Wedding venue map" loading="lazy" src={`https://maps.google.com/maps?q=${encodeURIComponent(wedding.mapQuery)}&z=14&output=embed`} referrerPolicy="no-referrer-when-downgrade"/></div><a className="directions-link" href={url} target="_blank" rel="noopener noreferrer">Get Directions</a></section>;}
function Music({audioRef}) {const [playing,setPlaying]=useState(false); const toggle=async()=>{let audio=audioRef.current;if(!audio)return;try{if(audio.paused){await audio.play();setPlaying(true)}else{audio.pause();setPlaying(false)}}catch{setPlaying(false)}};return <button type="button" className="music-button" onClick={toggle} aria-label={playing?'Mute music':'Play music'}>{playing?'♫':'♪'}</button>;}
function useReveals(active) {useEffect(()=>{if(!active)return;const ob=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('shown');ob.unobserve(entry.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>ob.observe(el));return()=>ob.disconnect();},[active]);}
export default function App() {
  const [opened,setOpened]=useState(false),audio=useRef(null);useReveals(opened);
  useEffect(()=>{document.body.classList.toggle('locked',!opened);return()=>document.body.classList.remove('locked');},[opened]);
  const open = () => {setOpened(true);window.scrollTo(0,0);if(audio.current){audio.current.volume=.22;audio.current.play().catch(()=>{});}};
  return <><audio ref={audio} src={A('wedding-melody.mp3')} loop preload="none"/><Petals/>{!opened && <Opening onOpen={open}/>}{opened && <><main><RoyalHero/><SaveDate/><Events/><Wardrobe/><Presence/><Venue/></main><footer className="final-footer"><h2>{wedding.groom} &amp; {wedding.bride}</h2><img className="footer-monogram" src={A('favicon.png')} alt="Wedding monogram"/><p>2nd DECEMBER 2026</p></footer><Music audioRef={audio}/></>}</>;
}
