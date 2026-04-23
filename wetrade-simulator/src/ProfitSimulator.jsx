import React, { useState, useMemo, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';

// Real WeTrade brand assets (base64-encoded from official logo + favicon)
const LOGO = "/logo.png";
const FAVICON = "/favicon.png";

// WeTrade brand palette — sampled from the actual logo (#FB5000)
const C = {
  bg: '#000000',
  bgCard: '#0D0D0D',
  bgInner: '#080808',
  bgHover: '#171717',
  border: 'rgba(255,255,255,0.08)',
  borderSoft: 'rgba(255,255,255,0.04)',
  orange: '#FB5000',
  orangeBright: '#FF7530',
  orangeDark: '#C74000',
  orangeGlow: 'rgba(251,80,0,0.4)',
  green: '#22C55E',
  red: '#EF4444',
  amber: '#FFA726',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#5A5A5A',
};

// CTA destination — portal login with locale-aware rewards redirect
const CTA_URLS = {
  en: 'https://portal.wetrade.com/login?redirect=%2Fcampaign%2Frewards%3Flanguage%3Den',
  id: 'https://portal.wetrade.com/login?redirect=%2Fcampaign%2Frewards%3Flanguage%3Did',
  th: 'https://portal.wetrade.com/login?redirect=%2Fcampaign%2Frewards%3Flanguage%3Dth',
};

// Translations for EN / ID / TH
const T = {
  en: {
    livePill: 'LIVE LEADERBOARD',
    seasonPill: '2026 SEASON 1 · LIVE NOW',
    headlineStart: 'What if you',
    headlineAccent: 'copied a top trader?',
    subtitle: 'See your projected 7-day balance based on real Season 1 leaderboard performance. Pick your deposit, pick a trader, see the math.',
    statTotalPool: 'Total Prize Pool',
    statTopRate: 'Top Profit Rate',
    statWeekly: 'Weekly Rewards',
    statFree: 'Free to Copy',
    step01: 'STEP 01',
    balanceTitle: 'Your starting balance',
    depositLabel: 'DEPOSIT',
    step02: 'STEP 02',
    traderTitle: 'Pick a trader from the leaderboard',
    riskHigh: 'HIGH RISK',
    riskMedium: 'MEDIUM RISK',
    riskLow: 'LOW RISK',
    seasonLabel: 'SEASON',
    projectedLabel: 'PROJECTED BALANCE · DAY 7',
    fromPrefix: 'From',
    copyingLabel: 'copying',
    startingStat: 'STARTING',
    profitStat: 'TOTAL PROFIT',
    roiStat: 'ROI · 7D',
    ctaText: 'Start 1-Click Copy Trading',
    trustZero: 'Zero Commission',
    trustRegulated: 'Regulated & Secure',
    trustSync: 'Live Trade Sync',
    trustStop: 'Stop Anytime',
    disclaimer: "Simulated outcome based on selected trader's recent 7-day performance. Past performance is not indicative of future results. Trading leveraged CFDs carries a high degree of risk and may not be suitable for all investors.",
    balanceTooltip: 'Balance',
    axisStart: 'Start',
    dayLabel: (n) => `Day ${n}`,
  },
  id: {
    livePill: 'PAPAN PERINGKAT LIVE',
    seasonPill: '2026 SEASON 1 · LIVE SEKARANG',
    headlineStart: 'Bagaimana jika Anda',
    headlineAccent: 'menyalin trader top?',
    subtitle: 'Lihat proyeksi saldo 7 hari Anda berdasarkan performa leaderboard Season 1 yang sebenarnya. Pilih deposit, pilih trader, lihat hasilnya.',
    statTotalPool: 'Total Hadiah',
    statTopRate: 'Profit Rate Tertinggi',
    statWeekly: 'Hadiah Mingguan',
    statFree: 'Gratis Copy',
    step01: 'LANGKAH 01',
    balanceTitle: 'Saldo awal Anda',
    depositLabel: 'DEPOSIT',
    step02: 'LANGKAH 02',
    traderTitle: 'Pilih trader dari leaderboard',
    riskHigh: 'RISIKO TINGGI',
    riskMedium: 'RISIKO SEDANG',
    riskLow: 'RISIKO RENDAH',
    seasonLabel: 'SEASON',
    projectedLabel: 'PROYEKSI SALDO · HARI 7',
    fromPrefix: 'Dari',
    copyingLabel: 'menyalin',
    startingStat: 'SALDO AWAL',
    profitStat: 'TOTAL PROFIT',
    roiStat: 'ROI · 7H',
    ctaText: 'Mulai 1-Click Copy Trading',
    trustZero: 'Tanpa Komisi',
    trustRegulated: 'Teregulasi & Aman',
    trustSync: 'Sinkron Live',
    trustStop: 'Berhenti Kapan Saja',
    disclaimer: 'Hasil simulasi berdasarkan performa 7 hari terakhir trader terpilih. Kinerja masa lalu tidak menjamin hasil di masa depan. Perdagangan CFD memiliki risiko kerugian yang tinggi dan mungkin tidak cocok untuk semua investor.',
    balanceTooltip: 'Saldo',
    axisStart: 'Mulai',
    dayLabel: (n) => `Hari ${n}`,
  },
  th: {
    livePill: 'ลีดเดอร์บอร์ดสด',
    seasonPill: 'ซีซัน 1 ปี 2026 · ถ่ายทอดสด',
    headlineStart: 'จะเป็นอย่างไรถ้าคุณ',
    headlineAccent: 'ก๊อปปี้เทรดเดอร์อันดับต้น?',
    subtitle: 'ดูยอดคงเหลือประมาณการ 7 วันของคุณจากผลงานจริงบนลีดเดอร์บอร์ดซีซัน 1 เลือกยอดฝาก เลือกเทรดเดอร์ แล้วดูผลลัพธ์',
    statTotalPool: 'เงินรางวัลรวม',
    statTopRate: 'อัตรากำไรสูงสุด',
    statWeekly: 'รางวัลรายสัปดาห์',
    statFree: 'ก๊อปปี้ฟรี',
    step01: 'ขั้นที่ 01',
    balanceTitle: 'ยอดเงินเริ่มต้นของคุณ',
    depositLabel: 'ฝากเงิน',
    step02: 'ขั้นที่ 02',
    traderTitle: 'เลือกเทรดเดอร์จากลีดเดอร์บอร์ด',
    riskHigh: 'ความเสี่ยงสูง',
    riskMedium: 'ความเสี่ยงปานกลาง',
    riskLow: 'ความเสี่ยงต่ำ',
    seasonLabel: 'ซีซัน',
    projectedLabel: 'ยอดคาดการณ์ · วันที่ 7',
    fromPrefix: 'จาก',
    copyingLabel: 'ก๊อปปี้',
    startingStat: 'ยอดเริ่มต้น',
    profitStat: 'กำไรรวม',
    roiStat: 'ROI · 7 วัน',
    ctaText: 'เริ่มก๊อปปี้เทรด 1-Click',
    trustZero: 'ไม่มีค่าคอมมิชชัน',
    trustRegulated: 'ถูกกำกับและปลอดภัย',
    trustSync: 'ซิงก์เทรดเรียลไทม์',
    trustStop: 'หยุดได้ทุกเมื่อ',
    disclaimer: 'ผลลัพธ์จำลองขึ้นอยู่กับผลงาน 7 วันล่าสุดของเทรดเดอร์ที่เลือก ผลงานในอดีตไม่ได้รับประกันผลลัพธ์ในอนาคต การเทรด CFD มีความเสี่ยงสูงและอาจไม่เหมาะกับนักลงทุนทุกคน',
    balanceTooltip: 'ยอดคงเหลือ',
    axisStart: 'เริ่ม',
    dayLabel: (n) => `วันที่ ${n}`,
  },
};

// Real Season 1 · 2026 top 3 from the live leaderboard
const TRADERS = [
  {
    id: 'ycf888',
    handle: 'ycf888',
    acc: '7235598',
    platform: 'MT4',
    rank: 1,
    seasonProfit: 5634,
    seasonPrize: 250000,
    markets: 'Gold · Indices · FX',
    risk: 'high',
    riskColor: '#EF4444',
    dailyReturns: [0.055, 0.042, -0.020, 0.068, 0.048, 0.078, 0.065],
  },
  {
    id: 'yldg',
    handle: 'yldg',
    acc: '7243328',
    platform: 'MT4',
    rank: 2,
    seasonProfit: 3020,
    seasonPrize: 75000,
    markets: 'Gold · Oil',
    risk: 'medium',
    riskColor: '#FFA726',
    dailyReturns: [0.035, 0.028, -0.015, 0.042, 0.030, 0.050, 0.045],
  },
  {
    id: 'bai9903',
    handle: 'bai9903',
    acc: '7223601',
    platform: 'MT4',
    rank: 3,
    seasonProfit: 2900,
    seasonPrize: 50000,
    markets: 'FX Majors',
    risk: 'low',
    riskColor: '#22C55E',
    dailyReturns: [0.020, 0.015, -0.008, 0.025, 0.018, 0.028, 0.025],
  },
];

const BALANCES = [500, 1000, 2000];
const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'id', label: 'ID' },
  { code: 'th', label: 'TH' },
];

