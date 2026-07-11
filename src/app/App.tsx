import { useState, useEffect, useRef, type ComponentType, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home, Compass, Briefcase, User, Search, Bell, Settings,
  ChevronRight, ChevronLeft, ChevronDown,
  Plane, Hotel, Calendar, MapPin, Clock, DollarSign, Users,
  Sun, Cloud, Wind, Droplets, Thermometer,
  Star, Heart, Share2, MessageCircle, Send, X, Plus, Minus,
  Mic, Download, Edit, Trash2, CheckCircle, AlertTriangle,
  Shield, Moon, Globe, ArrowRight, Sparkles, RefreshCw,
  Bookmark, TrendingUp, LogOut, Mail, Zap,
  MoreHorizontal, Wifi, Battery, Info, Filter,
  Check, Camera, Utensils, Map
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Screen = "splash" | "welcome" | "onboarding" | "main" | "plan" | "ai-loading" | "trip-detail" | "settings" | "notifications";
type Tab = "home" | "explore" | "trips" | "profile";
type TripTab = "overview" | "flights" | "hotels" | "weather" | "itinerary";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const px = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const DESTS = [
  { id: 1, name: "Paris", country: "France", flag: "🇫🇷", imgId: "1502602898657-3e91760cbb34", rating: 4.9, tag: "Romantic", price: "From $1,200", h: 220 },
  { id: 2, name: "Bali", country: "Indonesia", flag: "🇮🇩", imgId: "1537996194471-e657df975ab4", rating: 4.8, tag: "Tropical", price: "From $890", h: 160 },
  { id: 3, name: "Tokyo", country: "Japan", flag: "🇯🇵", imgId: "1540959733332-eab4deabeeaf", rating: 4.9, tag: "Urban", price: "From $1,450", h: 200 },
  { id: 4, name: "Santorini", country: "Greece", flag: "🇬🇷", imgId: "1570077188670-e3a8d69ac5ff", rating: 4.8, tag: "Scenic", price: "From $1,100", h: 180 },
  { id: 5, name: "New York", country: "USA", flag: "🇺🇸", imgId: "1496442226666-8d4d0e62e6e9", rating: 4.7, tag: "City", price: "From $1,300", h: 160 },
  { id: 6, name: "Maldives", country: "Maldives", flag: "🇲🇻", imgId: "1573843981267-be1999ff37cd", rating: 5.0, tag: "Luxury", price: "From $2,800", h: 220 },
  { id: 7, name: "Iceland", country: "Iceland", flag: "🇮🇸", imgId: "1476610182048-b716b8518aae", rating: 4.9, tag: "Adventure", price: "From $1,600", h: 180 },
  { id: 8, name: "Dubai", country: "UAE", flag: "🇦🇪", imgId: "1512453979798-5ea266f8880c", rating: 4.7, tag: "Luxury", price: "From $1,800", h: 160 },
];

const MY_TRIPS = [
  { id: 1, dest: "Bali", country: "Indonesia", flag: "🇮🇩", dates: "Aug 12–19, 2025", status: "upcoming" as const, imgId: "1537996194471-e657df975ab4", days: 7, budget: "$2,400" },
  { id: 2, dest: "Paris", country: "France", flag: "🇫🇷", dates: "Dec 20–27, 2025", status: "planning" as const, imgId: "1502602898657-3e91760cbb34", days: 7, budget: "$3,100" },
  { id: 3, dest: "Tokyo", country: "Japan", flag: "🇯🇵", dates: "Mar 5–15, 2025", status: "completed" as const, imgId: "1540959733332-eab4deabeeaf", days: 10, budget: "$4,200" },
];

const FLIGHTS = [
  { airline: "Emirates", code: "EK", from: "JFK", to: "CDG", dep: "10:30 AM", arr: "11:45 PM", dur: "7h 15m", stops: 0, price: "$842", badge: "Recommended", badgeColor: "bg-blue-500", rating: 4.8 },
  { airline: "Air France", code: "AF", from: "JFK", to: "CDG", dep: "06:15 AM", arr: "07:30 PM", dur: "7h 15m", stops: 0, price: "$621", badge: "Cheapest", badgeColor: "bg-emerald-500", rating: 4.5 },
  { airline: "British Airways", code: "BA", from: "JFK", to: "CDG", dep: "09:00 PM", arr: "11:15 AM+1", dur: "8h 15m", stops: 1, price: "$590", badge: "Budget Pick", badgeColor: "bg-amber-500", rating: 4.3 },
];

const HOTELS = [
  { name: "Le Marais Boutique", area: "Le Marais, Paris", stars: 5, rating: 4.9, reviews: 1243, price: "$280", imgId: "1551882547-ff40c4a49b6e", amenities: ["WiFi", "Spa", "Pool", "Gym", "Restaurant"] },
  { name: "Hôtel des Arts", area: "Saint-Germain, Paris", stars: 4, rating: 4.7, reviews: 856, price: "$195", imgId: "1564501049412-61d2fc7cad64", amenities: ["WiFi", "Restaurant", "Bar", "Concierge"] },
  { name: "Montmartre Chic", area: "Montmartre, Paris", stars: 3, rating: 4.2, reviews: 2100, price: "$95", imgId: "1520250497591-112f2f40a3f4", amenities: ["WiFi", "Breakfast", "Lounge"] },
];

const ITINERARY = [
  {
    day: "Day 1 — Arrival & Explore", date: "Aug 12",
    activities: [
      { time: "2:00 PM", label: "Check in at Le Marais Boutique", icon: "🏨", cost: "Included", duration: "30 min" },
      { time: "4:00 PM", label: "Stroll through Le Marais district", icon: "🚶", cost: "Free", duration: "2 hrs" },
      { time: "7:30 PM", label: "Dinner at Café de Flore", icon: "🍽️", cost: "~$45/person", duration: "1.5 hrs" },
      { time: "9:30 PM", label: "Evening Seine River cruise", icon: "⛵", cost: "$28/person", duration: "1 hr" },
    ],
  },
  {
    day: "Day 2 — Art & Culture", date: "Aug 13",
    activities: [
      { time: "9:00 AM", label: "Louvre Museum (book in advance)", icon: "🖼️", cost: "$22/person", duration: "3 hrs" },
      { time: "1:00 PM", label: "Lunch near Tuileries Garden", icon: "🥗", cost: "~$30/person", duration: "1 hr" },
      { time: "3:00 PM", label: "Eiffel Tower visit & summit", icon: "🗼", cost: "$32/person", duration: "2 hrs" },
      { time: "8:00 PM", label: "Dinner in Montparnasse", icon: "🍷", cost: "~$55/person", duration: "2 hrs" },
    ],
  },
  {
    day: "Day 3 — Versailles Day Trip", date: "Aug 14",
    activities: [
      { time: "8:30 AM", label: "Train to Versailles Palace", icon: "🚆", cost: "$8 return", duration: "40 min" },
      { time: "10:00 AM", label: "Palace of Versailles tour", icon: "🏰", cost: "$25/person", duration: "4 hrs" },
      { time: "3:00 PM", label: "Gardens of Versailles walk", icon: "🌿", cost: "Free", duration: "2 hrs" },
      { time: "7:00 PM", label: "Return & dinner in Paris", icon: "🍝", cost: "~$40/person", duration: "1.5 hrs" },
    ],
  },
];

const AI_TASKS = [
  "Searching flights from New York to Paris",
  "Comparing 47 hotels in central Paris",
  "Checking August weather & forecast",
  "Finding top-rated local restaurants",
  "Discovering festivals & events",
  "Reading 200+ travel blogs & reviews",
  "Checking travel advisories & safety",
  "Crafting your personalized itinerary",
];

const ONBOARDING_STEPS = [
  { q: "What's your travel style?", emoji: "✈️", options: ["Adventure", "Relaxation", "Cultural", "Romantic", "Business", "Family"], multi: false },
  { q: "What's your typical budget?", emoji: "💰", options: ["Budget: <$500", "Mid-range: $500–$2k", "Comfort: $2k–$5k", "Luxury: $5k–$10k", "Ultra: $10k+"], multi: false },
  { q: "What excites you most?", emoji: "🎯", options: ["Beaches", "Mountains", "Food & Cuisine", "History & Art", "Nightlife", "Photography", "Wildlife", "Festivals", "Shopping", "Road Trips"], multi: true },
  { q: "Where are you based?", emoji: "🌍", options: ["North America", "Europe", "Asia Pacific", "Middle East", "Australia", "Latin America", "Africa"], multi: false },
];

const EXPLORE_CATEGORIES = ["All", "Beaches", "Mountains", "Cities", "Food", "Adventure", "Culture", "Luxury", "Winter"];

const CHAT_SEED = [
  { role: "ai" as const, text: "Hi! I'm your TravelGenie AI ✈️ Ready to plan something amazing. Where are you dreaming of going?" },
  { role: "user" as const, text: "I want to plan a honeymoon in Santorini." },
  { role: "ai" as const, text: "What a magical choice 🌅 Santorini is perfect for a honeymoon. I can create a 7-day romantic itinerary with sunset caldera views, private cave suites, and boat tours to the volcano. When are you thinking of going?" },
];

const SUGGESTION_CHIPS = ["Plan a honeymoon", "Make it cheaper", "Find halal food", "Add another day", "Is it safe?", "Change my hotel"];

const EVENTS = [
  { name: "Fête de la Musique", date: "Jun 21", type: "Festival", icon: "🎵", price: "Free", venue: "Throughout Paris" },
  { name: "Bastille Day Fireworks", date: "Jul 14", type: "National Holiday", icon: "🎆", price: "Free", venue: "Champ de Mars" },
  { name: "Paris Jazz Festival", date: "Jul 6–Aug 17", type: "Music", icon: "🎷", price: "$15–45", venue: "Parc Floral" },
  { name: "Nuit Blanche", date: "Oct 4", type: "Art Night", icon: "🎨", price: "Free", venue: "City-wide" },
];

// ─── Components ───────────────────────────────────────────────────────────────

function StatusBar({ light = false }: { light?: boolean }) {
  const [time, setTime] = useState("9:41");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={`flex items-center justify-between px-5 h-11 text-xs font-semibold flex-shrink-0 ${light ? "text-white" : "text-foreground"}`}>
      <span className="tracking-wide">{time}</span>
      <div className="flex items-center gap-1.5">
        <Wifi className="w-3.5 h-3.5" />
        <Battery className="w-4 h-3" />
      </div>
    </div>
  );
}

