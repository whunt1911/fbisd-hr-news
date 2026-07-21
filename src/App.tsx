import { useState, useEffect, useCallback } from "react";

// ── DESIGN TOKENS (from CLAUDE.md) ────────────────────────────────────────
const C = {
  red:    "#7A1515",
  gold:   "#B8923C",
  char:   "#1E1E1E",
  steel:  "#4A5568",
  bg:     "#F6F4F1",
  surf:   "#FFFFFF",
  border: "#E2E0DC",
  navy:   "#1B3461",
  green:  "#1A6B3A",
};

// ── TYPES ─────────────────────────────────────────────────────────────────
interface Article {
  title: string;
  summary: string;
  link: string;
  image?: string;
  source: string;
  date: string;
  category: string;
  impact?: "HIGH" | "MEDIUM" | "LOW";
  isLive?: boolean;
}

interface Bill {
  num: string;
  status: string;
  statusColor: string;
  title: string;
  author: string;
  desc: string;
  impact: string;
  link: string;
}

// ── CURATED FALLBACK DATA ─────────────────────────────────────────────────
const CURATED: Article[] = [
  { title: "SB 571 Transforms Texas Educator Misconduct Reporting", summary: "Senate Bill 571, signed June 20 2025, requires investigations to continue after employee resignation and SBEC notification within 7 business days. Criminal penalties apply for non-compliance.", link: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=SB571", source: "Texas Legislature", date: "Jun 20, 2025", category: "legislation", impact: "HIGH", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80" },
  { title: "HB 4623 Creates Personal Liability for Administrators Who Fail to Report Student Sexual Misconduct", summary: "Effective September 1 2025, campus and district administrators face personal criminal liability for failure to report or cover up sexual misconduct involving students.", link: "https://capitol.texas.gov", source: "Texas Legislature", date: "Sep 1, 2025", category: "legislation", impact: "HIGH", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80" },
  { title: "TEA 2025-26 Campus Accountability Ratings Expected This Fall", summary: "Texas Education Agency is expected to release campus and district accountability ratings Fall 2026. HR departments must prepare rapid-response protocols for any IR-designated campuses.", link: "https://tea.texas.gov/texas-schools/accountability", source: "Texas Education Agency", date: "Jul 2026", category: "ratings", impact: "HIGH", image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80" },
  { title: "HB 2 Teacher Pay Raises Are Live — Implementation Challenges Remain", summary: "House Bill 2 mandated significant teacher pay increases for 2025-26. Implementation across Texas school districts reveals salary schedule restructuring requirements and DOI certification elimination.", link: "https://tea.texas.gov/finance-and-grants/financial-compliance/educator-compensation", source: "Texas Education Agency", date: "Aug 2025", category: "compensation", impact: "HIGH", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80" },
  { title: "Texas Teacher Shortage Deepens — HR Recruitment Must Evolve", summary: "Texas is projected to need 70,000 additional teachers by 2030. Special education, bilingual, and STEM shortages are most acute. Large suburban districts face intensifying competition.", link: "https://tea.texas.gov/texas-educators/educator-initiatives-and-performance/educator-supply-and-demand", source: "TEA Supply Report", date: "Jul 2026", category: "workforce", impact: "HIGH", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80" },
  { title: "TRS-ActiveCare Premium Increases 9.7% — Employee Communication Needed", summary: "TRS-ActiveCare health insurance premiums increased an average of 9.7% for 2025-26 with additional increases projected for 2026-27. HR must communicate proactively and evaluate district contribution levels.", link: "https://www.trs.texas.gov/Pages/active_care.aspx", source: "Teacher Retirement System", date: "Jun 2025", category: "compensation", impact: "MEDIUM", image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80" },
  { title: "FBISD Redesigned Launches Seven New Programs — HR Must Build New Pipelines", summary: "Fort Bend ISD's FBISD Redesigned initiative launches seven new programs including Virtual High School, Mandarin Immersion, and Employee Childcare requiring specialized recruitment strategies.", link: "https://www.fortbendisd.com", source: "Fort Bend ISD", date: "Aug 2026", category: "hr-news", impact: "HIGH", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80" },
  { title: "Seven FBISD Elementary Schools Closing August 2026 — RIF and Reassignment Process", summary: "FBISD Board voted 4-3 to close seven elementary campuses to address $56.4M budget shortfall. HR must manage reduction-in-force, reassignment, and communication for affected staff.", link: "https://www.fortbendisd.com", source: "Fort Bend ISD", date: "Aug 2026", category: "hr-news", impact: "HIGH", image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&q=80" },
  { title: "DOI Certification Exemption Eliminated for K-5 — HR Must Act Now", summary: "Beginning 2025-26, Texas districts cannot use DOI exemptions in K-5 reading and math classrooms. Full certification required across all foundational subjects by 2029-30.", link: "https://tea.texas.gov/texas-educators/certification", source: "Texas Education Agency", date: "Sep 2025", category: "legislation", impact: "HIGH", image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80" },
  { title: "Non-Instructional Staff Retention Gap Demands Targeted Strategy", summary: "Public school districts experience a growing gap between teacher retention (88-90%) and non-instructional staff retention (72-76%). Support staff turnover creates significant operational costs.", link: "https://www.shrm.org", source: "SHRM Research", date: "Jul 2026", category: "workforce", impact: "MEDIUM", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" },
  { title: "TASB Policy Updates Following 89th Session — Districts Must Act", summary: "TASB has released updated policy guidance post-89th Session. Multiple D-series and F-series policies require local review and adoption by start of 2026-27 school year.", link: "https://www.tasb.org/services/policy-service/", source: "TASB", date: "Jun 2025", category: "legislation", impact: "MEDIUM", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" },
  { title: "Houston-Area District Salary Benchmarking — Where Does FBISD Stand?", summary: "Humble ISD leads at $66,000 starting, Fort Bend ISD at $62,000. HR must quantify and communicate FBISD's competitive advantages including $570/month health contribution and 150-day retirement payout.", link: "https://tea.texas.gov/finance-and-grants/financial-compliance/educator-compensation", source: "TEA Compensation Data", date: "2025-26", category: "compensation", impact: "MEDIUM", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80" },
];

const BILLS: Bill[] = [
  { num: "SB 571", status: "SIGNED LAW", statusColor: C.green, title: "Educator Misconduct Reporting Overhaul", author: "Sen. Bettencourt / Rep. Leach", desc: "Investigations continue after resignation. SBEC notified within 7 business days. Do Not Hire Registry expanded to contractors.", impact: "HIGH", link: "https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=SB571" },
  { num: "HB 2", status: "SIGNED LAW", statusColor: C.green, title: "Teacher Compensation and Certification", author: "Rep. Dutton / Sen. Creighton", desc: "New minimum teacher salary schedules. DOI exemptions phased out by 2029-30. Differentiated pay for high-need subjects.", impact: "HIGH", link: "https://capitol.texas.gov" },
  { num: "HB 4623", status: "SIGNED LAW", statusColor: C.green, title: "Administrator Liability for Student Misconduct", author: "Rep. Slawson", desc: "Personal criminal liability for campus and district administrators who fail to report or cover up sexual misconduct involving students.", impact: "HIGH", link: "https://capitol.texas.gov" },
  { num: "SB 11", status: "SIGNED LAW", statusColor: C.green, title: "School Safety Funding and Requirements", author: "Sen. Creighton", desc: "Increases safety funding. Mandates annual threat assessment training. Requires licensed mental health professionals at specified ratios.", impact: "MEDIUM", link: "https://capitol.texas.gov" },
  { num: "HB 3", status: "SIGNED LAW", statusColor: C.green, title: "Reading Academies and Literacy", author: "Rep. Cook", desc: "Expands teacher reading academy requirements. HR must track completion and manage compliance documentation for TEA.", impact: "MEDIUM", link: "https://capitol.texas.gov" },
  { num: "SB 2", status: "MONITORING", statusColor: C.gold, title: "Education Savings Accounts / School Choice", author: "Sen. Creighton", desc: "ESA program expansion creates enrollment and funding implications. HR should monitor enrollment trends and adjust staffing.", impact: "MEDIUM", link: "https://capitol.texas.gov" },
];

const TICKERS = [
  "SB 571: Investigations must continue after employee resignation — SBEC notification required within 7 business days",
  "TEA: 2025-26 campus accountability ratings expected Fall 2026",
  "HB 2: Teacher pay increases effective 2025-26 — DOI exemption eliminated for K-5",
  "TRS: ActiveCare premiums up 9.7% for 2025-26 — additional increase projected 2026-27",
  "HB 4623: Personal admin liability for failure to report student sexual misconduct",
  "FBISD: Amy Coleman Middle School opens August 2026 in Fresno",
  "TASB: Updated Policy DH guidance issued following SB 571 — review district alignment",
  "Texas: 70,000 additional teachers needed by 2030 — pipeline crisis deepens",
];

const TABS = ["All", "Legislation", "Campus Ratings", "HR News", "Workforce", "Compensation", "Bill Tracker"];
const CAT_MAP: Record<string, string> = {
  "All": "all", "Legislation": "legislation", "Campus Ratings": "ratings",
  "HR News": "hr-news", "Workforce": "workforce", "Compensation": "compensation",
};

// ── RSS FEEDS (via rss2json.com — works in real browser) ──────────────────
const RSS_FEEDS = [
  { label: "Texas Tribune", url: "https://www.texastribune.org/education/rss.xml", cat: "legislation" },
  { label: "EdWeek", url: "https://www.edweek.org/feed", cat: "workforce" },
  { label: "SHRM", url: "https://www.shrm.org/rss/pages/rss.aspx", cat: "hr-news" },
];

const RSS2JSON = "https://api.rss2json.com/v1/api.json?count=5&rss_url=";

async function fetchRSS(feed: { label: string; url: string; cat: string }): Promise<Article[]> {
  try {
    const res = await fetch(RSS2JSON + encodeURIComponent(feed.url));
    const data = await res.json();
    if (data.status !== "ok" || !data.items?.length) return [];
    return data.items.slice(0, 4).map((item: any) => ({
      title: item.title || "",
      summary: item.description?.replace(/<[^>]+>/g, "").slice(0, 200) + "…" || "",
      link: item.link || "#",
      image: item.thumbnail || item.enclosure?.link || "",
      source: feed.label,
      date: item.pubDate ? new Date(item.pubDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
      category: feed.cat,
      isLive: true,
    }));
  } catch {
    return [];
  }
}

// ── OPEN STATES API (Texas bills — needs free key from openstates.org) ───
async function fetchTexasBills(apiKey: string): Promise<Bill[]> {
  if (!apiKey) return [];
  try {
    const res = await fetch(
      `https://v3.openstates.org/bills?jurisdiction=us_tx&q=education+human+resources&sort=updated_desc&per_page=6&include=sponsorships`,
      { headers: { "X-API-Key": apiKey } }
    );
    const data = await res.json();
    if (!data.results?.length) return [];
    return data.results.map((b: any) => ({
      num: b.identifier || "",
      status: b.latest_action_description?.slice(0, 30) || "Active",
      statusColor: C.navy,
      title: b.title?.slice(0, 70) || "",
      author: b.sponsorships?.[0]?.name || "Texas Legislature",
      desc: b.abstract || b.title?.slice(0, 120) || "",
      impact: "MEDIUM",
      link: b.openstates_url || "https://openstates.org",
    }));
  } catch {
    return [];
  }
}

// ── IMPACT BADGE ─────────────────────────────────────────────────────────
function ImpactBadge({ level }: { level?: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    HIGH:   { bg: "#FEE2E2", text: "#7A1515" },
    MEDIUM: { bg: "#FEF3C7", text: "#92400E" },
    LOW:    { bg: "#DCFCE7", text: "#166534" },
  };
  if (!level || !colors[level]) return null;
  const { bg, text } = colors[level];
  return (
    <span style={{ background: bg, color: text, fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10, textTransform: "uppercase", letterSpacing: "0.5px", display: "inline-block" }}>
      {level} IMPACT
    </span>
  );
}

// ── LIVE BADGE ────────────────────────────────────────────────────────────
function LiveBadge() {
  return (
    <span style={{ background: C.green, color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 7px", borderRadius: 10, letterSpacing: "0.5px", marginLeft: 6 }}>
      ● LIVE
    </span>
  );
}

// ── ARTICLE CARD ──────────────────────────────────────────────────────────
function ArticleCard({ article, large = false }: { article: Article; large?: boolean }) {
  const catColors: Record<string, string> = {
    legislation: C.navy, ratings: C.green, "hr-news": C.red, workforce: "#6B4A00", compensation: "#4A1A6B",
  };
  const bg = catColors[article.category] || C.steel;

  if (large) {
    return (
      <a href={article.link} target="_blank" rel="noreferrer"
        style={{ display: "block", borderRadius: 12, overflow: "hidden", background: C.surf, border: `1px solid ${C.border}`, textDecoration: "none", color: "inherit", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 16 }}>
        {article.image && (
          <div style={{ height: 280, overflow: "hidden", position: "relative" }}>
            <img src={article.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
              <span style={{ background: bg, color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 12, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8, display: "inline-block" }}>
                {article.category.replace("-", " ")}
              </span>
              {article.isLive && <LiveBadge />}
              <h2 style={{ fontFamily: "'Montserrat', sans-serif", color: "#fff", fontSize: 22, fontWeight: 800, lineHeight: 1.25, margin: "6px 0 0" }}>
                {article.title}
              </h2>
            </div>
          </div>
        )}
        <div style={{ padding: 16 }}>
          {!article.image && (
            <>
              <div style={{ marginBottom: 6 }}>
                <span style={{ background: bg, color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 12, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                  {article.category.replace("-", " ")}
                </span>
                {article.isLive && <LiveBadge />}
              </div>
              <h2 style={{ fontFamily: "'Montserrat', sans-serif", color: C.char, fontSize: 20, fontWeight: 800, lineHeight: 1.3, marginBottom: 8 }}>{article.title}</h2>
            </>
          )}
          <p style={{ fontFamily: "'Google Sans Flex', sans-serif", color: C.steel, fontSize: 13, lineHeight: 1.7, marginBottom: 10 }}>{article.summary}</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Google Sans Flex', sans-serif", color: C.steel, fontSize: 11 }}>{article.source}</span>
              <span style={{ color: C.border }}>·</span>
              <span style={{ fontFamily: "'Google Sans Flex', sans-serif", color: C.steel, fontSize: 11 }}>{article.date}</span>
            </div>
            <ImpactBadge level={article.impact} />
          </div>
        </div>
      </a>
    );
  }

  return (
    <a href={article.link} target="_blank" rel="noreferrer"
      style={{ display: "flex", gap: 12, borderRadius: 10, overflow: "hidden", background: C.surf, border: `1px solid ${C.border}`, textDecoration: "none", color: "inherit", padding: 12, marginBottom: 10, transition: "box-shadow 0.15s" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.09)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
      {article.image && (
        <div style={{ width: 80, height: 70, borderRadius: 7, overflow: "hidden", flexShrink: 0 }}>
          <img src={article.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: 4 }}>
          <span style={{ background: bg, color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 7px", borderRadius: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {article.category.replace("-", " ")}
          </span>
          {article.isLive && <LiveBadge />}
        </div>
        <h3 style={{ fontFamily: "'Montserrat', sans-serif", color: C.char, fontSize: 13.5, fontWeight: 800, lineHeight: 1.35, marginBottom: 5 }}>{article.title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'Google Sans Flex', sans-serif", color: C.steel, fontSize: 10.5 }}>{article.source}</span>
          <span style={{ color: C.border }}>·</span>
          <span style={{ fontFamily: "'Google Sans Flex', sans-serif", color: C.steel, fontSize: 10.5 }}>{article.date}</span>
          <ImpactBadge level={article.impact} />
        </div>
      </div>
    </a>
  );
}

// ── BILL CARD ─────────────────────────────────────────────────────────────
function BillCard({ bill }: { bill: Bill }) {
  return (
    <div style={{ borderRadius: 10, overflow: "hidden", background: C.surf, border: `1px solid ${C.border}`, marginBottom: 10 }}>
      <div style={{ background: bill.statusColor, padding: "9px 13px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#fff", fontSize: 14, fontWeight: 700 }}>{bill.num}</span>
        <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 8px", borderRadius: 10, letterSpacing: "0.5px" }}>{bill.status}</span>
      </div>
      <div style={{ padding: "10px 13px" }}>
        <div style={{ fontFamily: "'Changa One', sans-serif", color: C.char, fontSize: 13, marginBottom: 4 }}>{bill.title}</div>
        <div style={{ fontFamily: "'Google Sans Flex', sans-serif", color: C.steel, fontSize: 11.5, lineHeight: 1.55, marginBottom: 8 }}>{bill.desc}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
          <span style={{ fontFamily: "'Google Sans Flex', sans-serif", color: C.steel, fontSize: 10.5 }}>{bill.author}</span>
          <a href={bill.link} target="_blank" rel="noreferrer"
            style={{ fontFamily: "'Google Sans Flex', sans-serif", color: C.red, fontSize: 10.5, fontWeight: 700, textDecoration: "none" }}>
            View Bill →
          </a>
        </div>
      </div>
    </div>
  );
}

// ── SKELETON LOADER ───────────────────────────────────────────────────────
function Skeleton({ h = 16, w = "100%", style = {} }: { h?: number; w?: string; style?: React.CSSProperties }) {
  return (
    <div style={{ height: h, width: w, background: "linear-gradient(90deg, #E8E5E0 25%, #F0EDE8 50%, #E8E5E0 75%)", backgroundSize: "200%", borderRadius: 6, animation: "shimmer 1.4s infinite", ...style }} />
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("All");
  const [articles, setArticles] = useState<Article[]>(CURATED);
  const [bills, setBills] = useState<Bill[]>(BILLS);
  const [loading, setLoading] = useState(false);
  const [tickerPos, setTickerPos] = useState(0);
  const [heroIdx, setHeroIdx] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const [showApiPanel, setShowApiPanel] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  const [liveCount, setLiveCount] = useState(0);
  const [searchQ, setSearchQ] = useState("");

  // ── Ticker ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setTickerPos(p => (p + 1) % TICKERS.length), 5000);
    return () => clearInterval(id);
  }, []);

  // ── Hero auto-advance ───────────────────────────────────────────────────
  const heroArticles = articles.filter(a => a.image).slice(0, 5);
  useEffect(() => {
    const id = setInterval(() => setHeroIdx(i => (i + 1) % Math.max(heroArticles.length, 1)), 7000);
    return () => clearInterval(id);
  }, [heroArticles.length]);

  // ── Fetch live data ─────────────────────────────────────────────────────
  const fetchLive = useCallback(async () => {
    setLoading(true);
    const results = await Promise.allSettled(RSS_FEEDS.map(fetchRSS));
    let live: Article[] = [];
    results.forEach(r => { if (r.status === "fulfilled") live = [...live, ...r.value]; });
    if (live.length > 0) {
      setArticles([...live, ...CURATED]);
      setLiveCount(live.length);
    }
    if (apiKey) {
      const liveBills = await fetchTexasBills(apiKey);
      if (liveBills.length > 0) setBills([...liveBills, ...BILLS]);
    }
    setLastUpdate(new Date().toLocaleTimeString());
    setLoading(false);
  }, [apiKey]);

  useEffect(() => { fetchLive(); }, []);
  useEffect(() => {
    const id = setInterval(fetchLive, 30 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetchLive]);

  // ── Filtered articles ───────────────────────────────────────────────────
  const catKey = CAT_MAP[activeTab] || "all";
  const filtered = articles.filter(a => {
    const matchCat = catKey === "all" || a.category === catKey;
    const matchQ = !searchQ || a.title.toLowerCase().includes(searchQ.toLowerCase()) || a.summary.toLowerCase().includes(searchQ.toLowerCase());
    return matchCat && matchQ;
  });
  const hero = heroArticles[heroIdx];

  // ── RENDER ──────────────────────────────────────────────────────────────
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Google Sans Flex', sans-serif" }}>
      {/* Inject fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Changa+One:ital@0;1&family=JetBrains+Mono:wght@400;700&family=Montserrat:wght@600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz@10..144&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes tickerSlide { 0%{opacity:0;transform:translateY(6px)} 20%{opacity:1;transform:translateY(0)} 80%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-6px)} }
        * { box-sizing: border-box; }
        a:hover h2, a:hover h3 { color: ${C.red}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
        @media (max-width: 768px) {
          .main-grid { flex-direction: column !important; }
          .sidebar { width: 100% !important; }
          .hero-content { padding: 14px !important; }
          .hero-content h2 { font-size: 16px !important; }
          .nav-scroll { overflow-x: auto; }
          .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .masthead-inner { flex-wrap: wrap; gap: 10px; }
          .search-wrap { width: 100% !important; }
          .stats-row { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{ background: "#111", padding: "5px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 16 }}>
          {["TEA Portal", "TLO Bills", "TASB Policy", "SBEC"].map(l => (
            <a key={l} href={l === "TEA Portal" ? "https://tea.texas.gov" : l === "TLO Bills" ? "https://capitol.texas.gov" : l === "TASB Policy" ? "https://www.tasb.org" : "https://sbec.texas.gov"} target="_blank" rel="noreferrer"
              style={{ color: "rgba(255,255,255,0.45)", fontSize: 10.5, textDecoration: "none", fontFamily: "'Google Sans Flex', sans-serif" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>
              {l}
            </a>
          ))}
        </div>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontFamily: "'Google Sans Flex', sans-serif" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })} · Updated {lastUpdate}
        </span>
      </div>

      {/* ── MASTHEAD ── */}
      <div style={{ background: C.red }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "13px 20px", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }} className="masthead-inner">
          {/* Logo — clean SVG recreation of official FBiSD wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, flexShrink: 0 }}>
            <svg viewBox="0 0 310 68" style={{ height: 52, width: "auto" }} aria-label="FBiSD — Inspire Equip Imagine">
              {/* ── Wordmark: FB ── */}
              <text x="0" y="50" fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
                fontSize="56" fontWeight="900" fill="#ffffff" letterSpacing="-1">FB</text>
              {/* ── Lowercase i (no dot — star replaces it) ── */}
              <text x="116" y="50" fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
                fontSize="48" fontWeight="900" fill="#ffffff">i</text>
              {/* ── 5-pointed star above the i ── */}
              <polygon
                points="130,3 133.5,13.5 144.5,13.5 136,20 139.5,30.5 130,24 120.5,30.5 124,20 115.5,13.5 126.5,13.5"
                fill="#ffffff" />
              {/* ── SD ── */}
              <text x="148" y="50" fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
                fontSize="56" fontWeight="900" fill="#ffffff" letterSpacing="-1">SD</text>
              {/* ── Tagline ── */}
              <text x="1" y="64" fontFamily="'Google Sans Flex', Arial, sans-serif"
                fontSize="9.5" fill="rgba(255,255,255,0.55)" letterSpacing="3.8"
                fontWeight="400">INSPIRE • EQUIP • IMAGINE</text>
            </svg>
            {/* ── Divider + site title ── */}
            <div style={{ marginLeft: 18, paddingLeft: 18, borderLeft: "1px solid rgba(255,255,255,0.2)" }}>
              <div style={{ fontFamily: "'Changa One', sans-serif", color: "#fff", fontSize: 18, letterSpacing: 0.5, lineHeight: 1 }}>HR Intelligence</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 9.5, letterSpacing: 2, textTransform: "uppercase", marginTop: 3, fontFamily: "'Google Sans Flex', sans-serif" }}>Human Resources Division</div>
            </div>
          </div>

          {/* Search */}
          <div style={{ flex: 1, minWidth: 200, position: "relative" }} className="search-wrap">
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search HR news, legislation, bills…"
              style={{ width: "100%", padding: "9px 14px 9px 38px", borderRadius: 7, border: "none", fontSize: 13, fontFamily: "'Google Sans Flex', sans-serif", background: "rgba(255,255,255,0.14)", color: "#fff", outline: "none" }}
              onFocus={e => (e.target.style.background = "rgba(255,255,255,0.22)")}
              onBlur={e => (e.target.style.background = "rgba(255,255,255,0.14)")} />
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.5)", fontSize: 15 }}>⌕</span>
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {liveCount > 0 && <span style={{ background: C.green, color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 10 }}>● {liveCount} LIVE</span>}
            <button onClick={fetchLive} disabled={loading}
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", padding: "7px 14px", borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: loading ? "default" : "pointer", fontFamily: "'Google Sans Flex', sans-serif" }}>
              {loading ? "…" : "↺ Refresh"}
            </button>
            <button onClick={() => setShowApiPanel(p => !p)}
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", padding: "7px 12px", borderRadius: 7, fontSize: 11, cursor: "pointer", fontFamily: "'Google Sans Flex', sans-serif" }}>
              ⚙ API
            </button>
          </div>
        </div>
        <div style={{ height: 3, background: C.gold }} />
      </div>

      {/* ── API PANEL ── */}
      {showApiPanel && (
        <div style={{ background: "#1C1A1A", padding: "12px 20px", borderBottom: `2px solid ${C.gold}` }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ color: C.gold, fontSize: 11, fontWeight: 700, fontFamily: "'Google Sans Flex', sans-serif" }}>Open States API Key (free at openstates.org):</span>
            <input value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Paste your free API key here for live Texas bill tracking"
              style={{ flex: 1, minWidth: 260, padding: "6px 12px", borderRadius: 6, border: `1px solid ${C.gold}`, background: "#2A2828", color: "#fff", fontSize: 12, fontFamily: "'Google Sans Flex', sans-serif", outline: "none" }} />
            <button onClick={() => { fetchLive(); setShowApiPanel(false); }}
              style={{ background: C.red, color: "#fff", padding: "6px 16px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Google Sans Flex', sans-serif" }}>
              Apply & Fetch
            </button>
            <a href="https://openstates.org/accounts/signup/" target="_blank" rel="noreferrer"
              style={{ color: "rgba(255,255,255,0.5)", fontSize: 10.5, fontFamily: "'Google Sans Flex', sans-serif" }}>
              Get free key →
            </a>
          </div>
        </div>
      )}

      {/* ── TICKER ── */}
      <div style={{ background: C.navy, padding: "6px 0", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ background: C.gold, color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 10px", letterSpacing: "0.8px", flexShrink: 0, fontFamily: "'Changa One', sans-serif" }}>BREAKING</span>
          <span key={tickerPos} style={{ color: "rgba(255,255,255,0.85)", fontSize: 11.5, fontFamily: "'Google Sans Flex', sans-serif", animation: "tickerSlide 5s ease-in-out forwards" }}>
            {TICKERS[tickerPos]}
          </span>
        </div>
      </div>

      {/* ── NAV TABS ── */}
      <div style={{ background: C.surf, borderBottom: `2px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", gap: 0, overflowX: "auto" }} className="nav-scroll">
          {(activeTab === "Bill Tracker" ? TABS : TABS).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: "12px 17px", fontSize: 12, fontWeight: 700, fontFamily: "'Google Sans Flex', sans-serif", color: activeTab === tab ? C.red : C.steel, borderBottom: activeTab === tab ? `3px solid ${C.red}` : "3px solid transparent", background: "none", cursor: "pointer", whiteSpace: "nowrap", letterSpacing: "0.2px" }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div style={{ maxWidth: 1200, margin: "16px auto 0", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }} className="stats-row">
          {[
            { num: "422", label: "FBISD Job Fair\nApplicants 2026", color: C.red, trend: "↑ +18% vs 2025" },
            { num: "13K", label: "FBISD Employees\n2025-26", color: C.navy, trend: "– Stable" },
            { num: "89th", label: "Texas Legislature\nSession — Closed", color: C.green, trend: "47 Ed Bills Passed" },
            { num: "9.7%", label: "TRS Premium\nIncrease 2025-26", color: "#7A1515", trend: "↑ Watching 2026-27" },
          ].map(s => (
            <div key={s.num} style={{ background: C.surf, borderRadius: 10, border: `1px solid ${C.border}`, padding: "13px 14px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Changa One', sans-serif", fontSize: 26, color: s.color, lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontFamily: "'Google Sans Flex', sans-serif", color: C.steel, fontSize: 10.5, lineHeight: 1.45, margin: "4px 0", whiteSpace: "pre-line" }}>{s.label}</div>
              <div style={{ fontFamily: "'Google Sans Flex', sans-serif", color: C.steel, fontSize: 10, fontWeight: 600 }}>{s.trend}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px 30px" }}>
        {activeTab === "Bill Tracker" ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.navy }} />
              <span style={{ fontFamily: "'Changa One', sans-serif", fontSize: 13, letterSpacing: "1px", textTransform: "uppercase" }}>Texas Legislative Bill Tracker — 89th Legislature</span>
              {!apiKey && <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 10, color: C.steel, background: "#FEF3C7", padding: "2px 8px", borderRadius: 8, color: "#92400E" }}>Add Open States API key for live data →</span>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 }}>
              {bills.map((b, i) => <BillCard key={i} bill={b} />)}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }} className="main-grid">
            {/* ── FEED ── */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Hero */}
              {hero && activeTab === "All" && (
                <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 16, cursor: "pointer" }}
                  onClick={() => window.open(hero.link, "_blank")}>
                  <div style={{ height: 300, position: "relative" }}>
                    <img src={hero.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => { (e.target as HTMLImageElement).parentElement!.style.background = C.navy; (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)" }} />
                    <div style={{ position: "absolute", bottom: 20, left: 22, right: 22 }} className="hero-content">
                      <span style={{ background: C.gold, color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 12, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8, display: "inline-block" }}>
                        {hero.category.replace("-", " ")}
                      </span>
                      {hero.isLive && <LiveBadge />}
                      <h2 style={{ fontFamily: "'Montserrat', sans-serif", color: "#fff", fontSize: 22, fontWeight: 800, lineHeight: 1.25, margin: "6px 0 8px" }}>{hero.title}</h2>
                      <p style={{ fontFamily: "'Google Sans Flex', sans-serif", color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{hero.summary.slice(0, 180)}…</p>
                    </div>
                  </div>
                  {/* Hero dots */}
                  {heroArticles.length > 1 && (
                    <div style={{ position: "absolute", bottom: 14, right: 16, display: "flex", gap: 5 }}>
                      {heroArticles.map((_, i) => (
                        <button key={i} onClick={e => { e.stopPropagation(); setHeroIdx(i); }}
                          style={{ width: 7, height: 7, borderRadius: "50%", background: i === heroIdx ? "#fff" : "rgba(255,255,255,0.35)", border: "none", cursor: "pointer", padding: 0 }} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Section header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.red }} />
                  <span style={{ fontFamily: "'Changa One', sans-serif", fontSize: 12, letterSpacing: "1px", textTransform: "uppercase", color: C.char }}>
                    {activeTab === "All" ? "Latest HR News" : activeTab}
                  </span>
                </div>
                {liveCount > 0 && <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 10, color: C.green, fontWeight: 600 }}>● {liveCount} live stories</span>}
              </div>

              {/* Articles */}
              {loading && filtered.length === 0 ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ background: C.surf, borderRadius: 10, border: `1px solid ${C.border}`, padding: 12, marginBottom: 10, display: "flex", gap: 12 }}>
                    <Skeleton h={70} w="80px" />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                      <Skeleton h={10} w="60px" /><Skeleton h={14} /><Skeleton h={14} w="80%" /><Skeleton h={10} w="40%" />
                    </div>
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: C.steel, fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13 }}>
                  No articles found. Try a different search or category.
                </div>
              ) : (
                filtered.slice(0, activeTab === "All" ? 2 : 0).map((a, i) => <ArticleCard key={i} article={a} large />)
                  .concat(filtered.slice(activeTab === "All" ? 2 : 0).map((a, i) => <ArticleCard key={`sm-${i}`} article={a} />))
              )}
            </div>

            {/* ── SIDEBAR ── */}
            <div style={{ width: 300, flexShrink: 0 }} className="sidebar">
              {/* Quick Bill Tracker */}
              <div style={{ background: C.surf, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 14 }}>
                <div style={{ background: C.navy, padding: "10px 13px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Changa One', sans-serif", color: "#fff", fontSize: 12 }}>BILL TRACKER</span>
                  <button onClick={() => setActiveTab("Bill Tracker")} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "rgba(255,255,255,0.7)", fontSize: 9, padding: "2px 8px", borderRadius: 8, cursor: "pointer", fontFamily: "'Google Sans Flex', sans-serif" }}>See All</button>
                </div>
                <div style={{ padding: "8px 13px" }}>
                  {BILLS.slice(0, 4).map((b, i) => (
                    <a key={i} href={b.link} target="_blank" rel="noreferrer"
                      style={{ display: "flex", gap: 8, padding: "7px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none", textDecoration: "none", color: "inherit" }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: b.statusColor, flexShrink: 0, marginTop: 2 }}>{b.num}</span>
                      <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11.5, color: C.char, lineHeight: 1.4 }}>{b.title}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Key Contacts */}
              <div style={{ background: C.surf, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 14 }}>
                <div style={{ background: C.red, padding: "10px 13px" }}>
                  <span style={{ fontFamily: "'Changa One', sans-serif", color: "#fff", fontSize: 12 }}>KEY CONTACTS</span>
                </div>
                <div style={{ padding: "8px 13px" }}>
                  {[
                    ["HR Division", "(281) 634-1000"],
                    ["CPS Hotline", "1-800-252-5400"],
                    ["FBISD Police", "(281) 634-1111"],
                    ["TEA / SBEC", "(512) 463-9734"],
                  ].map(([label, val]) => (
                    <div key={label} style={{ padding: "6px 0", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "'Google Sans Flex', sans-serif", color: C.steel, fontSize: 11 }}>{label}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.char, fontSize: 10.5, fontWeight: 700 }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TEA Quick Links */}
              <div style={{ background: C.surf, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 14 }}>
                <div style={{ background: C.green, padding: "10px 13px" }}>
                  <span style={{ fontFamily: "'Changa One', sans-serif", color: "#fff", fontSize: 12 }}>TEA QUICK LINKS</span>
                </div>
                <div style={{ padding: "8px 13px" }}>
                  {[
                    ["Accountability Ratings", "https://tea.texas.gov/texas-schools/accountability"],
                    ["Educator Certification", "https://tea.texas.gov/texas-educators/certification"],
                    ["Compensation Data", "https://tea.texas.gov/finance-and-grants/financial-compliance/educator-compensation"],
                    ["89th Session Updates", "https://tea.texas.gov/about-tea/government-relations-and-legal/government-relations/89th-legislature-updates"],
                    ["TRS ActiveCare", "https://www.trs.texas.gov/Pages/active_care.aspx"],
                  ].map(([label, link]) => (
                    <a key={label} href={link} target="_blank" rel="noreferrer"
                      style={{ display: "block", padding: "6px 0", borderBottom: `1px solid ${C.border}`, fontFamily: "'Google Sans Flex', sans-serif", color: C.navy, fontSize: 11.5, textDecoration: "none", fontWeight: 600 }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.red)} onMouseLeave={e => (e.currentTarget.style.color = C.navy)}>
                      {label} →
                    </a>
                  ))}
                </div>
              </div>

              {/* Code of Ethics */}
              <div style={{ background: C.surf, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                <div style={{ background: "#1C1A1A", padding: "10px 13px" }}>
                  <span style={{ fontFamily: "'Changa One', sans-serif", color: "#fff", fontSize: 12 }}>CODE OF ETHICS</span>
                </div>
                <div style={{ padding: "8px 13px" }}>
                  {[
                    ["Standard I", "Professional Ethical Conduct — accuracy, confidentiality, reporting violations"],
                    ["Standard II", "Toward Colleagues — not interfering with employment, no false statements"],
                    ["Standard III", "Toward Students — appropriate boundaries, not exploiting relationships"],
                  ].map(([std, desc]) => (
                    <div key={std} style={{ padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                      <div style={{ fontFamily: "'Google Sans Flex', sans-serif", color: C.red, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>{std}</div>
                      <div style={{ fontFamily: "'Google Sans Flex', sans-serif", color: C.steel, fontSize: 11, lineHeight: 1.45 }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: "#111", borderTop: `3px solid ${C.gold}`, padding: "18px 20px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Google Sans Flex', sans-serif", color: "rgba(255,255,255,0.4)", fontSize: 10.5, lineHeight: 1.8 }}>
          Fort Bend Independent School District · Human Resources Division · 16431 Lexington Blvd., Sugar Land, TX 77479 · (281) 634-1000
          <br />Sources: TEA, Texas Legislature Online (TLO), TASB, TRS, SHRM, EdWeek, Texas Tribune
          <br />Live news via Google News RSS · Texas bill tracking via Open States API · Data refreshes every 30 minutes
        </div>
      </div>
    </div>
  );
}
