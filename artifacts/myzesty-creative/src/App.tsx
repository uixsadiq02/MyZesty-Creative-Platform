import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight, ChevronRight, Menu, Play, Sparkles, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type RevealProps = { children: ReactNode; className?: string; delay?: number };

function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${delay ? `reveal-delay-${delay}` : ''} ${className}`}
    >
      {children}
    </div>
  );
}

const navItems = [
  { label: 'Studio', href: '#studio' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Workflows', href: '#workflows' },
  { label: 'Tools', href: '#tools' },
  { label: 'Stories', href: '#stories' },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`top-nav fixed left-0 right-0 top-0 z-50 border-b border-transparent ${scrolled ? 'scrolled' : ''}`}>
      <div className="page-shell flex h-[72px] items-center justify-between">
        <a href="#top" className="logo-mark" data-testid="link-logo">
          <span className="logo-dot" aria-hidden="true" />
          myzesty
        </a>
        <nav className="desktop-nav flex items-center gap-8" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a href={item.href} className="nav-link" key={item.href} data-testid={`link-nav-${item.label.toLowerCase()}`}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href="https://myzesty.com" target="_blank" rel="noreferrer" className="nav-cta" data-testid="link-open-platform">
            Open platform <ArrowUpRight size={14} />
          </a>
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="mobile-menu hidden rounded-full border border-[#3b3d48] p-2 text-[#ede9df]"
            onClick={() => setMenuOpen((open) => !open)}
            data-testid="button-mobile-menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="mobile-menu border-t border-[#2c2e39] bg-[#11121a] px-[15px] py-6">
          <div className="page-shell flex flex-col gap-5">
            {navItems.map((item) => (
              <a
                href={item.href}
                key={item.href}
                className="display-font text-3xl tracking-[-.06em] text-[#ede9df]"
                onClick={() => setMenuOpen(false)}
                data-testid={`link-mobile-${item.label.toLowerCase()}`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="page-shell">
      <div className="hero-grid">
        <Reveal>
          <div className="eyebrow mono-label">AI-driven photo &amp; video creation</div>
          <h1 className="hero-title display-font">
            Make it
            <br />
            <em>unmissable.</em>
          </h1>
          <div className="hero-underbar">
            <span className="mono-label">One idea → a complete visual system</span>
            <span className="hero-underbar-line" aria-hidden="true" />
            <span className="mono-label text-[#686974]">01 — 04</span>
          </div>
        </Reveal>
        <Reveal delay={1} className="hero-right">
          <div className="hero-proof">
            <div className="hero-proof-top">
              <span className="mono-label lime">Creative system / live</span>
              <span className="mono-label text-[#686974]">MYZ-01</span>
            </div>
            <div className="hero-proof-art">
              <img src="/motion-ribbon.jpg" alt="Abstract chrome ribbon and lime cube" />
              <div className="hero-proof-grid" aria-hidden="true" />
              <span className="hero-float-tag tag-top">prompt</span>
              <span className="hero-float-tag tag-right">9:16</span>
              <span className="hero-float-tag tag-bottom">reference → remix</span>
              <span className="hero-play"><Play size={14} fill="currentColor" /></span>
            </div>
            <div className="hero-proof-bottom">
              <strong>Make one thought<br />travel further.</strong>
              <span>Image / video / edit</span>
            </div>
          </div>
          <p className="hero-intro-copy">Generate and edit videos that fuel your feed and build your brand.</p>
          <div className="hero-actions">
            <a href="#studio" className="pill-action" data-testid="link-hero-start">
              Start creating <ArrowDownRight size={15} />
            </a>
            <a href="#showcase" className="text-action" data-testid="link-hero-explore">
              Explore work <ChevronRight size={14} />
            </a>
          </div>
        </Reveal>
      </div>
      <Reveal delay={2}>
        <div className="hero-strip" aria-label="MyZesty creative output">
          <a href="#campaign" className="visual-frame" data-testid="link-hero-campaign">
            <img src="/editorial-car.jpg" alt="Cobalt sports car editorial campaign" />
            <div className="frame-overlay" />
            <div className="frame-caption">
              <span>Brand worlds, built fast</span>
              <span className="mono-label lime">01 / 03</span>
            </div>
          </a>
          <a href="#tools" className="visual-frame" data-testid="link-hero-product">
            <img src="/product-still.jpg" alt="Amber glass product still life" />
            <div className="frame-overlay" />
            <div className="frame-caption"><span className="mono-label">Product Promo</span></div>
          </a>
          <a href="#showcase" className="visual-frame" data-testid="link-hero-portrait">
            <img src="/portrait-editorial.jpg" alt="Editorial portrait with sculptural makeup" />
            <div className="frame-overlay" />
            <div className="frame-caption"><span className="mono-label">Story+</span></div>
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function StudioSection() {
  return (
    <section id="studio" className="section page-shell">
      <Reveal>
        <div className="section-heading">
          <div>
            <div className="eyebrow mono-label"><span className="number">01</span> One studio, every format</div>
            <h2>From first frame to <span className="lime">feed-ready.</span></h2>
          </div>
          <p>Ideas rarely arrive in the right ratio. MyZesty gets them there without losing the feeling.</p>
        </div>
      </Reveal>
      <div className="masonry" id="showcase">
        <Reveal className="tile tile-a">
          <a href="#campaign" className="tile h-full" data-testid="link-showcase-car">
            <img src="/editorial-car.jpg" alt="Cobalt car on a salt flat" />
            <span className="tile-tag mono-label">AI Animate</span>
          </a>
        </Reveal>
        <Reveal delay={1} className="tile tile-b">
          <a href="#tools" className="tile h-full" data-testid="link-showcase-product">
            <img src="/product-still.jpg" alt="Amber perfume bottle and chrome sphere" />
            <span className="tile-tag mono-label">Product Promo</span>
          </a>
        </Reveal>
        <Reveal delay={2} className="tile tile-c">
          <a href="#stories" className="tile h-full" data-testid="link-showcase-portrait">
            <img src="/portrait-editorial.jpg" alt="Editorial fashion portrait" />
            <span className="tile-tag mono-label">Avatar Character</span>
          </a>
        </Reveal>
        <Reveal delay={1} className="tile tile-d">
          <a href="#tools" className="tile h-full" data-testid="link-showcase-motion">
            <img src="/motion-ribbon.jpg" alt="Chrome ribbon and lime cube" />
            <span className="tile-tag mono-label">Video Effects</span>
          </a>
        </Reveal>
        <Reveal delay={2} className="tile tile-e">
          <a href="#stories" className="tile h-full" data-testid="link-showcase-story">
            <img src="/portrait-editorial.jpg" alt="Warm editorial portrait crop" />
            <span className="tile-tag mono-label">Story+</span>
          </a>
        </Reveal>
        <Reveal delay={3} className="tile tile-f">
          <a href="#campaign" className="tile h-full" data-testid="link-showcase-campaign">
            <img src="/motion-ribbon.jpg" alt="Abstract motion design scene" />
            <span className="tile-tag mono-label">Slow Motion</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function CampaignSection() {
  return (
    <section id="campaign" className="page-shell">
      <Reveal>
        <div className="feature-band">
          <img src="/editorial-car.jpg" alt="Cobalt car campaign world" />
          <div className="feature-content">
            <div className="mono-label">Featured campaign / 2025</div>
            <h2>Build a world<br />around one idea.</h2>
            <a href="#tools" className="pill-action" data-testid="link-campaign-tools">
              See the toolkit <ArrowDownRight size={15} />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function WorkflowSection() {
  const formats = [
    ['01', 'Start with a spark', 'Prompt, reference image, rough cut, or product shot.'],
    ['02', 'Shape the direction', 'Build a world, swap the subject, tune the motion.'],
    ['03', 'Send it everywhere', 'Adapt one idea for stories, feeds, ads, and launches.'],
  ];
  const formatLabels = ['9:16', '1:1', '16:9'];

  return (
    <section id="workflows" className="workflow-section page-shell">
      <Reveal>
        <div className="section-heading workflow-heading">
          <div>
            <div className="eyebrow mono-label"><span className="number">02</span> Made for the way content moves</div>
            <h2>One idea.<br /><span className="coral">Many lives.</span></h2>
          </div>
          <p>The strongest creative tools do more than generate. They help an idea survive every crop, cut, and channel.</p>
        </div>
      </Reveal>
      <div className="workflow-layout">
        <Reveal className="workflow-format-card">
          <div className="workflow-card-top">
            <span className="mono-label">The format check</span>
            <span className="mono-label text-[#686974]">Ready to publish</span>
          </div>
          <div className="format-stage">
            <div className="format-frame format-frame-tall"><span>story</span></div>
            <div className="format-frame format-frame-square"><span>feed</span></div>
            <div className="format-frame format-frame-wide"><span>film</span></div>
          </div>
          <div className="format-labels">
            {formatLabels.map((label) => <span key={label}>{label}</span>)}
          </div>
          <p>Keep the feeling. Change the frame.</p>
        </Reveal>
        <div className="workflow-steps">
          {formats.map(([number, title, description], index) => (
            <Reveal key={number} delay={index + 1} className="workflow-step">
              <span className="workflow-number mono-label">{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <ChevronRight size={17} />
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal delay={2} className="audience-rail">
        <div><span className="mono-label">For creators</span><strong>Make your next post feel like a first.</strong></div>
        <div><span className="mono-label">For brands</span><strong>Turn a product shot into a campaign world.</strong></div>
        <div><span className="mono-label">For teams</span><strong>Move from brief to more usable cuts.</strong></div>
      </Reveal>
    </section>
  );
}

const tools = ['AI Studio', 'Ads Creator', 'Product Promo', 'Story+', 'AI Animate', 'AI Character', 'Avatar Character', 'Remove Background', 'Video Effects', 'Slow Motion', 'Color Correction', 'Resize Photo', 'Photo Filters'];

function ToolsSection() {
  const [activeTool, setActiveTool] = useState('AI Studio');
  return (
    <section id="tools" className="section page-shell">
      <Reveal>
        <div className="section-heading">
          <div>
            <div className="eyebrow mono-label"><span className="number">03</span> The creative toolkit</div>
            <h2>Less wrestling.<br /><span className="cyan">More making.</span></h2>
          </div>
          <p>Professional control, compressed into the moment between an idea and a post.</p>
        </div>
      </Reveal>
      <div className="tool-layout">
        <Reveal>
          <div className="tool-list" role="list" aria-label="MyZesty tools">
            {tools.map((tool, index) => (
              <button
                type="button"
                key={tool}
                className={`tool-row w-full text-left ${tool === activeTool ? 'active' : ''}`}
                onClick={() => setActiveTool(tool)}
                data-testid={`button-tool-${index}`}
              >
                <span>{tool}</span>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </Reveal>
        <Reveal delay={1}>
          <div className="tool-preview">
            <img src={activeTool === 'AI Studio' ? '/product-still.jpg' : activeTool === 'AI Animate' ? '/motion-ribbon.jpg' : '/portrait-editorial.jpg'} alt={`${activeTool} preview`} data-testid="img-tool-preview" />
            <div className="preview-label">
              <strong>{activeTool}</strong>
              <span className="mono-label lime">Select / remix</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TiersSection() {
  const tiers = [
    ['Economical', 'Quick iterations for everyday content.'],
    ['Standard', 'A balanced canvas for your regular rhythm.'],
    ['Professional', 'More detail when the moment needs it.'],
    ['Premium', 'Your biggest ideas, in their best light.'],
  ];
  return (
    <section className="tier-section" aria-labelledby="tier-title">
      <div className="page-shell">
        <Reveal>
          <div className="section-heading">
            <div>
              <div className="eyebrow mono-label"><span className="number">04</span> Pick your finish</div>
              <h2 id="tier-title">Every idea<br />has a <span>setting.</span></h2>
            </div>
            <p>Move quickly or go all in. Choose the model tier for the work in front of you.</p>
          </div>
        </Reveal>
        <div className="tier-grid">
          {tiers.map(([name, description], index) => (
            <Reveal key={name} delay={index + 1} className="tier">
              <span className="tier-mark" />
              <h3>{name}</h3>
              <p>{description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoriesSection() {
  return (
    <section id="stories" className="section page-shell">
      <Reveal>
        <div className="section-heading">
          <div>
            <div className="eyebrow mono-label"><span className="number">05</span> Made with MyZesty</div>
            <h2>Good work<br /><span className="coral">travels.</span></h2>
          </div>
          <p>Built for the teams and one-person studios making tomorrow&apos;s visual language today.</p>
        </div>
      </Reveal>
      <div className="proof-grid">
        <Reveal className="proof-card">
          <small>Creator / Seoul</small>
          <blockquote>“It gets me from rough thought to something I&apos;m proud to share.”</blockquote>
          <div className="stat-row"><strong>4.8</strong><span className="mono-label">user rating</span></div>
        </Reveal>
        <Reveal delay={1} className="proof-card featured">
          <small>Built for momentum</small>
          <blockquote>Make the cut.<br />Then make it move.</blockquote>
          <div className="stat-row"><strong>1M+</strong><span className="mono-label">pieces created</span></div>
        </Reveal>
        <Reveal delay={2} className="proof-card">
          <small>Brand / New York</small>
          <blockquote>“The fastest part of a campaign is finally the part where we make.”</blockquote>
          <div className="stat-row"><strong>500K+</strong><span className="mono-label">downloads</span></div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <>
      <section className="close-section page-shell">
        <Reveal>
          <div className="close-inner">
            <div>
              <div className="eyebrow mono-label">Your next post starts here</div>
              <h2 className="close-title">Make it<br /><span>yours.</span></h2>
            </div>
            <div className="close-copy">
              <p>Bring the spark. We&apos;ll handle the blank canvas.</p>
              <a href="https://myzesty.com" target="_blank" rel="noreferrer" className="pill-action mt-5" data-testid="link-footer-platform">
                Open MyZesty <Sparkles size={14} />
              </a>
            </div>
          </div>
        </Reveal>
      </section>
      <footer className="footer">
        <div className="page-shell footer-grid">
          <a href="#top" className="logo-mark" data-testid="link-footer-logo"><span className="logo-dot" aria-hidden="true" />myzesty</a>
          <div className="footer-links">
            <a href="#studio" data-testid="link-footer-studio">Studio</a>
            <a href="#showcase" data-testid="link-footer-showcase">Showcase</a>
            <a href="#tools" data-testid="link-footer-tools">Tools</a>
            <a href="#top" data-testid="link-footer-top">Back to top ↑</a>
          </div>
          <span className="mono-label text-[#666871]">© 2025 MyZesty</span>
        </div>
      </footer>
    </>
  );
}

function Home() {
  useEffect(() => {
    document.title = 'MyZesty — AI-Driven Photo & Video Creation';
    const description = 'Generate and edit videos that fuel your feed and build your brand with MyZesty.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
  }, []);

  return (
    <div className="zesty-page min-h-[100dvh]">
      <Header />
      <main>
        <Hero />
        <StudioSection />
        <CampaignSection />
        <WorkflowSection />
        <ToolsSection />
        <TiersSection />
        <StoriesSection />
        <Footer />
      </main>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;