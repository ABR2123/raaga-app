import { Heart, Play, ArrowUpRight, Plus } from "lucide-react";

const featured = {
  title: "Tum Hi Ho",
  artist: "Arijit Singh",
  album: "Aashiqui 2 · 2013",
  img: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/35/d6/45/35d64545-7b28-1b80-2dca-0b6c0a20bcd3/source/500x500bb.jpg",
  plays: "1.2B plays",
};

const listSongs = [
  { id: "1", title: "Kesariya", artist: "Arijit Singh", dur: "4:28", img: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/01/b6/50/01b65034-4e6f-3b66-55ce-7d3c08fa5b24/source/500x500bb.jpg" },
  { id: "2", title: "Raataan Lambiyan", artist: "Jubin Nautiyal", dur: "3:41", img: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/ca/7f/e8/ca7fe887-7dfc-26cd-a9c8-c3cfd6b2af64/source/500x500bb.jpg" },
  { id: "3", title: "Besharam Rang", artist: "Vishal & Sheykhar", dur: "3:04", img: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/66/ca/31/66ca3142-55e8-4d50-b99b-73d5a5c40a13/source/500x500bb.jpg" },
  { id: "4", title: "On Top", artist: "Karan Aujla", dur: "2:51", img: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/4a/0a/19/4a0a19e8-7c6e-3e4e-2e2e-4c7ecf5ee5a5/source/500x500bb.jpg" },
  { id: "5", title: "Sajni", artist: "Arijit Singh", dur: "2:50", img: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/35/d6/45/35d64545-7b28-1b80-2dca-0b6c0a20bcd3/source/500x500bb.jpg" },
];

const tags = ["All", "Bollywood", "Punjabi", "Classical", "Indie"];

export function EditorialMinimal() {
  return (
    <div className="w-[390px] min-h-[844px] bg-[#0a0a0a] font-['Inter'] overflow-y-auto">
      <div className="px-5 pt-14 pb-32">
        {/* Header — editorial wordmark style */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span className="text-orange-500 text-[10px] font-bold uppercase tracking-[4px]">India · 2026</span>
            </div>
            <h1 className="text-white font-black leading-none tracking-[-3px]"
              style={{ fontSize: "56px", fontFamily: "'Inter', sans-serif" }}>
              Raaga
            </h1>
          </div>
          <button className="mt-3 text-white/30 hover:text-white transition">
            <ArrowUpRight size={24} />
          </button>
        </div>

        {/* Filter tags */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
          {tags.map((t, i) => (
            <button key={t}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold"
              style={i === 0
                ? { background: "#FF6B35", color: "white" }
                : { background: "#1a1a1a", color: "rgba(255,255,255,0.5)", border: "1px solid #2a2a2a" }
              }>
              {t}
            </button>
          ))}
        </div>

        {/* Featured — full-bleed editorial card */}
        <div className="mb-8 group cursor-pointer">
          <div className="relative rounded-3xl overflow-hidden mb-4">
            <img src={featured.img} alt="" className="w-full aspect-square object-cover" />
            {/* Overlay gradient */}
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.2) 50%, transparent 100%)" }} />
            {/* Play button overlay */}
            <div className="absolute bottom-4 right-4">
              <button className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
                style={{ background: "#FF6B35", boxShadow: "0 8px 32px rgba(255,107,53,0.5)" }}>
                <Play size={22} color="white" fill="white" />
              </button>
            </div>
            {/* Top badge */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold text-white"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}>
              #1 IN INDIA
            </div>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-white text-2xl font-black leading-tight tracking-tight">{featured.title}</h2>
              <p className="text-white/40 text-sm mt-0.5">{featured.artist} · {featured.album}</p>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-orange-500 text-xs font-semibold">{featured.plays}</span>
              <button>
                <Heart size={20} color="rgba(255,255,255,0.3)" />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px" style={{ background: "#1e1e1e" }} />
          <span className="text-white/20 text-[10px] uppercase tracking-[3px] font-semibold">Chart · This Week</span>
          <div className="flex-1 h-px" style={{ background: "#1e1e1e" }} />
        </div>

        {/* List — ultra-clean */}
        <div className="mb-8">
          {listSongs.map((song, i) => (
            <div key={song.id}
              className="flex items-center gap-4 py-3.5 group cursor-pointer"
              style={{ borderBottom: "1px solid #141414" }}>
              <div className="w-5 text-right flex-shrink-0">
                <span className="text-white/20 text-xs font-mono group-hover:hidden">{String(i + 1).padStart(2, "0")}</span>
                <Play size={14} color="#FF6B35" fill="#FF6B35"
                  className="hidden group-hover:block ml-auto" />
              </div>
              <img src={song.img} alt="" className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{song.title}</p>
                <p className="text-white/35 text-xs truncate">{song.artist}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/20 text-xs font-mono">{song.dur}</span>
                <button className="opacity-0 group-hover:opacity-100 transition">
                  <Plus size={16} color="rgba(255,255,255,0.4)" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 2-column editorial grid */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-black text-lg tracking-tight">Trending Genres</h2>
            <span className="text-white/30 text-xs font-medium">All genres →</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Bollywood", count: "450 songs", img: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/35/d6/45/35d64545-7b28-1b80-2dca-0b6c0a20bcd3/source/500x500bb.jpg" },
              { label: "Punjabi", count: "280 songs", img: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/01/b6/50/01b65034-4e6f-3b66-55ce-7d3c08fa5b24/source/500x500bb.jpg" },
              { label: "Classical", count: "190 songs", img: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/ca/7f/e8/ca7fe887-7dfc-26cd-a9c8-c3cfd6b2af64/source/500x500bb.jpg" },
              { label: "Indie", count: "320 songs", img: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/66/ca/31/66ca3142-55e8-4d50-b99b-73d5a5c40a13/source/500x500bb.jpg" },
            ].map((g) => (
              <div key={g.label} className="relative rounded-2xl overflow-hidden aspect-square cursor-pointer group">
                <img src={g.img} alt="" className="w-full h-full object-cover transition group-hover:scale-105 duration-300" />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)" }} />
                <div className="absolute bottom-0 left-0 p-3">
                  <p className="text-white text-sm font-black leading-tight">{g.label}</p>
                  <p className="text-white/50 text-[10px]">{g.count}</p>
                </div>
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  style={{ background: "#FF6B35" }}>
                  <Play size={10} color="white" fill="white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom nav — minimal line style */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto"
        style={{ background: "#0a0a0a", borderTop: "1px solid #181818" }}>
        <div className="flex justify-around items-center px-6 py-4 pb-8">
          {[
            { label: "Home", active: true },
            { label: "Search", active: false },
            { label: "Library", active: false },
          ].map((tab) => (
            <div key={tab.label} className="flex flex-col items-center gap-1.5">
              <div className="h-0.5 w-5 rounded-full transition"
                style={{ background: tab.active ? "#FF6B35" : "transparent" }} />
              <span className={`text-xs font-semibold ${tab.active ? "text-white" : "text-white/25"}`}>{tab.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
