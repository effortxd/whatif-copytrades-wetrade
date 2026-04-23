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
const LOGO = "data:image/jpeg;base64,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yvtmnauouVfcWCKeski6NkceclrBzye1aKTw6lTJytcULBptHZvfZ4b78r7+F7LbOKSe9sjbtba47rc7XtxtdfdYp6Cmu1PNc6M1lGx+ZoWv3S9vcepbb8GbOZJm1ceprjTQZ3nUr6TelH5IcDjxWingetCfMs0sBkNw4jp63WvT1YhGyWNdx1v8wQtj2h6gg1FqD33SQPipYoWQQCQ5eWNGAT3lNm1xo7RrKhuFwm6Gni6Tfduk4zG4DgO8ha4e3KZ7OaCnjEPYjday+GskdUe0u1de6vrHB9TK9py1z3EeYleKuceCtWYCwstZxuSVcOXJSNadWWyn2dvpZJD8OUsEtJR+Sf8AYykFxz3eV6VHIV2e0hYainZOAH8DdbVHWyUhcWcRbVbNs4u1DbNQPbdnubba2nkpaogE4Y4c+HYQCvl17d2XrVNXWwHNKCIqcdQiYN1uPAZ8VggcISSDlBTsE3bcbWQ1shphT/23v39Ft+y652u3V9zbdaz3nFV2+SmbJuF2HO4cgvT4A0QTn+nGP/t71pgKNPWvD6UmQyNeWk8rfUFZY68CFsT42uDb2vfj0IXrXshiqpY6ebp4mvIZJu4329RweWV86udyVq2gLLnk3N170L2x1cMjzhrZGuJ7gQs7tHuFJddZ19woZelppXNLH7pGcNA5HzLXm+fCZPgsZjaZBJxAI87fZZmzOEJi4Eg+X/K2LZtcaO1a1ttwr5uipoZC57sE4GCOQV1Pq280OoPf9NcqqVkc5eyOSVzmObk8CCeRC1sOwc4QEZzwXh1PG95e4XuLeH+FZY66aOJsbDaxvfv0+y2DXHwHNePftim/s1WwSupy0h1O8/KZ3jPIhZe26li03oiGnsFc6O8VtQZayWNpBiY3gxmSOOc54d60neOefmVC4+heXUrHxtjfqBz425817ZXvZK+Vgs5193C+8jvP1W4W/aPq+GuhmnvlTPEyQOfG8gh4B4g8FjtdyWibU1VV2OYSUVQ4TBu6R0bncXN49hytfyquJwvsdJDHJtsbsndppfqvMmITzQ9lK7a1uLkkjopFq5tKX7Sun6Ku1J8H1Fup3RyM96vkyXOzzHDq9a8bfc9IaQ3q6z1NRfLwGkU8ssHRQwOIxv4Jy4rQCVTPDisIoBYsLzsm+mltTflf4rZOKu2hII2h4AF9b6Cw3m19OS9qiZ9RUSTSuL5JHFznO5kniSpEvrtIagorO+q1T7xmpLfFTyRe9Hv8po48VGoKqCeeVmmpxKWkOItyt9QVr01aYWvaWhwda978DfgQs/qS2aeoqNj7TqP4TmL8Pj96uj3RjnkrXVe7OCrFljYWNsTc9/pZa00jXvu1ob3C/wBSUREXtYkREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREVclERFREREREREVclMlEREyVRERERERFXJTKIiJkqiIiIiIiIq5KIiJkplERFREREREREVcntTJRERMlMlERFRVyiIiZKZKIiKirkoiImSmUREQklURERERERf//Z";
const FAVICON = "data:image/jpeg;base64,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";

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
    projectionBadge: 'PROJECTION ONLY',
    modalTitle: 'Important Notice',
    modalBody: "Projection only. Past result doesn't represent future result.",
    modalSub: 'All figures shown are simulated based on recent historical performance. Actual trading involves substantial risk of loss and is not suitable for every investor.',
    modalAccept: 'I Understand — Continue',
    placeholderTitle: 'Ready to see your potential?',
    placeholderSub: 'Pick a deposit and a trader above to reveal your 7-day projection.',
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
    projectionBadge: 'HANYA PROYEKSI',
    modalTitle: 'Pemberitahuan Penting',
    modalBody: 'Hanya proyeksi. Hasil masa lalu tidak mewakili hasil di masa depan.',
    modalSub: 'Semua angka yang ditampilkan adalah simulasi berdasarkan performa historis. Perdagangan sebenarnya memiliki risiko kerugian yang besar dan tidak cocok untuk setiap investor.',
    modalAccept: 'Saya Mengerti — Lanjutkan',
    placeholderTitle: 'Siap melihat potensi Anda?',
    placeholderSub: 'Pilih deposit dan trader di atas untuk melihat proyeksi 7 hari Anda.',
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
    projectionBadge: 'เป็นเพียงการคาดการณ์',
    modalTitle: 'ประกาศสำคัญ',
    modalBody: 'เป็นเพียงการคาดการณ์เท่านั้น ผลงานในอดีตไม่ใช่ตัวแทนของผลลัพธ์ในอนาคต',
    modalSub: 'ตัวเลขทั้งหมดที่แสดงเป็นการจำลองจากผลงานในอดีต การเทรดจริงมีความเสี่ยงสูงที่จะขาดทุนและอาจไม่เหมาะกับนักลงทุนทุกคน',
    modalAccept: 'เข้าใจแล้ว — ดำเนินการต่อ',
    placeholderTitle: 'พร้อมดูศักยภาพของคุณหรือยัง?',
    placeholderSub: 'เลือกยอดฝากและเทรดเดอร์ด้านบนเพื่อดูการคาดการณ์ 7 วันของคุณ',
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

  // Disclaimer modal: shows after 6 seconds, OR on first balance/trader click — whichever comes first.
  // Dismissal is remembered per browser session so returning users aren't re-nagged.
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerAcked, setDisclaimerAcked] = useState(() => {
    try {
      return sessionStorage.getItem('wt_disclaimer_ack') === '1';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (disclaimerAcked) return;
    const timer = setTimeout(() => setShowDisclaimer(true), 6000);
    return () => clearTimeout(timer);
  }, [disclaimerAcked]);

  const triggerDisclaimer = () => {
    if (!disclaimerAcked) setShowDisclaimer(true);
  };

  const pickBalance = (b) => {
    setBalance(b);
    triggerDisclaimer();
  };
  const pickTrader = (id) => {
    setTraderId(id);
    triggerDisclaimer();
  };

  const acceptDisclaimer = () => {
    try {
      sessionStorage.setItem('wt_disclaimer_ack', '1');
    } catch (e) {
      // sessionStorage may be blocked in iframes — still dismiss the modal
    }
    setDisclaimerAcked(true);
    setShowDisclaimer(false);
  };

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
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes warn-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
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

      {showDisclaimer && <DisclaimerModal t={t} onAccept={acceptDisclaimer} />}

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
                      onClick={() => pickBalance(b)}
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
                      onClick={() => pickTrader(tr.id)}
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
            {/* Persistent projection warning */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
              style={{
                background: 'rgba(255,167,38,0.1)',
                border: '1px solid rgba(255,167,38,0.4)',
                color: C.amber,
                ...fontMono,
                fontSize: 10,
                letterSpacing: '0.18em',
                fontWeight: 700,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1L11 10H1L6 1Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 5V7M6 8.5V8.6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              {t.projectionBadge}
            </div>
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

function DisclaimerModal({ t, onAccept }) {
  const fontDisplay = {
    fontFamily: "'Archivo Black', 'Kanit', 'DM Sans', system-ui, sans-serif",
  };
  const fontBody = { fontFamily: "'DM Sans', 'Kanit', system-ui, sans-serif" };
  const fontMono = {
    fontFamily: "'JetBrains Mono', 'Kanit', ui-monospace, monospace",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'fade-in 0.25s ease-out',
        ...fontBody,
      }}
    >
      <div
        style={{
          background: '#0D0D0D',
          border: '1px solid rgba(251,80,0,0.35)',
          borderRadius: 16,
          maxWidth: 480,
          width: '100%',
          padding: '32px 28px',
          animation: 'scale-in 0.3s ease-out',
          boxShadow: '0 24px 80px -10px rgba(251,80,0,0.25), 0 0 0 1px rgba(255,255,255,0.04)',
          textAlign: 'center',
        }}
      >
        {/* Warning triangle icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(251,80,0,0.12)',
            border: '1.5px solid rgba(251,80,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            animation: 'warn-pulse 2s ease-in-out infinite',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3L22 20H2L12 3Z"
              stroke="#FB5000"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M12 10V14M12 17V17.1"
              stroke="#FB5000"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h2
          id="disclaimer-title"
          style={{
            ...fontDisplay,
            fontSize: 24,
            margin: '0 0 16px',
            color: '#FFFFFF',
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
          }}
        >
          {t.modalTitle}
        </h2>

        <p
          style={{
            fontSize: 16,
            lineHeight: 1.5,
            color: '#FFFFFF',
            fontWeight: 600,
            margin: '0 0 12px',
          }}
        >
          {t.modalBody}
        </p>

        <p
          style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: '#9CA3AF',
            margin: '0 0 24px',
          }}
        >
          {t.modalSub}
        </p>

        <button
          type="button"
          onClick={onAccept}
          style={{
            background: 'linear-gradient(135deg, #FF7530, #FB5000)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 12,
            padding: '14px 24px',
            width: '100%',
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 10px 32px -8px rgba(251,80,0,0.5)',
            ...fontDisplay,
            transition: 'transform 120ms ease, filter 200ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'brightness(1.08)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = '';
            e.currentTarget.style.transform = '';
          }}
        >
          {t.modalAccept}
        </button>

        {/* WeTrade attribution footer */}
        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.05)',
            color: '#5A5A5A',
            fontSize: 10,
            letterSpacing: '0.2em',
            fontWeight: 600,
            ...fontMono,
            textTransform: 'uppercase',
          }}
        >
          WeTrade · In Trust We Trade
        </div>
      </div>
    </div>
  );
}