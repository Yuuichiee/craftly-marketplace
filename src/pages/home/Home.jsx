import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import newRequest from '../../utils/newRequest';
import { cards, projects } from '../../data';
import CatCard from '../../components/catCard/CatCard';
import ProjectCard from '../../components/projectCard/ProjectCard';
import TrustedBy from '../../components/trustedBy/TrustedBy';
import GigCard from '../../components/gigCard/GigCard';
import CardOrbit3D from '../../components/cardOrbit3D/CardOrbit3D';
import EnergyHeading from '../../components/energyHeading/EnergyHeading';
import './Home.scss';

gsap.registerPlugin(ScrollTrigger);

// Three.js particle field
function ParticleField() {
  const ref = useRef();
  const count = 2500;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.025;
    ref.current.rotation.y = state.clock.elapsedTime * 0.04;
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#7c3aed" size={0.018} sizeAttenuation depthWrite={false} opacity={0.7} />
    </Points>
  );
}

function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 75 }}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      gl={{ antialias: false, alpha: true }}
    >
      <ParticleField />
    </Canvas>
  );
}

const POPULAR_SEARCHES = ['Website Design', 'Logo Design', 'SEO', 'AI Art', 'Video Editing'];

const MARKETPLACE_CATEGORIES = [
  { name: 'Graphics & Design', slug: 'logo-design', icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/graphics-design.d32a2f8.svg' },
  { name: 'Digital Marketing', slug: 'social-media', icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/online-marketing.74e221b.svg' },
  { name: 'Writing & Translation', slug: 'voice-over', icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/writing-translation.32ebe2e.svg' },
  { name: 'Video & Animation', slug: 'video-explainer', icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/video-animation.f0d9d71.svg' },
  { name: 'Music & Audio', slug: 'voice-over', icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/music-audio.320af20.svg' },
  { name: 'Programming & Tech', slug: 'wordpress', icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/programming.9362366.svg' },
  { name: 'Business', slug: 'seo', icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/business.bbdf319.svg' },
  { name: 'Lifestyle', slug: 'illustration', icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/lifestyle.745b575.svg' },
  { name: 'AI Artists', slug: 'ai-artists', icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/data.718910f.svg' },
  { name: 'Illustration', slug: 'illustration', icon: 'https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/photography.01cf943.svg' },
];

const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [gigs, setGigs] = useState([]);
  const [gigsLoading, setGigsLoading] = useState(true);

  const titleRef     = useRef();
  const subtitleRef  = useRef();
  const searchRef    = useRef();
  const statsRef     = useRef();

  // GSAP hero entrance
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.15 });
    tl.fromTo(titleRef.current,    { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1,   ease: 'power3.out' })
      .fromTo(subtitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .fromTo(searchRef.current,   { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .fromTo(statsRef.current,    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
    return () => tl.kill();
  }, []);

  // GSAP scroll reveals
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cat-card-wrap', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.categories-section', start: 'top 80%' },
      });
      gsap.fromTo('.why-card', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.why-section', start: 'top 80%' },
      });
      gsap.fromTo('.cta-section', { opacity: 0, scale: 0.97 }, {
        opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.cta-section', start: 'top 85%' },
      });
    });
    return () => ctx.revert();
  }, []);

  // Fetch popular gigs
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await newRequest.get('/gigs?sort=sales');
        setGigs(res.data);
      } catch {
        setGigs([]);
      } finally {
        setGigsLoading(false);
      }
    };
    fetchGigs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/gigs?search=${encodeURIComponent(query.trim())}`);
    else navigate('/gigs');
  };

  return (
    <div className="home">
      {/* ── HERO ── */}
      <section className="hero">
        <HeroCanvas />
        <div className="hero-gradient" />

        <div className="hero-content">
          <div className="hero-badge" ref={titleRef} style={{ opacity: 0 }}>
            <span className="spark">✦</span> The Future of Freelancing
          </div>

          {/* RGB RAINBOW TEXT + ENERGY SMOKE EMITTER */}
          <div ref={subtitleRef} style={{ opacity: 0 }}>
            <EnergyHeading text="Hire expert freelancers" highlightText="for any project" />
          </div>

          <p className="hero-subtitle" ref={searchRef} style={{ opacity: 0 }}>
            Access a global network of verified professionals.<br />
            Get your project done faster, better, smarter.
          </p>

          <form className="hero-search" onSubmit={handleSearch} style={{ opacity: 0 }} ref={searchRef}>
            <div className="search-wrap">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="7.5" cy="7.5" r="6" stroke="#5c5c7a" strokeWidth="1.5"/>
                <path d="M12 12l4 4" stroke="#5c5c7a" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder='Try "website design", "logo", "SEO"...'
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">Explore</button>
            </div>
            <div className="popular-searches">
              <span>Popular:</span>
              {POPULAR_SEARCHES.map(s => (
                <button
                  key={s}
                  type="button"
                  className="pill"
                  onClick={() => navigate(`/gigs?search=${encodeURIComponent(s)}`)}
                >
                  {s}
                </button>
              ))}
            </div>
          </form>
        </div>

        <div className="hero-stats" ref={statsRef} style={{ opacity: 0 }}>
          {[['12M+', 'Freelancers'], ['98%', 'Satisfaction'], ['180+', 'Countries'], ['$1B+', 'Paid Out']].map(([val, label]) => (
            <div key={label} className="stat-item">
              <span className="stat-val gradient-text">{val}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>

        <div className="hero-fade" />
      </section>

      {/* ── TRUSTED BY ── */}
      <TrustedBy />

      {/* ── 3D 360° ORBITING CARDS SECTION ── */}
      <CardOrbit3D />

      {/* ── POPULAR GIGS ── */}
      <section className="gigs-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Top Services</span>
            <h2>Popular right now</h2>
            <p>Explore top-rated services from our community</p>
          </div>

          {gigsLoading ? (
            <div className="gigs-skeleton-row">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="gig-skeleton-card">
                  <div className="skeleton" style={{ height: '200px', borderRadius: '12px', marginBottom: '12px' }} />
                  <div className="skeleton" style={{ height: '14px', width: '80%', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ height: '14px', width: '55%' }} />
                </div>
              ))}
            </div>
          ) : gigs.length === 0 ? (
            <div className="gigs-empty-home">
              <p>No services yet — <Link to="/add">be the first to list one!</Link></p>
            </div>
          ) : (
            <div className="gigs-row">
              {gigs.slice(0, 8).map(gig => <GigCard key={gig._id} item={gig} />)}
            </div>
          )}

          <div className="section-cta">
            <Link to="/gigs" className="btn-outline">View All Services →</Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES SLIDER / CARDS ── */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Browse</span>
            <h2>Explore by category</h2>
            <p>Find the right talent for every skill</p>
          </div>
          <div className="categories-grid">
            {cards.map(card => (
              <div key={card.id} className="cat-card-wrap">
                <CatCard card={card} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPLORE THE MARKETPLACE (GRID) ── */}
      <section className="marketplace-section" style={{ padding: "60px 0" }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Marketplace</span>
            <h2>Explore the marketplace</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "20px" }}>
            {MARKETPLACE_CATEGORIES.map((item) => (
              <Link
                key={item.name}
                to={`/gigs?cat=${item.slug}`}
                className="glass-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px 16px",
                  textAlign: "center",
                  gap: "12px",
                  transition: "transform 0.2s ease, border-color 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "var(--violet)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                <img src={item.icon} alt={item.name} style={{ width: "40px", height: "40px" }} />
                <span style={{ color: "var(--text-primary)", fontWeight: "500", fontSize: "14px" }}>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY GIGCONNECT ── */}
      <section className="why-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Why GigConnect</span>
            <h2>The smarter way to work</h2>
          </div>
          <div className="why-grid">
            {[
              {
                icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="13" stroke="url(#g1)" strokeWidth="1.5"/><path d="M8 14l4 4 8-8" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="g1" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#06b6d4"/></linearGradient></defs></svg>),
                title: 'Vetted Professionals',
                desc: 'Every seller goes through identity verification and skill assessment before joining GigConnect.',
              },
              {
                icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 7v8c0 6.1 4.3 11.8 10 13.3 5.7-1.5 10-7.2 10-13.3V7L14 2z" stroke="url(#g2)" strokeWidth="1.5" strokeLinejoin="round"/><defs><linearGradient id="g2" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#06b6d4"/></linearGradient></defs></svg>),
                title: 'Quality Guaranteed',
                desc: 'Not happy with the result? Get a free revision or a full refund — no questions asked.',
              },
              {
                icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="13" stroke="url(#g3)" strokeWidth="1.5"/><path d="M14 7v7l4.5 4.5" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="g3" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#06b6d4"/></linearGradient></defs></svg>),
                title: 'Lightning Fast',
                desc: 'Browse, hire, and receive work within hours. No slow back-and-forth negotiations.',
              },
              {
                icon: (<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="2" y="6" width="24" height="17" rx="3" stroke="url(#g4)" strokeWidth="1.5"/><path d="M2 11h24" stroke="url(#g4)" strokeWidth="1.5"/><defs><linearGradient id="g4" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#06b6d4"/></linearGradient></defs></svg>),
                title: 'Secure Payments',
                desc: 'Your payment is held safely until work is approved. Industry-standard encryption throughout.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="why-card glass-card">
                <div className="why-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section className="projects-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Inspiration</span>
            <h2>Real work from real GigConnect freelancers</h2>
            <p>Click on any project to explore matching services</p>
          </div>
          <div className="projects-grid">
            {projects.map(card => (
              <ProjectCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-glow violet glow-orb" />
            <div className="cta-glow cyan glow-orb" />
            <div className="cta-content">
              <span className="section-label">Get Started</span>
              <h2>Ready to bring your ideas to life?</h2>
              <p>Join millions of businesses and freelancers on Liverr</p>
              <div className="cta-actions">
                <Link to="/gigs" className="btn-primary">Find a Freelancer</Link>
                <Link to="/register" className="btn-outline">Become a Seller</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