function BottomNav({ tab, onChange, onPlan }: { tab: Tab; onChange: (t: Tab) => void; onPlan: () => void }) {
  const items: { id: Tab | "plan"; icon: ReactNode; label: string }[] = [
    { id: "home", icon: <Home className="w-5 h-5" />, label: "Home" },
    { id: "explore", icon: <Compass className="w-5 h-5" />, label: "Explore" },
    { id: "plan", icon: <Plus className="w-6 h-6" />, label: "Plan" },
    { id: "trips", icon: <Briefcase className="w-5 h-5" />, label: "Trips" },
    { id: "profile", icon: <User className="w-5 h-5" />, label: "Profile" },
  ];
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[78px] bg-card border-t border-border flex items-center justify-around px-2 z-40">
      {items.map((item) => {
        const isCenter = item.id === "plan";
        const isActive = item.id === tab;
        if (isCenter) {
          return (
            <button
              key="plan"
              onClick={onPlan}
              className="flex flex-col items-center -mt-6"
            >
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] font-semibold text-primary mt-1">Plan</span>
            </button>
          );
        }
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id as Tab)}
            className="flex flex-col items-center gap-0.5 flex-1"
          >
            <div className={isActive ? "text-primary" : "text-muted-foreground"}>{item.icon}</div>
            <span className={`text-[10px] font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Splash Screen ────────────────────────────────────────────────────────────
function SplashScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setProgress((p) => Math.min(p + 2, 100)), 45);
    const t = setTimeout(onDone, 2600);
    return () => { clearInterval(id); clearTimeout(t); };
  }, [onDone]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 40%, #0369a1 100%)" }}>
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="relative flex flex-col items-center">
        {/* Pulsing rings */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/20"
            style={{ width: 80 + i * 50, height: 80 + i * 50 }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
        {/* Logo orb */}
        <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center shadow-2xl border border-white/30">
          <span className="text-5xl">✈️</span>
        </div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="mt-6 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">TravelGenie</h1>
          <p className="text-white/70 text-sm mt-1 tracking-widest uppercase font-medium">Plan Less. Explore More.</p>
        </motion.div>
      </motion.div>
      {/* Progress */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

// ─── Welcome Screen ───────────────────────────────────────────────────────────
function WelcomeScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="relative h-[55%] flex-shrink-0 bg-blue-900">
        <img src={px("1507525428034-b723cf961d3e", 800, 700)} alt="Beach paradise" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)" }} />
        <div className="absolute bottom-6 left-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">✈️</span>
            <span className="text-white font-bold text-lg">TravelGenie</span>
          </div>
          <h2 className="text-white text-3xl font-bold leading-tight">Discover the<br />World with AI</h2>
          <p className="text-white/70 text-sm mt-1">Plan Less. Explore More.</p>
        </div>
      </div>
      <div className="flex-1 bg-card flex flex-col px-6 pt-6 pb-4 gap-3">
        <p className="text-muted-foreground text-sm text-center mb-1">Your intelligent travel concierge, powered by AI</p>
        <button onClick={onNext} className="w-full h-13 rounded-2xl bg-primary text-white font-semibold text-base flex items-center justify-center gap-3 shadow-lg shadow-primary/30 py-3.5">
          <span className="text-lg">G</span> Continue with Google
        </button>
        <button onClick={onNext} className="w-full h-13 rounded-2xl bg-foreground text-background font-semibold text-base flex items-center justify-center gap-3 py-3.5">
          <span className="text-lg"></span> Continue with Apple
        </button>
        <button onClick={onNext} className="w-full h-13 rounded-2xl border border-border text-foreground font-semibold text-base flex items-center justify-center gap-3 py-3.5">
          <Mail className="w-5 h-5" /> Continue with Email
        </button>
        <button onClick={onNext} className="text-muted-foreground text-sm text-center mt-2">
          Explore as Guest →
        </button>
      </div>
    </div>
  );
}

// ─── Onboarding Screen ────────────────────────────────────────────────────────
function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Record<number, string[]>>({});

  const cur = ONBOARDING_STEPS[step];
  const curSel = selected[step] || [];

  const toggle = (opt: string) => {
    if (cur.multi) {
      setSelected((s) => ({ ...s, [step]: curSel.includes(opt) ? curSel.filter((o) => o !== opt) : [...curSel, opt] }));
    } else {
      setSelected((s) => ({ ...s, [step]: [opt] }));
    }
  };

  const canContinue = curSel.length > 0;

  const next = () => {
    if (step < ONBOARDING_STEPS.length - 1) setStep((s) => s + 1);
    else onDone();
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-background">
      <StatusBar />
      {/* Progress */}
      <div className="px-6 pt-2 pb-4">
        <div className="flex gap-1.5">
          {ONBOARDING_STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
        <p className="text-muted-foreground text-xs mt-2">{step + 1} of {ONBOARDING_STEPS.length}</p>
      </div>
      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }} className="flex-1 px-6 flex flex-col">
          <div className="text-5xl mb-4">{cur.emoji}</div>
          <h2 className="text-2xl font-bold text-foreground mb-1">{cur.q}</h2>
          {cur.multi && <p className="text-muted-foreground text-sm mb-4">Select all that apply</p>}
          {!cur.multi && <p className="text-muted-foreground text-sm mb-4">Choose one that fits you best</p>}
          <div className="flex flex-wrap gap-2.5">
            {cur.options.map((opt) => {
              const active = curSel.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggle(opt)}
                  className={`px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all duration-200 ${active ? "bg-primary text-white border-primary shadow-md shadow-primary/25" : "bg-card border-border text-foreground"}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="px-6 pb-8 pt-4">
        <button
          onClick={next}
          disabled={!canContinue}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 ${canContinue ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground"}`}
        >
          {step < ONBOARDING_STEPS.length - 1 ? "Continue" : "Start Exploring ✈️"}
        </button>
        <button onClick={onDone} className="w-full text-center text-muted-foreground text-sm mt-3">Skip for now</button>
      </div>
    </div>
  );
}

// ─── Home Tab ─────────────────────────────────────────────────────────────────
function HomeTab({ onTripDetail, onPlan, dark }: { onTripDetail: () => void; onPlan: () => void; dark: boolean }) {
  const [savedIds, setSavedIds] = useState<number[]>([6]);

  return (
    <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {/* Hero header */}
      <div className="relative h-64 bg-blue-900 flex-shrink-0">
        <img src={px("1476514525405-b0c25a75db9c", 800, 400)} alt="Travel destination" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.65) 100%)" }} />
        <div className="absolute top-0 left-0 right-0">
          <StatusBar light />
        </div>
        <div className="absolute top-14 left-5 right-5 flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Good morning</p>
            <h2 className="text-white text-xl font-bold">Alex Chen 👋</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </button>
            <img src={px("1494790108377-be9c29b29330", 80, 80)} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-white" />
          </div>
        </div>
        {/* Search bar */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/30">
            <Search className="w-4 h-4 text-white/80" />
            <span className="text-white/70 text-sm flex-1">Search destinations…</span>
            <div className="w-px h-4 bg-white/30" />
            <MapPin className="w-4 h-4 text-white/80" />
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 pb-24">
        {/* Upcoming trip banner */}
        <div className="relative rounded-3xl overflow-hidden mb-5 h-36 bg-blue-900">
          <img src={px("1537996194471-e657df975ab4", 700, 300)} alt="Bali" className="absolute inset-0 w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent" />
          <div className="absolute inset-0 p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 rounded-full px-2.5 py-1">Upcoming</span>
              <h3 className="text-white text-lg font-bold mt-1">Bali, Indonesia 🇮🇩</h3>
              <p className="text-white/70 text-xs mt-0.5">Aug 12–19 · 7 days · 2 travelers</p>
            </div>
            <button onClick={onTripDetail} className="bg-white/20 backdrop-blur rounded-2xl p-3 border border-white/30">
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-5">
          <h3 className="text-foreground font-bold text-base mb-3">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Plan Trip", icon: "✈️", action: onPlan },
              { label: "My Trips", icon: "📋", action: () => {} },
              { label: "Explore", icon: "🌏", action: () => {} },
              { label: "AI Chat", icon: "🤖", action: () => {} },
            ].map(({ label, icon, action }) => (
              <button key={label} onClick={action} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm text-2xl">{icon}</div>
                <span className="text-xs text-muted-foreground font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trending Destinations */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-foreground font-bold text-base">Trending Now</h3>
            <button className="text-primary text-xs font-semibold">See all</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {DESTS.slice(0, 5).map((d) => (
              <button key={d.id} onClick={onTripDetail} className="flex-shrink-0 w-36 rounded-2xl overflow-hidden bg-card border border-border shadow-sm">
                <div className="h-24 bg-slate-200 relative">
                  <img src={px(d.imgId, 280, 180)} alt={d.name} className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); setSavedIds((ids) => ids.includes(d.id) ? ids.filter((i) => i !== d.id) : [...ids, d.id]); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center"
                  >
                    <Heart className={`w-3.5 h-3.5 ${savedIds.includes(d.id) ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
                  </button>
                  <span className="absolute bottom-2 left-2 text-white text-xs font-bold bg-black/40 backdrop-blur rounded-full px-2 py-0.5">{d.tag}</span>
                </div>
                <div className="p-2.5">
                  <p className="text-foreground text-xs font-bold">{d.flag} {d.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-muted-foreground text-[10px]">{d.rating}</span>
                  </div>
                  <p className="text-primary text-[10px] font-semibold mt-1">{d.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-foreground font-bold text-base">AI Picks for You</h3>
          </div>
          <div className="space-y-3">
            {[
              { dest: "Santorini, Greece", reason: "Perfect for romantic getaways in late summer", imgId: "1570077188670-e3a8d69ac5ff", price: "From $1,100", match: 98 },
              { dest: "Maldives", reason: "Ideal for beach lovers & luxury escapes", imgId: "1573843981267-be1999ff37cd", price: "From $2,800", match: 95 },
            ].map((r) => (
              <button key={r.dest} onClick={onTripDetail} className="w-full flex items-center gap-3 bg-card rounded-2xl p-3 border border-border shadow-sm">
                <img src={px(r.imgId, 120, 120)} alt={r.dest} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <p className="text-foreground text-sm font-bold">{r.dest}</p>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 rounded-full px-2 py-0.5">{r.match}% match</span>
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5 line-clamp-1">{r.reason}</p>
                  <p className="text-primary text-xs font-semibold mt-1">{r.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Explore Tab ──────────────────────────────────────────────────────────────
function ExploreTab({ onTripDetail, dark }: { onTripDetail: () => void; dark: boolean }) {
  const [cat, setCat] = useState("All");
  const [savedIds, setSavedIds] = useState<number[]>([]);

  const cols = [DESTS.filter((_, i) => i % 2 === 0), DESTS.filter((_, i) => i % 2 === 1)];

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 pt-5 pb-3 flex-shrink-0">
        <StatusBar />
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-foreground text-xl font-bold">Explore</h2>
          <button className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
            <Filter className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        {/* Search */}
        <div className="flex items-center gap-3 bg-muted rounded-2xl px-4 py-3 mb-3">
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">Search destinations…</span>
        </div>
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {EXPLORE_CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${cat === c ? "bg-primary text-white border-primary" : "bg-card border-border text-muted-foreground"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      {/* Masonry grid */}
      <div className="flex-1 overflow-y-auto px-5 pb-24" style={{ scrollbarWidth: "none" }}>
        <div className="flex gap-3">
          {cols.map((col, ci) => (
            <div key={ci} className="flex-1 flex flex-col gap-3">
              {col.map((d) => {
                const h = d.h;
                return (
                  <button key={d.id} onClick={onTripDetail} className="relative rounded-2xl overflow-hidden bg-slate-200" style={{ height: h }}>
                    <img src={px(d.imgId, 400, h * 2)} alt={d.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
                    <button
                      onClick={(e) => { e.stopPropagation(); setSavedIds((ids) => ids.includes(d.id) ? ids.filter((i) => i !== d.id) : [...ids, d.id]); }}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/30 backdrop-blur flex items-center justify-center"
                    >
                      <Heart className={`w-4 h-4 ${savedIds.includes(d.id) ? "fill-red-400 text-red-400" : "text-white"}`} />
                    </button>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white text-sm font-bold">{d.flag} {d.name}</p>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-white/70 text-xs">{d.country}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-white text-xs font-semibold">{d.rating}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Trips Tab ────────────────────────────────────────────────────────────────
function TripsTab({ onTripDetail, dark }: { onTripDetail: () => void; dark: boolean }) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "planning" | "completed">("all");
  const filtered = filter === "all" ? MY_TRIPS : MY_TRIPS.filter((t) => t.status === filter);
  const statusColor = { upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", planning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };

  return (
    <div className="h-full flex flex-col">
      <div className="px-5 pt-5 pb-3 flex-shrink-0">
        <StatusBar />
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-foreground text-xl font-bold">My Trips</h2>
          <button className="text-primary text-sm font-semibold flex items-center gap-1">
            <Plus className="w-4 h-4" /> New
          </button>
        </div>
        {/* Filters */}
        <div className="flex gap-2">
          {(["all", "upcoming", "planning", "completed"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize border transition-all ${filter === f ? "bg-primary text-white border-primary" : "bg-card border-border text-muted-foreground"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-3" style={{ scrollbarWidth: "none" }}>
        {filtered.map((trip) => (
          <button key={trip.id} onClick={onTripDetail} className="w-full bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="relative h-40 bg-slate-200">
              <img src={px(trip.imgId, 700, 300)} alt={trip.dest} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 100%)" }} />
              <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColor[trip.status]}`}>{trip.status}</span>
              <div className="absolute bottom-3 left-4">
                <h3 className="text-white font-bold text-lg">{trip.flag} {trip.dest}, {trip.country}</h3>
                <p className="text-white/70 text-xs">{trip.dates}</p>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-foreground font-bold text-sm">{trip.days}</p>
                  <p className="text-muted-foreground text-[10px]">Days</p>
                </div>
                <div className="text-center">
                  <p className="text-foreground font-bold text-sm">{trip.budget}</p>
                  <p className="text-muted-foreground text-[10px]">Budget</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </button>
        ))}
        {/* Empty CTA */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 text-center">
          <span className="text-3xl">🗺️</span>
          <p className="text-foreground font-semibold mt-2">Plan your next adventure</p>
          <p className="text-muted-foreground text-xs mt-1">Let AI create the perfect itinerary for you</p>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab({ dark, onDarkToggle, onSettings }: { dark: boolean; onDarkToggle: () => void; onSettings: () => void }) {
  const settings = [
    { label: "Dark Mode", icon: Moon, action: onDarkToggle, toggle: true, value: dark },
    { label: "Language", icon: Globe, value: "English", action: () => {} },
    { label: "Currency", icon: DollarSign, value: "USD ($)", action: () => {} },
    { label: "Privacy & Security", icon: Shield, action: () => {} },
    { label: "Notifications", icon: Bell, action: () => {} },
    { label: "Help & Support", icon: Info, action: () => {} },
    { label: "App Settings", icon: Settings, action: onSettings },
    { label: "Log Out", icon: LogOut, action: () => {}, danger: true },
  ];

  return (
    <div className="h-full flex flex-col overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <StatusBar />
      {/* Hero */}
      <div className="px-5 pb-5">
        <h2 className="text-foreground text-xl font-bold mb-5">Profile</h2>
        {/* User card */}
        <div className="bg-card border border-border rounded-3xl p-5 mb-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={px("1494790108377-be9c29b29330", 120, 120)} alt="Alex" className="w-16 h-16 rounded-2xl object-cover" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-card" />
            </div>
            <div className="flex-1">
              <h3 className="text-foreground font-bold text-lg">Alex Chen</h3>
              <p className="text-muted-foreground text-xs">alex.chen@email.com</p>
              <span className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-2.5 py-0.5 mt-1 inline-block">Pro Traveler</span>
            </div>
            <button className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <Edit className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
            {[{ label: "Trips", val: "12" }, { label: "Countries", val: "8" }, { label: "Reviews", val: "34" }].map(({ label, val }) => (
              <div key={label} className="text-center">
                <p className="text-foreground font-bold text-xl">{val}</p>
                <p className="text-muted-foreground text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Preferences */}
        <div className="bg-card border border-border rounded-3xl p-4 mb-5 shadow-sm">
          <h4 className="text-foreground font-bold text-sm mb-3">Travel Preferences</h4>
          <div className="flex flex-wrap gap-2">
            {["Adventure", "Photography", "Food & Cuisine", "Beaches", "Luxury"].map((p) => (
              <span key={p} className="text-xs font-semibold bg-primary/10 text-primary rounded-full px-3 py-1">{p}</span>
            ))}
          </div>
        </div>

        {/* Settings list */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          {settings.map(({ label, icon: Icon, value, toggle, action, danger }, i) => (
            <button
              key={label}
              onClick={action}
              className={`w-full flex items-center gap-3 px-4 py-3.5 ${i < settings.length - 1 ? "border-b border-border" : ""} ${danger ? "text-destructive" : ""}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${danger ? "bg-red-50 dark:bg-red-900/20" : "bg-muted"}`}>
                <Icon className={`w-4 h-4 ${danger ? "text-destructive" : "text-muted-foreground"}`} />
              </div>
              <span className={`flex-1 text-left text-sm font-semibold ${danger ? "text-destructive" : "text-foreground"}`}>{label}</span>
              {toggle ? (
                <div className={`w-11 h-6 rounded-full transition-all ${value ? "bg-primary" : "bg-switch-background"} flex items-center px-0.5`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-all ${value ? "translate-x-5" : "translate-x-0"}`} />
                </div>
              ) : value ? (
                <span className="text-muted-foreground text-xs">{value}</span>
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="h-24" />
    </div>
  );
}

// ─── Plan Wizard ──────────────────────────────────────────────────────────────
function PlanWizard({ onBack, onGenerate, dark }: { onBack: () => void; onGenerate: () => void; dark: boolean }) {
  const [step, setStep] = useState(1);
  const [dest, setDest] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(2000);
  const [style, setStyle] = useState("");
  const [accom, setAccom] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = DESTS.filter((d) => dest && d.name.toLowerCase().includes(dest.toLowerCase()));

  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      {/* Header */}
      <div className="px-5 py-3 flex items-center gap-4 border-b border-border flex-shrink-0">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h2 className="text-foreground font-bold text-base">Plan Your Trip</h2>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </div>
        <span className="text-muted-foreground text-xs font-medium">{step}/3</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5" style={{ scrollbarWidth: "none" }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-4">
              <div>
                <h3 className="text-foreground font-bold text-xl mb-1">Where to?</h3>
                <p className="text-muted-foreground text-sm">Search for your dream destination</p>
              </div>
              {/* Destination input */}
              <div className="relative">
                <div className="flex items-center gap-3 bg-muted rounded-2xl px-4 py-3.5">
                  <MapPin className="w-5 h-5 text-primary" />
                  <input
                    value={dest}
                    onChange={(e) => { setDest(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="City, country, or region…"
                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none"
                  />
                  {dest && <button onClick={() => { setDest(""); setShowSuggestions(false); }}><X className="w-4 h-4 text-muted-foreground" /></button>}
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-2xl mt-1 overflow-hidden shadow-xl z-10">
                    {suggestions.map((d) => (
                      <button key={d.id} onClick={() => { setDest(d.name + ", " + d.country); setShowSuggestions(false); }} className="w-full flex items-center gap-3 px-4 py-3 border-b last:border-0 border-border">
                        <img src={px(d.imgId, 80, 80)} alt={d.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div className="text-left">
                          <p className="text-foreground text-sm font-semibold">{d.flag} {d.name}, {d.country}</p>
                          <p className="text-muted-foreground text-xs">{d.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Quick picks */}
              <div>
                <p className="text-muted-foreground text-xs font-semibold mb-2">POPULAR PICKS</p>
                <div className="flex gap-2 flex-wrap">
                  {["Paris", "Bali", "Tokyo", "Santorini", "Maldives"].map((d) => (
                    <button key={d} onClick={() => { setDest(d); setShowSuggestions(false); }} className="px-3 py-1.5 rounded-full bg-muted text-foreground text-xs font-semibold border border-border">
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                {[{ label: "Departure", val: "Aug 12, 2025", icon: Calendar }, { label: "Return", val: "Aug 19, 2025", icon: Calendar }].map(({ label, val, icon: Icon }) => (
                  <div key={label} className="bg-muted rounded-2xl p-3.5">
                    <p className="text-muted-foreground text-[10px] font-semibold uppercase mb-1">{label}</p>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-foreground text-xs font-semibold">{val}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Flexible dates toggle */}
              <div className="flex items-center justify-between bg-muted rounded-2xl p-4">
                <div>
                  <p className="text-foreground text-sm font-semibold">Flexible Dates</p>
                  <p className="text-muted-foreground text-xs">±3 days for better prices</p>
                </div>
                <div className="w-11 h-6 rounded-full bg-primary flex items-center px-0.5">
                  <div className="w-5 h-5 rounded-full bg-white shadow translate-x-5" />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-5">
              <div>
                <h3 className="text-foreground font-bold text-xl mb-1">Who's going?</h3>
                <p className="text-muted-foreground text-sm">Set your group size and budget</p>
              </div>
              {/* Travelers */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <p className="text-muted-foreground text-xs font-semibold mb-3">TRAVELERS</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground font-bold text-2xl">{travelers}</p>
                    <p className="text-muted-foreground text-xs">{travelers === 1 ? "Solo traveler" : travelers === 2 ? "Couple" : `Group of ${travelers}`}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setTravelers((t) => Math.max(1, t - 1))} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Minus className="w-4 h-4 text-foreground" />
                    </button>
                    <button onClick={() => setTravelers((t) => Math.min(12, t + 1))} className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
              {/* Budget */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-muted-foreground text-xs font-semibold">TOTAL BUDGET</p>
                  <p className="text-primary font-bold text-lg">${budget.toLocaleString()}</p>
                </div>
                <input
                  type="range"
                  min={300}
                  max={15000}
                  step={100}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-muted-foreground text-[10px] mt-1">
                  <span>Budget</span>
                  <span>Mid-range</span>
                  <span>Luxury</span>
                </div>
              </div>
              {/* Trip purpose */}
              <div>
                <p className="text-muted-foreground text-xs font-semibold mb-2">TRIP PURPOSE</p>
                <div className="flex flex-wrap gap-2">
                  {["Vacation", "Honeymoon", "Business", "Adventure", "Family", "Solo"].map((s) => (
                    <button key={s} onClick={() => setStyle(s)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${style === s ? "bg-primary text-white border-primary" : "bg-card border-border text-foreground"}`}>{s}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="space-y-5">
              <div>
                <h3 className="text-foreground font-bold text-xl mb-1">Preferences</h3>
                <p className="text-muted-foreground text-sm">Let AI personalize your trip</p>
              </div>
              {/* Accommodation */}
              <div>
                <p className="text-muted-foreground text-xs font-semibold mb-2">ACCOMMODATION</p>
                <div className="grid grid-cols-2 gap-2">
                  {[{ l: "Hotel", e: "🏨" }, { l: "Boutique", e: "🏡" }, { l: "Hostel", e: "🛏️" }, { l: "Resort", e: "🌴" }].map(({ l, e }) => (
                    <button key={l} onClick={() => setAccom(l)} className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all ${accom === l ? "bg-primary/10 border-primary" : "bg-card border-border"}`}>
                      <span className="text-xl">{e}</span>
                      <span className={`text-sm font-semibold ${accom === l ? "text-primary" : "text-foreground"}`}>{l}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Transport */}
              <div>
                <p className="text-muted-foreground text-xs font-semibold mb-2">TRANSPORT</p>
                <div className="flex flex-wrap gap-2">
                  {["Direct flights", "Trains", "Rental car", "Public transit", "Ride-share"].map((t) => (
                    <button key={t} className="px-3 py-1.5 rounded-full text-xs font-semibold border border-border bg-card text-foreground">{t}</button>
                  ))}
                </div>
              </div>
              {/* Special requests */}
              <div>
                <p className="text-muted-foreground text-xs font-semibold mb-2">SPECIAL REQUESTS</p>
                <textarea
                  rows={3}
                  placeholder="e.g. vegetarian food, wheelchair accessible, baby-friendly…"
                  className="w-full bg-muted rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm outline-none resize-none border border-transparent focus:border-primary transition-all"
                />
              </div>
              {/* Summary */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-2">
                <p className="text-foreground font-bold text-sm">✨ Your Trip Summary</p>
                <div className="text-muted-foreground text-xs space-y-1">
                  <p>📍 {dest || "Paris, France"} · Aug 12–19 · 7 nights</p>
                  <p>👥 {travelers} {travelers === 1 ? "traveler" : "travelers"} · Budget: ${budget.toLocaleString()}</p>
                  <p>🏡 {accom || "Hotel"} · {style || "Vacation"}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-5 pb-8 pt-4 flex-shrink-0 border-t border-border">
        <div className="flex gap-3">
          {step > 1 && (
            <button onClick={() => setStep((s) => s - 1)} className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center flex-shrink-0">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          <button
            onClick={() => step < 3 ? setStep((s) => s + 1) : onGenerate()}
            className="flex-1 py-3.5 rounded-2xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
          >
            {step < 3 ? <>Continue <ArrowRight className="w-4 h-4" /></> : <><Sparkles className="w-4 h-4" /> Generate AI Plan</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AI Loading Screen ────────────────────────────────────────────────────────
function AILoadingScreen({ onDone }: { onDone: () => void }) {
  const [done, setDone] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => {
        if (c >= AI_TASKS.length - 1) { clearInterval(id); setTimeout(onDone, 800); return c; }
        setDone((d) => [...d, c]);
        return c + 1;
      });
    }, 380);
    return () => clearInterval(id);
  }, [onDone]);

  const progress = Math.round((done.length / AI_TASKS.length) * 100);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-8" style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)" }}>
      <StatusBar light />
      {/* Orb */}
      <div className="relative mb-8">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-blue-400/30"
            style={{ width: 80 + i * 40, height: 80 + i * 40, left: -(i * 20), top: -(i * 20) }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
        <motion.div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "radial-gradient(circle, #3b82f6, #1d4ed8)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-9 h-9 text-white" />
        </motion.div>
      </div>

      <h2 className="text-white text-xl font-bold mb-1 text-center">Creating Your Perfect Trip</h2>
      <p className="text-white/60 text-sm text-center mb-8">Our AI is researching thousands of options…</p>

      {/* Task list */}
      <div className="w-full space-y-2.5 mb-8">
        {AI_TASKS.map((task, i) => {
          const isDone = done.includes(i);
          const isCurrent = i === current;
          return (
            <motion.div
              key={task}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: i <= current ? 1 : 0.3, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isDone ? "bg-emerald-500" : isCurrent ? "bg-blue-500" : "bg-white/10"}`}>
                {isDone ? <Check className="w-3 h-3 text-white" /> : isCurrent ? (
                  <motion.div className="w-2.5 h-2.5 rounded-full bg-white" animate={{ scale: [1, 0.5, 1] }} transition={{ duration: 0.6, repeat: Infinity }} />
                ) : null}
              </div>
              <span className={`text-sm font-medium ${isDone ? "text-emerald-400" : isCurrent ? "text-white" : "text-white/30"}`}>{task}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60 text-xs">Progress</span>
          <span className="text-white font-semibold text-xs">{progress}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Trip Detail Screen ───────────────────────────────────────────────────────
function TripDetailScreen({ onBack, dark }: { onBack: () => void; dark: boolean }) {
  const [tripTab, setTripTab] = useState<TripTab>("overview");
  const [savedHotels, setSavedHotels] = useState<number[]>([]);

  const tabs: { id: TripTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "flights", label: "Flights" },
    { id: "hotels", label: "Hotels" },
    { id: "weather", label: "Weather" },
    { id: "itinerary", label: "Itinerary" },
  ];

  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      {/* Hero */}
      <div className="relative h-52 bg-slate-800 flex-shrink-0">
        <img src={px("1502602898657-3e91760cbb34", 800, 420)} alt="Paris" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)" }} />
        <div className="absolute top-0 left-0 right-0">
          <StatusBar light />
        </div>
        <div className="absolute top-14 left-5 right-5 flex items-center justify-between">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Share2 className="w-4 h-4 text-white" />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Download className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-4 left-5">
          <h2 className="text-white text-2xl font-bold">🇫🇷 Paris, France</h2>
          <p className="text-white/70 text-sm">Aug 12–19 · 7 days · 2 travelers</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-emerald-300 text-xs font-bold bg-emerald-500/20 backdrop-blur rounded-full px-2.5 py-1">✓ Plan Ready</span>
            <span className="text-white/70 text-xs font-semibold">Est. $3,100 total</span>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-border flex-shrink-0 bg-card overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTripTab(t.id)}
            className={`flex-shrink-0 px-4 py-3 text-xs font-bold border-b-2 transition-all ${tripTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <AnimatePresence mode="wait">
          {tripTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 space-y-4 pb-10">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Days", val: "7", icon: Calendar },
                  { label: "Budget", val: "$3.1k", icon: DollarSign },
                  { label: "Travelers", val: "2", icon: Users },
                  { label: "Hotels", val: "1", icon: Hotel },
                ].map(({ label, val, icon: Icon }) => (
                  <div key={label} className="bg-card border border-border rounded-2xl p-3 text-center shadow-sm">
                    <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-foreground font-bold text-sm">{val}</p>
                    <p className="text-muted-foreground text-[10px]">{label}</p>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="relative h-36 bg-blue-100 dark:bg-blue-900/30 rounded-2xl overflow-hidden border border-border">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #2563eb 1px, transparent 1px), radial-gradient(circle at 70% 30%, #10b981 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-foreground font-semibold text-sm">Paris, France</span>
                  <span className="text-muted-foreground text-xs">Tap to open map</span>
                </div>
              </div>

              {/* Safety */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">Safe to Travel</p>
                    <p className="text-emerald-600/70 dark:text-emerald-500 text-xs">No active advisories · Low risk</p>
                  </div>
                  <span className="ml-auto text-emerald-600 dark:text-emerald-400 text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 rounded-full px-2 py-1">Level 1</span>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <p className="text-foreground font-bold text-sm mb-3">Top Attractions</p>
                <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                  {[
                    { name: "Eiffel Tower", imgId: "1543349689-9a4d426bee8e", time: "2–3 hrs", fee: "$32" },
                    { name: "The Louvre", imgId: "1499856844462-3b0e6e81cff8", time: "3–4 hrs", fee: "$22" },
                    { name: "Versailles", imgId: "1548248823-ce16a73b6d49", time: "4–5 hrs", fee: "$25" },
                  ].map((a) => (
                    <div key={a.name} className="flex-shrink-0 w-36 bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                      <img src={px(a.imgId, 280, 160)} alt={a.name} className="w-full h-24 object-cover" />
                      <div className="p-2.5">
                        <p className="text-foreground text-xs font-bold">{a.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-muted-foreground text-[10px]">{a.time}</span>
                          <span className="text-primary text-[10px] font-semibold">{a.fee}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visa & Tips */}
              <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
                <p className="text-foreground font-bold text-sm">Travel Essentials</p>
                {[
                  { icon: "🛂", label: "Visa", val: "Visa-free for US passport" },
                  { icon: "💵", label: "Currency", val: "Euro (€) · $1 ≈ €0.92" },
                  { icon: "🌡️", label: "Weather", val: "25–28°C · Sunny in August" },
                  { icon: "🔌", label: "Power", val: "Type C/E · 230V" },
                ].map(({ icon, label, val }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <div>
                      <p className="text-muted-foreground text-[10px] font-semibold">{label}</p>
                      <p className="text-foreground text-xs font-medium">{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tripTab === "flights" && (
            <motion.div key="flights" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 space-y-3 pb-10">
              <div className="flex items-center justify-between">
                <p className="text-foreground font-bold text-sm">3 flights found</p>
                <button className="text-primary text-xs font-semibold flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>
              {FLIGHTS.map((f, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center">
                        <Plane className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-foreground text-xs font-bold">{f.airline}</p>
                        <p className="text-muted-foreground text-[10px]">{f.stops === 0 ? "Non-stop" : `${f.stops} stop`}</p>
                      </div>
                    </div>
                    <span className={`text-white text-[10px] font-bold px-2.5 py-1 rounded-full ${f.badgeColor}`}>{f.badge}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-foreground font-bold text-base">{f.dep}</p>
                      <p className="text-muted-foreground text-xs">{f.from}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center px-3">
                      <p className="text-muted-foreground text-[10px]">{f.dur}</p>
                      <div className="w-full flex items-center gap-1 my-1">
                        <div className="h-px flex-1 bg-border" />
                        <Plane className="w-3 h-3 text-muted-foreground" />
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-muted-foreground text-[10px]">{f.rating}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-foreground font-bold text-base">{f.arr}</p>
                      <p className="text-muted-foreground text-xs">{f.to}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <p className="text-primary font-bold text-lg">{f.price}<span className="text-muted-foreground text-xs font-normal">/person</span></p>
                    <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5">
                      Book <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {tripTab === "hotels" && (
            <motion.div key="hotels" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 space-y-3 pb-10">
              <div className="flex items-center justify-between">
                <p className="text-foreground font-bold text-sm">3 hotels found</p>
                <button className="text-primary text-xs font-semibold">Sort: Rating</button>
              </div>
              {HOTELS.map((h, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="relative h-40 bg-slate-200">
                    <img src={px(h.imgId, 700, 300)} alt={h.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setSavedHotels((ids) => ids.includes(i) ? ids.filter((id) => id !== i) : [...ids, i])}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"
                    >
                      <Heart className={`w-4 h-4 ${savedHotels.includes(i) ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
                    </button>
                    <div className="absolute bottom-3 left-3 flex">
                      {Array.from({ length: h.stars }).map((_, j) => (
                        <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="text-foreground font-bold text-sm">{h.name}</p>
                        <p className="text-muted-foreground text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{h.area}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-bold text-base">{h.price}<span className="text-muted-foreground text-[10px] font-normal">/night</span></p>
                        <div className="flex items-center gap-1 justify-end">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-muted-foreground text-xs">{h.rating} ({h.reviews.toLocaleString()})</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {h.amenities.map((a) => (
                        <span key={a} className="text-[10px] font-semibold bg-muted text-muted-foreground rounded-full px-2 py-0.5">{a}</span>
                      ))}
                    </div>
                    <button className="w-full bg-primary text-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2">
                      Book Hotel <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {tripTab === "weather" && (
            <motion.div key="weather" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 pb-10">
              {/* Main card */}
              <div className="rounded-3xl overflow-hidden mb-4" style={{ background: "linear-gradient(135deg, #1e40af 0%, #4f46e5 50%, #7c3aed 100%)" }}>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/60 text-sm font-medium">Paris, France</p>
                      <p className="text-white text-7xl font-thin mt-1">23°</p>
                      <p className="text-white/80 text-base font-medium">Partly Cloudy</p>
                      <div className="flex gap-3 mt-2 text-white/60 text-xs">
                        <span>Feels 21°</span>
                        <span>H: 27° / L: 18°</span>
                      </div>
                    </div>
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Sun className="w-16 h-16 text-amber-300" style={{ filter: "drop-shadow(0 0 12px rgba(251,191,36,0.8))" }} />
                      </motion.div>
                      <motion.div
                        animate={{ x: [0, 6, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-2 right-0"
                      >
                        <Cloud className="w-8 h-8 text-white/70" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Hourly */}
                <div className="border-t border-white/10 px-5 py-3">
                  <div className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                    {[
                      { t: "Now", temp: 23, icon: Sun },
                      { t: "2PM", temp: 25, icon: Sun },
                      { t: "4PM", temp: 26, icon: Sun },
                      { t: "6PM", temp: 24, icon: Cloud },
                      { t: "8PM", temp: 21, icon: Cloud },
                      { t: "10PM", temp: 19, icon: Cloud },
                      { t: "12AM", temp: 18, icon: Cloud },
                    ].map(({ t, temp, icon: Icon }, i) => (
                      <div key={t} className={`flex flex-col items-center gap-1 flex-shrink-0 ${i === 0 ? "opacity-100" : "opacity-70"}`}>
                        <span className="text-white/60 text-xs">{t}</span>
                        <Icon className={`w-5 h-5 ${temp > 22 ? "text-amber-300" : "text-white/70"}`} />
                        <span className="text-white text-xs font-bold">{temp}°</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-4 gap-2 px-4 pb-4">
                  {[
                    { Icon: Droplets, label: "Humidity", value: "65%" },
                    { Icon: Wind, label: "Wind", value: "12 km/h" },
                    { Icon: Sun, label: "UV Index", value: "6 High" },
                    { Icon: Thermometer, label: "Pressure", value: "1013 hPa" },
                  ].map(({ Icon, label, value }) => (
                    <div key={label} className="bg-white/10 rounded-2xl p-2.5 text-center">
                      <Icon className="w-4 h-4 text-white/60 mx-auto mb-1" />
                      <p className="text-white text-xs font-bold">{value}</p>
                      <p className="text-white/40 text-[9px]">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7-day forecast */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-foreground font-bold text-sm">7-Day Forecast</p>
                </div>
                {[
                  { day: "Mon", icon: Sun, high: 27, low: 18, rain: 5 },
                  { day: "Tue", icon: Sun, high: 28, low: 19, rain: 0 },
                  { day: "Wed", icon: Cloud, high: 24, low: 17, rain: 20 },
                  { day: "Thu", icon: Cloud, high: 22, low: 16, rain: 40 },
                  { day: "Fri", icon: Sun, high: 26, low: 18, rain: 5 },
                  { day: "Sat", icon: Sun, high: 29, low: 20, rain: 0 },
                  { day: "Sun", icon: Sun, high: 30, low: 21, rain: 0 },
                ].map(({ day, icon: Icon, high, low, rain }, i) => (
                  <div key={day} className={`flex items-center gap-3 px-4 py-3 ${i < 6 ? "border-b border-border" : ""}`}>
                    <span className="text-foreground text-sm font-semibold w-8">{day}</span>
                    <Icon className={`w-5 h-5 ${high > 25 ? "text-amber-400" : "text-slate-400"}`} />
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-amber-400 rounded-full" style={{ width: `${((high - 15) / 20) * 100}%` }} />
                    </div>
                    <span className="text-muted-foreground text-xs w-6">{low}°</span>
                    <span className="text-foreground text-xs font-bold w-6">{high}°</span>
                    {rain > 0 && <span className="text-blue-400 text-[10px]">{rain}%💧</span>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tripTab === "itinerary" && (
            <motion.div key="itinerary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 space-y-5 pb-10">
              <div className="flex items-center justify-between">
                <p className="text-foreground font-bold text-sm">7-Day Itinerary</p>
                <button className="text-primary text-xs font-semibold flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                </button>
              </div>
              {ITINERARY.map((day) => (
                <div key={day.day}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-foreground font-bold text-sm">{day.day}</p>
                      <p className="text-muted-foreground text-xs">{day.date}</p>
                    </div>
                  </div>
                  <div className="ml-4 border-l-2 border-border pl-4 space-y-3">
                    {day.activities.map((act) => (
                      <div key={act.label} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-base -ml-[18px]">{act.icon}</div>
                        </div>
                        <div className="flex-1 bg-card border border-border rounded-2xl p-3 shadow-sm">
                          <div className="flex items-start justify-between">
                            <p className="text-foreground text-xs font-bold flex-1 pr-2">{act.label}</p>
                            <span className="text-primary text-[10px] font-bold">{act.cost}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-muted-foreground text-[10px]">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{act.time}</span>
                            <span>{act.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Events section */}
              <div>
                <p className="text-foreground font-bold text-sm mb-3">Local Events</p>
                <div className="space-y-2">
                  {EVENTS.map((e) => (
                    <div key={e.name} className="bg-card border border-border rounded-2xl p-3.5 flex items-center gap-3">
                      <span className="text-2xl">{e.icon}</span>
                      <div className="flex-1">
                        <p className="text-foreground text-xs font-bold">{e.name}</p>
                        <p className="text-muted-foreground text-[10px]">{e.date} · {e.venue}</p>
                      </div>
                      <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">{e.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom action bar */}
      <div className="flex gap-3 px-5 py-4 border-t border-border bg-card flex-shrink-0">
        <button className="flex-1 py-3 rounded-2xl bg-muted text-foreground font-bold text-sm flex items-center justify-center gap-2">
          <Edit className="w-4 h-4" /> Edit
        </button>
        <button className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/30">
          <Download className="w-4 h-4" /> Save Plan
        </button>
      </div>
    </div>
  );
}

// ─── Settings Screen ──────────────────────────────────────────────────────────
function SettingsScreen({ onBack, dark, onDarkToggle }: { onBack: () => void; dark: boolean; onDarkToggle: () => void }) {
  return (
    <div className="absolute inset-0 bg-background flex flex-col">
      <StatusBar />
      <div className="px-5 py-3 flex items-center gap-4 border-b border-border flex-shrink-0">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-foreground font-bold text-base">Settings</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5" style={{ scrollbarWidth: "none" }}>
        {[
          {
            section: "Appearance",
            items: [
              { label: "Dark Mode", icon: Moon, toggle: true, value: dark, action: onDarkToggle },
              { label: "Text Size", icon: Zap, value: "Medium" },
            ],
          },
          {
            section: "Preferences",
            items: [
              { label: "Language", icon: Globe, value: "English" },
              { label: "Currency", icon: DollarSign, value: "USD ($)" },
              { label: "Measurement", icon: Map, value: "Metric" },
            ],
          },
          {
            section: "Accessibility",
            items: [
              { label: "Larger Text", icon: Zap, toggle: true, value: false },
              { label: "High Contrast", icon: Zap, toggle: true, value: false },
            ],
          },
          {
            section: "Notifications",
            items: [
              { label: "Flight Alerts", icon: Plane, toggle: true, value: true },
              { label: "Price Drops", icon: TrendingUp, toggle: true, value: true },
              { label: "Weather Alerts", icon: Cloud, toggle: true, value: true },
              { label: "Travel Advisories", icon: AlertTriangle, toggle: true, value: true },
            ],
          },
          {
            section: "Account",
            items: [
              { label: "Privacy & Data", icon: Shield },
              { label: "Export Data", icon: Download },
              { label: "Delete Account", icon: Trash2, danger: true },
            ],
          },
        ].map(({ section, items }) => (
          <div key={section} className="mb-5">
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2 px-1">{section}</p>
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              {items.map(({ label, icon: Icon, value, toggle, action, danger }: { label: string; icon: ComponentType<{ className?: string }>; value?: boolean | string; toggle?: boolean; action?: () => void; danger?: boolean }, i) => (
                <button
                  key={label}
                  onClick={action}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 ${i < items.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${danger ? "bg-red-50 dark:bg-red-900/20" : "bg-muted"}`}>
                    <Icon className={`w-4 h-4 ${danger ? "text-destructive" : "text-muted-foreground"}`} />
                  </div>
                  <span className={`flex-1 text-left text-sm font-semibold ${danger ? "text-destructive" : "text-foreground"}`}>{label}</span>
                  {toggle ? (
                    <div className={`w-11 h-6 rounded-full transition-all ${value ? "bg-primary" : "bg-switch-background"} flex items-center px-0.5`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow transition-all ${value ? "translate-x-5" : "translate-x-0"}`} />
                    </div>
                  ) : typeof value === "string" ? (
                    <span className="text-muted-foreground text-xs">{value}</span>
                  ) : (
                    !toggle && !danger && <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
        <p className="text-center text-muted-foreground text-xs py-4">TravelGenie v1.0.0 · Made with ❤️</p>
      </div>
    </div>
  );
}

// ─── Chat Overlay ─────────────────────────────────────────────────────────────
function ChatOverlay({ onClose, dark }: { onClose: () => void; dark: boolean }) {
  const [messages, setMessages] = useState(CHAT_SEED);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user" as const, text: input };
    const aiMsg = { role: "ai" as const, text: "Great question! Let me check that for you and update your itinerary accordingly. 🌟" };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => { setMessages((m) => [...m, aiMsg]); }, 800);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="absolute inset-0 bg-background flex flex-col z-50"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border flex-shrink-0" style={{ background: "linear-gradient(135deg, #1e40af, #1d4ed8)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">TravelGenie AI</p>
              <p className="text-white/60 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                Always available
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        {/* Suggestion chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {SUGGESTION_CHIPS.map((chip) => (
            <button key={chip} onClick={() => setInput(chip)} className="flex-shrink-0 text-white/80 text-xs font-medium bg-white/10 rounded-full px-3 py-1.5 border border-white/20">
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ scrollbarWidth: "none" }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "ai" && (
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center mr-2 flex-shrink-0 self-end mb-1">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-primary text-white rounded-br-sm" : "bg-card border border-border text-foreground rounded-bl-sm"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-border flex items-center gap-2 flex-shrink-0">
        <button className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
          <Mic className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-muted rounded-2xl px-4 py-2.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask anything about your trip…"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none"
          />
        </div>
        <button onClick={send} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${input.trim() ? "bg-primary" : "bg-muted"}`}>
          <Send className={`w-4 h-4 ${input.trim() ? "text-white" : "text-muted-foreground"}`} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [tab, setTab] = useState<Tab>("home");
  const [dark, setDark] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const go = (s: Screen) => setScreen(s);

  const isMainScreen = screen === "main";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: dark ? "linear-gradient(135deg, #020617 0%, #0f172a 50%, #042f2e 100%)" : "linear-gradient(135deg, #dbeafe 0%, #f8fafc 40%, #d1fae5 100%)" }}
    >
      {/* Phone frame */}
      <div
        className={`relative w-[390px] h-[844px] rounded-[44px] overflow-hidden shadow-2xl border ${dark ? "border-slate-700" : "border-white/60"} ${dark ? "dark" : ""} flex-shrink-0`}
        style={{ boxShadow: dark ? "0 40px 80px rgba(0,0,0,0.7)" : "0 40px 80px rgba(37,99,235,0.15), 0 0 0 1px rgba(255,255,255,0.8)" }}
      >
        {/* Screen routing */}
        <AnimatePresence mode="wait">
          {screen === "splash" && (
            <motion.div key="splash" className="absolute inset-0" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SplashScreen onDone={() => go("welcome")} />
            </motion.div>
          )}

          {screen === "welcome" && (
            <motion.div key="welcome" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WelcomeScreen onNext={() => go("onboarding")} />
            </motion.div>
          )}

          {screen === "onboarding" && (
            <motion.div key="onboarding" className="absolute inset-0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <OnboardingScreen onDone={() => go("main")} />
            </motion.div>
          )}

          {screen === "main" && (
            <motion.div key="main" className="absolute inset-0 bg-background" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Tab content */}
              <div className="absolute inset-0 bottom-[78px]">
                {tab === "home" && <HomeTab onTripDetail={() => go("trip-detail")} onPlan={() => go("plan")} dark={dark} />}
                {tab === "explore" && <ExploreTab onTripDetail={() => go("trip-detail")} dark={dark} />}
                {tab === "trips" && <TripsTab onTripDetail={() => go("trip-detail")} dark={dark} />}
                {tab === "profile" && <ProfileTab dark={dark} onDarkToggle={() => setDark((d) => !d)} onSettings={() => go("settings")} />}
              </div>

              {/* Floating AI chat button */}
              {!showChat && (
                <motion.button
                  onClick={() => setShowChat(true)}
                  className="absolute bottom-24 right-5 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-30"
                  style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                </motion.button>
              )}

              {/* Bottom nav */}
              <BottomNav tab={tab} onChange={setTab} onPlan={() => go("plan")} />

              {/* Chat overlay */}
              <AnimatePresence>
                {showChat && <ChatOverlay onClose={() => setShowChat(false)} dark={dark} />}
              </AnimatePresence>
            </motion.div>
          )}

          {screen === "plan" && (
            <motion.div key="plan" className="absolute inset-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <PlanWizard onBack={() => go("main")} onGenerate={() => go("ai-loading")} dark={dark} />
            </motion.div>
          )}

          {screen === "ai-loading" && (
            <motion.div key="ai-loading" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AILoadingScreen onDone={() => go("trip-detail")} />
            </motion.div>
          )}

          {screen === "trip-detail" && (
            <motion.div key="trip-detail" className="absolute inset-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <TripDetailScreen onBack={() => go("main")} dark={dark} />
            </motion.div>
          )}

          {screen === "settings" && (
            <motion.div key="settings" className="absolute inset-0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <SettingsScreen onBack={() => go("main")} dark={dark} onDarkToggle={() => setDark((d) => !d)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phone notch decoration */}
        {screen === "main" && tab === "home" ? null : (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-foreground rounded-full z-50 pointer-events-none opacity-[0.92]" />
        )}
      </div>

      {/* Desktop hint */}
      <p className="absolute bottom-4 text-center text-sm font-medium" style={{ color: dark ? "rgba(148,163,184,0.6)" : "rgba(71,85,105,0.6)" }}>
        TravelGenie — Plan Less. Explore More. ✈️
      </p>
    </div>
  );
}
