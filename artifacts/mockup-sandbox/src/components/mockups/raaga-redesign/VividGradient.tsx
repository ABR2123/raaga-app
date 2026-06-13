import { Heart, Play, Shuffle, ChevronRight, Search, Home, Library, Mic2 } from "lucide-react";

const songs = [
  { id: "1", title: "Tum Hi Ho", artist: "Arijit Singh", dur: "4:22", img: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/35/d6/45/35d64545-7b28-1b80-2dca-0b6c0a20bcd3/source/500x500bb.jpg", plays: "124M" },
  { id: "2", title: "Kesariya", artist: "Arijit Singh", dur: "4:28", img: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/01/b6/50/01b65034-4e6f-3b66-55ce-7d3c08fa5b24/source/500x500bb.jpg", plays: "98M" },
  { id: "3", title: "Raataan Lambiyan", artist: "Jubin Nautiyal", dur: "3:41", img: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/ca/7f/e8/ca7fe887-7dfc-26cd-a9c8-c3cfd6b2af64/source/500x500bb.jpg", plays: "87M" },
  { id: "4", title: "Besharam Rang", artist: "Vishal & Sheykhar", dur: "3:04", img: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/66/ca/31/66ca3142-55e8-4d50-b99b-73d5a5c40a13/source/500x500bb.jpg", plays: "71M" },
];

const categories = [
  { label: "Bollywood", emoji: "🎬", from: "#FF6B35", to: "#e8441a" },
  { label: "Punjabi", emoji: "🥁", from: "#a855f7", to: "#7c3aed" },
  { label: "Classical", emoji: "🪘", from: "#f59e0b", to: "#d97706" },
  { label: "Romantic", emoji: "💗", from: "#ec4899", to: "#db2777" },
  { label: "Party", emoji: "🎉", from: "#06b6d4", to: "#0891b2" },
  { label: "Devotional", emoji: "🕯️", from: "#84cc16", to: "#65a30d" },
];

export function VividGradient() {
  return (
    <div className="w-[390px] min-h-[844px] overflow-y-auto font-['Inter'] bg-[#080808]">
      {/* Hero gradient header */}
      <div className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #FF6B35 0%, #c2410c 45%, #1a0a00 100%)", paddingTop: "56px", paddingBottom: "32px" }}>
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #FFD700 0%, transparent 70%)" }} />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FF1493 0%, transparent 70%)" }} />
        <div className="relative px-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-orange-200/70 text-[11px] font-semibold uppercase tracking-[3px] mb-1.5">India Top Charts</p>
              <h1 className="text-white font-black text-5xl tracking-tighter leading-none mb-1">RAAGA</h1>
              <p className="text-orange-100/60 text-xs font-medium">2026 Edition · 124 new releases</p>
            </div>
            <button className="mt-2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Search size={17} color="white" />
            </button>
          </div>
          {/* Quick action pills */}
          <div className="flex gap-2 mt-6">
            <button className="px-4 py-2 rounded-full text-xs font-bold text-black"
              style={{ background: "white" }}>
              Play All
            </button>
            <button className="px-4 py-2 rounded-full text-xs font-bold text-white border border-white/30 flex items-center gap-1.5">
              <Shuffle size={11} /> Shuffle
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 pb-32">
        {/* Category grid */}
        <div className="mt-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">Browse Genres</h2>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {categories.map((c) => (
              <button key={c.label}
                className="rounded-2xl py-4 flex flex-col items-center gap-1.5 font-bold"
                style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}>
                <span className="text-2xl">{c.emoji}</span>
                <span className="text-white text-[11px] font-bold">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trending — Big horizontal cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">🔥 Trending India</h2>
            <span className="text-orange-400 text-xs font-semibold">See all <ChevronRight size={10} className="inline" /></span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {songs.map((s, i) => (
              <div key={s.id} className="flex-shrink-0 w-[160px] rounded-2xl overflow-hidden relative group"
                style={{ background: "linear-gradient(145deg, #1a1a1a, #111)" }}>
                <img src={s.img} alt="" className="w-full h-[160px] object-cover" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.5)" }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "#FF6B35" }}>
                    <Play size={18} color="white" fill="white" />
                  </div>
                </div>
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                  style={{ background: "#FF6B35" }}>
                  {i + 1}
                </div>
                <div className="p-3">
                  <p className="text-white text-xs font-bold truncate">{s.title}</p>
                  <p className="text-white/50 text-[10px] truncate">{s.artist}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-orange-400 text-[10px] font-semibold">{s.plays} plays</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arijit Singh Focus */}
        <div className="mb-8 rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1a0533, #0d0033)" }}>
          <div className="relative p-4">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-30"
              style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />
            <div className="relative flex items-center gap-4 mb-4">
              <img src={songs[0].img} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                style={{ boxShadow: "0 0 24px rgba(168,85,247,0.5)" }} />
              <div>
                <p className="text-purple-300 text-[10px] uppercase tracking-widest font-semibold">Artist Focus</p>
                <p className="text-white font-black text-xl">Arijit Singh</p>
                <p className="text-white/40 text-xs">12.4B monthly listeners</p>
              </div>
            </div>
            <div className="space-y-1">
              {songs.slice(0, 3).map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 py-2.5"
                  style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <span className="text-white/20 text-xs w-4 font-mono">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{s.title}</p>
                    <p className="text-white/40 text-[11px]">{s.dur}</p>
                  </div>
                  <Heart size={15} color="rgba(168,85,247,0.6)" />
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(90deg, #a855f7, #7c3aed)" }}>
              <Play size={14} fill="white" /> Play Artist Radio
            </button>
          </div>
        </div>

        {/* Daily Mix chips */}
        <div>
          <h2 className="text-white font-bold text-lg mb-4">Your Daily Mix</h2>
          <div className="space-y-3">
            {[
              { label: "Bollywood Love Mix", songs: "25 songs", color: "#FF6B35" },
              { label: "Punjabi Beats 2026", songs: "18 songs", color: "#a855f7" },
              { label: "Morning Ragas", songs: "12 songs", color: "#f59e0b" },
            ].map((mix) => (
              <div key={mix.label} className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: "#141414" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${mix.color}20` }}>
                  <Mic2 size={20} color={mix.color} />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-bold">{mix.label}</p>
                  <p className="text-white/40 text-xs">{mix.songs}</p>
                </div>
                <button className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: mix.color }}>
                  <Play size={13} color="white" fill="white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto"
        style={{ background: "#080808", borderTop: "1px solid #1a1a1a" }}>
        <div className="flex justify-around items-center px-4 py-3 pb-7">
          {[
            { icon: <Home size={20} />, label: "Home", active: true },
            { icon: <Search size={20} />, label: "Search", active: false },
            { icon: <Library size={20} />, label: "Library", active: false },
          ].map((tab) => (
            <div key={tab.label} className="flex flex-col items-center gap-1">
              <div style={{ color: tab.active ? "#FF6B35" : "rgba(255,255,255,0.3)" }}>{tab.icon}</div>
              <span className={`text-[10px] font-semibold ${tab.active ? "text-orange-400" : "text-white/30"}`}>{tab.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