const usd = (n) =>
  '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const usdInt = (n) => '$' + Math.round(n).toLocaleString('en-US');

const rankGradient = (rank) => {
  if (rank === 1) return 'linear-gradient(135deg, #FFD700, #FF9500)';
  if (rank === 2) return 'linear-gradient(135deg, #E8E8E8, #9A9A9A)';
  return 'linear-gradient(135deg, #CD7F32, #8B5A2B)';
};

const riskText = (t, risk) => {
  if (risk === 'high') return t.riskHigh;
  if (risk === 'medium') return t.riskMedium;
  return t.riskLow;
};

// Read ?lang= from URL on first render; fall back to 'en' if missing or unknown
const getInitialLang = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('lang');
    if (raw && T[raw.toLowerCase()]) return raw.toLowerCase();
  } catch (e) {
    // sandboxed iframes may block location access — safe to ignore
  }
  return 'en';
};

export default function ProfitSimulator() {
  const [balance, setBalance] = useState(1000);
  const [traderId, setTraderId] = useState('yldg');
  const [lang, setLang] = useState(getInitialLang);
  const t = T[lang];

  // Switching language also updates ?lang= in the URL so links are shareable
  const changeLang = (newLang) => {
    setLang(newLang);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLang);
      window.history.replaceState({}, '', url);
    } catch (e) {
      // some iframe sandboxes block history API — state still updates fine
    }
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    // Kanit covers Thai glyphs for display/body; fallback stack handles the rest
    link.href =
      'https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&family=Kanit:wght@400;500;700;900&display=swap';
    document.head.appendChild(link);
    let fav = document.querySelector("link[rel='icon']");
    if (!fav) {
      fav = document.createElement('link');
      fav.rel = 'icon';
      document.head.appendChild(fav);
    }
    fav.href = FAVICON;
    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, []);

  const trader = TRADERS.find((t) => t.id === traderId);

  const chartData = useMemo(() => {
    const data = [{ day: t.axisStart, label: t.dayLabel(0), value: balance }];
    let current = balance;
    for (let i = 0; i < 7; i++) {
      current = current * (1 + trader.dailyReturns[i]);
      data.push({
        day: `D${i + 1}`,
        label: t.dayLabel(i + 1),
        value: Math.round(current * 100) / 100,
      });
    }
    return data;
  }, [balance, trader, lang]);

  const finalBalance = chartData[chartData.length - 1].value;
  const totalProfit = finalBalance - balance;
  const profitPct = (totalProfit / balance) * 100;

  const fontDisplay = {
    fontFamily: "'Archivo Black', 'Kanit', 'DM Sans', system-ui, sans-serif",
  };
  const fontBody = { fontFamily: "'DM Sans', 'Kanit', system-ui, sans-serif" };
  const fontMono = {
    fontFamily: "'JetBrains Mono', 'Kanit', ui-monospace, monospace",
  };

  return (
    <div
      style={{
        background: C.bg,
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(251,80,0,0.1), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(251,80,0,0.06), transparent 60%)',
        ...fontBody,
        minHeight: '100vh',
        color: C.textPrimary,
      }}
      className="w-full p-4 sm:p-6 md:p-10"
    >
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.35); }
        }
        @keyframes cta-glow {
          0%, 100% { box-shadow: 0 14px 44px -10px rgba(251,80,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15); }
          50% { box-shadow: 0 18px 54px -8px rgba(251,80,0,0.6), inset 0 1px 0 rgba(255,255,255,0.18); }
        }
        .live-dot { animation: pulse-dot 1.6s ease-in-out infinite; }
        .cta-btn { animation: cta-glow 2.6s ease-in-out infinite; transition: transform 120ms ease, filter 200ms ease; text-decoration: none; }
        .cta-btn:hover { transform: translateY(-1px); filter: brightness(1.1); }
        .cta-btn:active { transform: translateY(0) scale(0.99); }
        .trader-row { transition: background 150ms ease, border-color 150ms ease; }
        .trader-row:hover { background: #141414; }
        .balance-btn { transition: all 150ms ease; }
        .balance-btn:hover { background: #141414; }
        .lang-btn { transition: background 150ms ease, color 150ms ease; }
        .brand-logo { height: 36px; width: auto; display: block; }
        @media (min-width: 640px) { .brand-logo { height: 44px; } }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <img src={LOGO} alt="WeTrade — In Trust We Trade" className="brand-logo" />
          <div className="flex items-center gap-3 flex-wrap">
            {/* Language switcher */}
            <div
              className="inline-flex items-center rounded-full p-0.5"
              style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
            >
              {LANGS.map((l) => {
                const active = lang === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => changeLang(l.code)}
                    className="lang-btn px-3 py-1 rounded-full"
                    style={{
                      background: active ? C.orange : 'transparent',
                      color: active ? '#fff' : C.textSecondary,
                      border: 'none',
                      ...fontMono,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                    }}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>
            {/* LIVE badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(251,80,0,0.1)',
                border: '1px solid rgba(251,80,0,0.35)',
                color: C.orange,
                ...fontMono,
                fontSize: 11,
                letterSpacing: '0.16em',
                fontWeight: 700,
              }}
            >
              <span
                className="live-dot"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: C.orange,
                  boxShadow: `0 0 10px ${C.orange}`,
                }}
              />
              {t.livePill}
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="mb-7">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5"
            style={{
              background: 'rgba(251,80,0,0.08)',
              border: '1px solid rgba(251,80,0,0.22)',
              color: C.orange,
              ...fontMono,
              fontSize: 10,
              letterSpacing: '0.2em',
              fontWeight: 700,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.orange }} />
            {t.seasonPill}
          </div>

          <h1
            className="mb-3"
            style={{
              ...fontDisplay,
              fontSize: 'clamp(32px, 6vw, 60px)',
              lineHeight: 1.02,
              letterSpacing: '-0.015em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            {t.headlineStart}{' '}
            <span style={{ color: C.orange }}>{t.headlineAccent}</span>
          </h1>
          <p
            className="text-base sm:text-lg max-w-xl mt-4"
            style={{ color: C.textSecondary }}
          >
            {t.subtitle}
          </p>
        </div>

        {/* Stats strip */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-0 rounded-xl overflow-hidden mb-6"
          style={{ border: `1px solid ${C.border}`, background: C.bgCard }}
        >
          <StatStrip value="$1M+" label={t.statTotalPool} accent={C.orange} />
          <StatStrip value="5,634%" label={t.statTopRate} accent={C.orange} divider />
          <StatStrip value="$2,000" label={t.statWeekly} accent={C.orange} divider />
          <StatStrip value="100%" label={t.statFree} accent={C.orange} divider />
        </div>

        {/* Main simulator card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
        >
          {/* Controls */}
          <div
            className="p-5 sm:p-7 md:p-8 space-y-7"
            style={{ borderBottom: `1px solid ${C.border}` }}
          >
            {/* Balance */}
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span
                  style={{
                    color: C.orange,
                    ...fontMono,
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    fontWeight: 700,
                  }}
                >
                  {t.step01}
                </span>
                <span className="text-sm font-semibold" style={{ color: C.textPrimary }}>
                  {t.balanceTitle}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {BALANCES.map((b) => {
                  const active = balance === b;
                  return (
                    <button
                      key={b}
                      onClick={() => setBalance(b)}
                      className="balance-btn relative py-4 sm:py-5 rounded-xl text-left px-4"
                      style={{
                        background: active ? 'rgba(251,80,0,0.1)' : C.bgInner,
                        border: active
                          ? `1.5px solid ${C.orange}`
                          : `1px solid ${C.border}`,
                        color: active ? C.orange : C.textPrimary,
                      }}
                    >
                      <div
                        style={{
                          opacity: 0.55,
                          ...fontMono,
                          fontSize: 10,
                          letterSpacing: '0.14em',
                          fontWeight: 600,
                          marginBottom: 4,
                        }}
                      >
                        {t.depositLabel}
                      </div>
                      <div style={{ ...fontMono, fontSize: 22, fontWeight: 700 }}>
                        ${b.toLocaleString()}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trader */}
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span
                  style={{
                    color: C.orange,
                    ...fontMono,
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    fontWeight: 700,
                  }}
                >
                  {t.step02}
                </span>
                <span className="text-sm font-semibold" style={{ color: C.textPrimary }}>
                  {t.traderTitle}
                </span>
              </div>
              <div className="space-y-2">
                {TRADERS.map((tr) => {
                  const active = traderId === tr.id;
                  return (
                    <button
                      key={tr.id}
                      onClick={() => setTraderId(tr.id)}
                      className="trader-row w-full p-3 sm:p-4 rounded-xl flex items-center gap-3 sm:gap-4 text-left"
                      style={{
                        background: active ? 'rgba(251,80,0,0.08)' : C.bgInner,
                        border: active
                          ? `1.5px solid ${C.orange}`
                          : `1px solid ${C.border}`,
                      }}
                    >
                      <div
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: rankGradient(tr.rank),
                          color: '#000',
                          ...fontDisplay,
                          fontSize: 18,
                        }}
                      >
                        {tr.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="text-sm sm:text-base font-bold"
                            style={{ color: C.textPrimary, ...fontMono }}
                          >
                            {tr.handle}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded"
                            style={{
                              background: `${tr.riskColor}1A`,
                              color: tr.riskColor,
                              fontSize: 10,
                              letterSpacing: '0.1em',
                              fontWeight: 700,
                              ...fontMono,
                            }}
                          >
                            {riskText(t, tr.risk)}
                          </span>
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: C.textSecondary, ...fontMono }}
                        >
                          Acc #{tr.acc} · {tr.platform} · {tr.markets}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div
                          style={{
                            color: C.orange,
                            ...fontMono,
                            fontWeight: 700,
                            fontSize: 15,
                          }}
                        >
                          +{tr.seasonProfit.toLocaleString()}%
                        </div>
                        <div
                          style={{
                            color: C.textMuted,
                            ...fontMono,
                            fontSize: 9,
                            letterSpacing: '0.18em',
                            fontWeight: 600,
                          }}
                        >
                          {t.seasonLabel}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="p-5 sm:p-7 md:p-8">
            <div className="mb-2">
              <div
                style={{
                  color: C.textMuted,
                  ...fontMono,
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                {t.projectedLabel}
              </div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span
                  style={{
                    color: C.textPrimary,
                    ...fontMono,
                    fontWeight: 700,
                    fontSize: 'clamp(32px, 6vw, 56px)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {usd(finalBalance)}
                </span>
                <div
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md"
                  style={{
                    background: `${C.green}1A`,
                    color: C.green,
                    ...fontMono,
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M5.5 1.5L10 8H1L5.5 1.5Z" fill="currentColor" />
                  </svg>
                  +{profitPct.toFixed(1)}%
                </div>
              </div>
              <div className="text-sm mt-2" style={{ color: C.textSecondary }}>
                {t.fromPrefix}{' '}
                <span style={{ ...fontMono, color: C.textPrimary, fontWeight: 700 }}>
                  ${balance.toLocaleString()}
                </span>{' '}
                · {t.copyingLabel}{' '}
                <span style={{ color: C.orange, fontWeight: 700, ...fontMono }}>
                  {trader.handle}
                </span>
              </div>
            </div>

            {/* Chart */}
            <div className="w-full h-64 sm:h-72 md:h-80 mt-6 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 16, left: -4, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.orange} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={C.orange} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.04)"
                    strokeDasharray="3 6"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke={C.textMuted}
                    tick={{
                      fill: C.textSecondary,
                      fontSize: 11,
                      fontFamily: "'JetBrains Mono', 'Kanit', monospace",
                    }}
                    axisLine={false}
                    tickLine={false}
                    dy={6}
                  />
                  <YAxis
                    stroke={C.textMuted}
                    tick={{
                      fill: C.textSecondary,
                      fontSize: 11,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => usdInt(v)}
                    domain={['dataMin - 10', 'dataMax + 20']}
                    width={64}
                  />
                  <Tooltip
                    contentStyle={{
                      background: C.bgInner,
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      fontSize: 12,
                      fontFamily: "'DM Sans', 'Kanit', sans-serif",
                      color: C.textPrimary,
                      padding: '10px 14px',
                      boxShadow: '0 10px 32px rgba(0,0,0,0.7)',
                    }}
                    labelStyle={{
                      color: C.textMuted,
                      fontSize: 10,
                      letterSpacing: '0.14em',
                      marginBottom: 4,
                      textTransform: 'uppercase',
                    }}
                    cursor={{ stroke: C.orange, strokeWidth: 1, strokeDasharray: '3 3' }}
                    formatter={(v) => [usd(v), t.balanceTooltip]}
                    labelFormatter={(_l, payload) => payload?.[0]?.payload?.label || _l}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={C.orange}
                    strokeWidth={2.5}
                    fill="url(#profitFill)"
                    dot={{ fill: C.bgCard, stroke: C.orange, strokeWidth: 2, r: 3.5 }}
                    activeDot={{ fill: C.orange, stroke: C.bgCard, strokeWidth: 2, r: 6 }}
                    animationDuration={700}
                  />
                  <ReferenceDot
                    x="D7"
                    y={finalBalance}
                    r={6}
                    fill={C.orange}
                    stroke={C.bgCard}
                    strokeWidth={3}
                    isFront
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
              <Stat label={t.startingStat} value={`$${balance.toLocaleString()}`} color={C.textPrimary} />
              <Stat label={t.profitStat} value={`+$${totalProfit.toFixed(2)}`} color={C.green} />
              <Stat label={t.roiStat} value={`+${profitPct.toFixed(1)}%`} color={C.green} />
            </div>

            {/* CTA — now a real link to the portal with locale-aware redirect */}
            <a
              href={CTA_URLS[lang]}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn w-full py-4 sm:py-5 rounded-xl flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${C.orangeBright}, ${C.orange})`,
                color: '#fff',
                border: 'none',
                ...fontDisplay,
                fontSize: 17,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ fontSize: 18 }}>⚡</span>
              {t.ctaText}
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 10H16M16 10L10 4M16 10L10 16"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            {/* Trust row */}
            <div
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-5"
              style={{
                color: C.textSecondary,
                fontSize: 11,
                letterSpacing: '0.1em',
                fontWeight: 600,
                ...fontMono,
                textTransform: 'uppercase',
              }}
            >
              <TrustItem label={t.trustZero} />
              <TrustItem label={t.trustRegulated} />
              <TrustItem label={t.trustSync} />
              <TrustItem label={t.trustStop} />
            </div>

            <p
              className="text-[11px] text-center mt-4 leading-relaxed max-w-xl mx-auto"
              style={{ color: C.textMuted }}
            >
              {t.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatStrip({ value, label, accent, divider }) {
  return (
    <div
      className="px-4 py-3 sm:py-4"
      style={{ borderLeft: divider ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
    >
      <div
        style={{
          color: accent,
          fontFamily: "'Archivo Black', 'Kanit', sans-serif",
          fontSize: 22,
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          color: '#9CA3AF',
          fontFamily: "'JetBrains Mono', 'Kanit', monospace",
          fontSize: 10,
          letterSpacing: '0.14em',
          fontWeight: 600,
          marginTop: 6,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div
      className="p-3 sm:p-4 rounded-xl"
      style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div
        style={{
          color: '#5A5A5A',
          fontFamily: "'JetBrains Mono', 'Kanit', monospace",
          fontSize: 10,
          letterSpacing: '0.14em',
          fontWeight: 700,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        className="text-base sm:text-lg md:text-xl"
        style={{
          color,
          fontFamily: "'JetBrains Mono', 'Kanit', monospace",
          fontWeight: 700,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function TrustItem({ label }) {
  return (
    <span className="flex items-center gap-1.5">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M2.5 6L5 8.5L10 3.5"
          stroke="#FB5000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </span>
  );
}
