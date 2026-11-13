import React, { useEffect, useRef, useState } from 'react';
import { invitation } from './data.js';

const asset = (name) => `/assets/${name}`;

const petals = Array.from({length: 15}, (_, i) => ({
  id: i,
  left: `${(i * 37.31 + 8) % 100}%`,
  delay: `${-((i * 3.83) % 27).toFixed(2)}s`,
  duration: `${(21 + (i % 7) * 2.0).toFixed(2)}s`,
  size: `${13 + (i % 5) * 3}px`,
  drift: `${(i % 2 ? 1 : -1) * (25 + (i % 5) * 19)}px`,
  symbol: ['🌸','🌸','🌺','🌸','🌼','🍃'][i % 6],
}));

function FlowerShower({burst=false}) {
  return <div className={`petal-rain ${burst ? 'petal-rain-burst' : ''}`} aria-hidden="true">
    {petals.map(p=><span key={p.id} className="rain-petal" style={{
      '--left':p.left, '--delay':p.delay, '--duration':p.duration,
      '--size':p.size, '--drift':p.drift
    }}>{p.symbol}</span>)}
  </div>;
}

function FloatingFlowers(){
  return <FlowerShower />;
}

function Envelope({onOpen,isOpening}){
  return <section className={`landing landing-premium ${isOpening ? 'opening' : ''}`} aria-label="Wedding invitation envelope">
    <FlowerShower burst={isOpening}/>
    <span className="landing-decor decor-left">🌸</span>
    <span className="landing-decor decor-right">🌼</span>
    <button className="envelope envelope-photo" type="button" onClick={onOpen} disabled={isOpening} aria-label="Open Kunal and Saloni wedding invitation">
      <img className="envelope-reference" src={asset('reference-envelope.png')} alt="Intricate sage green floral wedding envelope" draggable="false" />
      <span className="envelope-seal photo-seal"><span>K <small>&amp;</small> S</span></span>
    </button>
    <div className="landing-copy">
      <div className="landing-invited">You're Invited</div>
      <p className="landing-caption">Tap the envelope to open your invitation</p>
    </div>
  </section>;
}


const WEDDING_DATE = new Date(invitation.weddingDateISO);

function getRemaining() {
  const delta = Math.max(0, WEDDING_DATE.getTime() - Date.now());
  return {
    days: Math.floor(delta / 86400000),
    hours: Math.floor(delta / 3600000) % 24,
    minutes: Math.floor(delta / 60000) % 60,
    seconds: Math.floor(delta / 1000) % 60,
  };
}

function Countdown() {
  const [remaining, setRemaining] = useState(getRemaining);
  useEffect(() => {
    const interval = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(interval);
  }, []);
  return <section className="countdown-section" aria-labelledby="countdown-title">
    <div className="countdown-paper">
      <span className="countdown-decoration" aria-hidden="true">✿</span>
      <p className="countdown-eyebrow">SAVE THE DATE</p>
      <h2 id="countdown-title">2nd December 2026</h2>
    </div>
    <div className="countdown-units" role="timer" aria-label="Time remaining until 2 December 2026">
      {Object.entries(remaining).map(([key, value]) =>
        <div className="countdown-unit" key={key}>
          <span className="countdown-value">{String(value).padStart(2, '0')}</span>
          <span className="countdown-label">{key.toUpperCase()}</span>
        </div>
      )}
    </div>
    <p className="countdown-message">We can't wait to celebrate with you!</p>
  </section>;
}

function ScratchReveal({ onReveal }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const erasedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [progress, setProgress] = useState(0);
  const revealOnceRef = useRef(false);

  const completeReveal = () => {
    if (revealOnceRef.current) return;
    revealOnceRef.current = true;
    setRevealed(true);
    onReveal?.();
  };

  // Draw once per size change. Do NOT repaint the cover on every pointer move.
  useEffect(() => {
    if (revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    function paintCover() {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(bounds.width * dpr);
      const height = Math.round(bounds.height * dpr);
      if (canvas.width === width && canvas.height === height && erasedRef.current) return;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gradient = ctx.createLinearGradient(0, 0, bounds.width, bounds.height);
      gradient.addColorStop(0, '#d6a46d');
      gradient.addColorStop(.46, '#f0c98e');
      gradient.addColorStop(1, '#bb8745');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, bounds.width, bounds.height);
      ctx.strokeStyle = '#f5dfb6';
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, bounds.width-4, bounds.height-4);
      ctx.fillStyle = '#fff7e6';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.font = `500 ${Math.max(13,Math.min(19,bounds.width / 23))}px Georgia,serif`;
      ctx.fillText('✦  SCRATCH TO REVEAL  ✦',bounds.width/2,bounds.height/2);
      erasedRef.current = false;
    }
    paintCover();
    const observer = new ResizeObserver(paintCover);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [revealed]);

  const position = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width / rect.width,
      y: (event.clientY - rect.top) * canvas.height / rect.height,
    };
  };

  const erase = (event) => {
    if (!drawingRef.current || revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', {willReadFrequently:true});
    const point = position(event);
    const last = lastPointRef.current || point;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(30, Math.min(58,canvas.width * .115));
    ctx.beginPath();
    ctx.moveTo(last.x,last.y);
    ctx.lineTo(point.x,point.y);
    ctx.stroke();
    // A round endpoint allows a tap or slow initial touch to reveal material too.
    ctx.beginPath();ctx.arc(point.x,point.y,ctx.lineWidth/2,0,Math.PI*2);ctx.fill();
    ctx.restore();
    lastPointRef.current = point;
    erasedRef.current = true;
  };

  const checkProgress = () => {
    const canvas=canvasRef.current;
    if(!canvas || !erasedRef.current || revealed)return;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    const {data}=ctx.getImageData(0,0,canvas.width,canvas.height);
    let transparent=0, sampleCount=0;
    // Subsample pixels for fast completion checks on mobile devices.
    for(let i=3;i<data.length;i+=64){sampleCount++;if(data[i]<80)transparent++;}
    const percent=transparent/sampleCount;
    setProgress(Math.round(percent*100));
    if(percent>=.36)completeReveal();
  };

  return <section className="scratch-section" aria-label="Scratch to reveal wedding surprise">
    <span className="scratch-flower" aria-hidden="true">✿</span>
    <div className={`scratch-frame ${revealed?'is-revealed':''}`}>
      <div className="scratch-hidden">
        <span>WE'RE GETTING MARRIED</span>
        <strong>Kunal <em>&amp;</em> Saloni</strong>
        <small>WEDNESDAY · 2 DECEMBER 2026</small>
      </div>
      <canvas
        ref={canvasRef}
        className="scratch-canvas"
        aria-label="Drag your finger or mouse over this gold card to reveal the surprise"
        style={{opacity:revealed?0:1,pointerEvents:revealed?'none':'auto'}}
        onPointerDown={e=>{
          drawingRef.current=true;lastPointRef.current=null;
          e.currentTarget.setPointerCapture(e.pointerId);
          erase(e);
        }}
        onPointerMove={erase}
        onPointerUp={e=>{
          if(drawingRef.current){erase(e);drawingRef.current=false;lastPointRef.current=null;checkProgress();}
          if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onPointerCancel={()=>{drawingRef.current=false;lastPointRef.current=null;checkProgress();}}
      />
    </div>
    {revealed && <p className="scratch-revealed-note" role="status">✦ A celebration of forever ✦</p>}
  </section>;
}

function AudioToggle({audioRef,enabled,onToggle}){
  return <button className="audio-toggle" type="button" onClick={onToggle} aria-label={enabled?'Mute background music':'Play background music'} title={enabled?'Mute music':'Play music'}>
    {enabled ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14"/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="m17 9 5 6m0-6-5 6"/></svg>}
  </button>;
}

function Heading({eyebrow,children}){return <><div className="eyebrow">{eyebrow || '✧'}</div><h2 className="section-heading">{children}</h2><div className="heading-ornament">✧</div></>}

// Matches image base names from public/assets. Supports common extensions.
const imageExtensions = ['png', 'webp', 'jpg', 'jpeg', 'svg'];
function EventArtwork({ name, fallback, className, alt }) {
  const candidates = [
    ...(name ? imageExtensions.map(ext => asset(`${name}.${ext}`)) : []),
    ...(fallback ? [asset(`${fallback}.svg`)] : []),
  ];
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [name, fallback]);
  if (index >= candidates.length) return null;
  return <img
    src={candidates[index]}
    className={className}
    alt={alt}
    loading="lazy"
    draggable="false"
    onError={() => setIndex(i => i + 1)}
  />;
}

function EventCard({event}) {
  return <article className="event-card event-card-illustrated reveal">
    <EventArtwork name={event.background} fallback={event.image} className="event-art-bg" alt="" />
    <div className="event-art-overlay" />
    <EventArtwork name={event.coupleImage} className="event-art-couple" alt={`${event.title} wedding couple illustration`} />
    <div className="event-copy">
      <h3>{event.title}</h3>
      <p className="event-subtitle">{event.subtitle}</p>
      <dl>
        <dt>DATE</dt><dd>{event.date}</dd>
        <dt>TIME</dt><dd>{event.time}</dd>
        <dt>VENUE</dt><dd>{event.venue}</dd>
      </dl>
    </div>
  </article>;
}

export default function App(){
  const [opened,setOpened]=useState(false);
  const [opening,setOpening]=useState(false);
  const [soundOn,setSoundOn]=useState(false);
  const [countdownUnlocked,setCountdownUnlocked]=useState(false);
  const countdownRef=useRef(null);
  const audioRef=useRef(null);
  const timeoutRef=useRef(null);
  const mainRef=useRef(null);

  useEffect(()=>{
    if(!opened) return;
    const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
    }),{threshold:.08});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
    return ()=>observer.disconnect();
  },[opened]);
  useEffect(()=>()=>clearTimeout(timeoutRef.current),[]);

  async function playAudio(){
    const audio=audioRef.current;
    if(!audio)return;
    audio.volume=.24;
    try{await audio.play();setSoundOn(true)}catch{setSoundOn(false)}
  }
  function openInvitation(){
    if(opening||opened)return;
    setOpening(true);
    // Audio is started in the explicit user click, per browser autoplay restrictions.
    playAudio();
    timeoutRef.current=setTimeout(()=>{setOpened(true);window.scrollTo(0,0)},1100);
  }
  function revealCountdown(){
    setCountdownUnlocked(true);
    // The countdown appears only after the guest scratches (or taps to reveal).
    // Wait for React to paint before scrolling to the newly revealed timer.
    window.setTimeout(() => {
      countdownRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    }, 350);
  }

  async function toggleAudio(){
    const audio=audioRef.current;
    if(!audio)return;
    if(soundOn){audio.pause();setSoundOn(false)}else await playAudio();
  }

  return <>
    <audio ref={audioRef} loop preload="auto" src={asset('wedding-melody.mp3')}/>
    {!opened && <Envelope onOpen={openInvitation} isOpening={opening}/>}
    {opened && <main ref={mainRef} className="invitation-page">
      <FloatingFlowers/>
      <section className="hero" id="home">
        <div className="hero-inner reveal visible">
          <div className="ganesh-symbol" aria-label="Shree Ganesh">ॐ</div>
          <p className="ganesh-heading">{invitation.blessing}</p>
          <p className="hero-message">We cordially invite you to witness the beginning of our forever and celebrate the wedding ceremony of</p>
          <div className="couple-names">
            <div>{invitation.groom}</div>
            <p className="couple-parent">(s/o {invitation.groomParents})</p>
            <span>with</span>
            <div>{invitation.bride}</div>
            <p className="couple-parent">(d/o {invitation.brideParents})</p>
          </div>
          <p className="hero-date">{invitation.weddingDateText}</p>
          <div className="hero-mark">❀</div>
          <p className="hero-venue"><strong>{invitation.venueName}</strong><small>{invitation.venueAddress}</small></p>
        </div>
      </section>
      <ScratchReveal onReveal={revealCountdown}/>
      {countdownUnlocked && <div ref={countdownRef} className="countdown-enter"><Countdown/></div>}
      <section className="events mint-panel" id="events">
        <Heading>Events Schedule</Heading>
        <div className="event-grid">{invitation.events.map(ev=><EventCard event={ev} key={ev.title}/>)}</div>
      </section>
      <section className="presence cream-panel">
        <Heading>Awaiting Your Noble Presence</Heading>
        <p>Because meeting you adds joy to our celebration — and you make it complete!</p>
      </section>
      <section className="families mint-panel">
        <Heading eyebrow="WITH LOVE">The Families</Heading>
        <div className="family-card">
          <p className="family-card-label">AWAITING YOUR GRACIOUS PRESENCE</p>
          <p>{invitation.groomParents}</p>
          <p>{invitation.brideParents}</p>
          <span>CORDIALLY INVITED BY</span>
          <p className="invited-by">{invitation.invitedBy}</p>
          <span>{invitation.rsvpLabel}</span>
          <div className="rsvp-phones">{invitation.phones.map(phone=><a key={phone} href={`tel:${phone.replace(/[^+\d]/g,'')}`}>{phone}</a>)}</div>
        </div>
      </section>
      <section className="venue cream-panel" id="venue">
        <Heading eyebrow="VENUE">Where We Celebrate</Heading>
        <p><strong>{invitation.venueName}</strong><br/>{invitation.venueAddress}</p>
        <div className="map-frame"><iframe title="The Palace Banquet Hall wedding venue in Kakrali, Punjab" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={invitation.mapEmbedUrl}/></div>
        <a className="gold-button directions" href={invitation.directionsUrl} target="_blank" rel="noopener noreferrer">➤ &nbsp; Get Directions</a>
      </section>
      <footer className="footer"><span>WITH LOVE</span><h2>{invitation.groom} &amp; {invitation.bride}</h2><span className="footer-flower">❧</span><p>2nd December 2026</p><small>{invitation.rsvpLabel}</small><p className="footer-phones">{invitation.phones.join(' · ')}</p></footer>
      <AudioToggle audioRef={audioRef} enabled={soundOn} onToggle={toggleAudio}/>
    </main>}
  </>;
}
