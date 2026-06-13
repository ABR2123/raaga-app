import { Heart, Play, Search, Bell, MoreHorizontal, Pause } from "lucide-react";

const songs = [
  { id: "1", title: "Tum Hi Ho", artist: "Arijit Singh", album: "Aashiqui 2", dur: "4:22", img: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/35/d6/45/35d64545-7b28-1b80-2dca-0b6c0a20bcd3/source/500x500bb.jpg" },
  { id: "2", title: "Kesariya", artist: "Arijit Singh", album: "Brahmastra", dur: "4:28", img: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/01/b6/50/01b65034-4e6f-3b66-55ce-7d3c08fa5b24/source/500x500bb.jpg" },
  { id: "3", title: "Raataan Lambiyan", artist: "Jubin Nautiyal", album: "Shershaah", dur: "3:41", img: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/ca/7f/e8/ca7fe887-7dfc-26cd-a9c8-c3cfd6b2af64/source/500x500bb.jpg" },
  { id: "4", title: "Besharam Rang", artist: "Vishal & Sheykhar", album: "Pathaan", dur: "3:04", img: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/66/ca/31/66ca3142-55e8-4d50-b99b-73d5a5c40a13/source/500x500bb.jpg" },
];

const trending = [
  { id: "t1", title: "On Top", artist: "Karan Aujla", img: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/4a/0a/19/4a0a19e8-7c6e-3e4e-2e2e-4c7ecf5ee5a5/source/500x500bb.jpg" },
  { id: "t2", title: "Ilahi", artist: "Arijit Singh", img: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/35/d6/45/35d64545-7b28-1b80-2dca-0b6c0a20bcd3/source/500x500bb.jpg" },
  { id: "t3", title: "Baller", artist: "Shubh", img: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/01/b6/50/01b65034-4e6f-3b66-55ce-7d3c08fa5b24/source/500x500bb.jpg" },
  { id: "t4", title: "Lover", artist: "Diljit Dosanjh", img: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/ca/7f/e8/ca7fe887-7dfc-26cd-a9c8-c3cfd6b2af64/source/500x500bb.jpg" },
];

export function Glassmorphism() {
  return (
    <div
      className="w-[390px] min-h-[844px] overflow-y-auto relative font-['Inter']"
      style={{ background: "linear-gradient(145deg, #0a0015 0%, #0d001a 40%, #0a0a1a 70%, #000d0d 100%)" }}
    >
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />
        <div className="absolute top-40 right-0 w-56 h-56 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #FF6B35 0%, transparent 70%)" }} />
        <div className="absolute bottom-60 left-10 w-48 h-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 px-5 pt-14 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-purple-300/60 font-medium tracking-widest uppercase mb-1">Friday Evening</p>
            <h1 className="text-4xl font-black tracking-tight"
              style={{ background: "linear-gradient(90deg, #fff 0%, #c4b5fd 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Raaga
            </h1>
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}>
              <Search size={15} color="rgba(255,255,255,0.7)" />
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center relative"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}>
              <Bell size={15} color="rgba(255,255,255,0.7)" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500" />
            </button>
          </div>
        </div>

        {/* Now Playing Glass Card */}
        <div className="rounded-3xl p-4 mb-8 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(24px)" }}>
          <div className="absolute inset-0 opacity-20"
            style={{ background: "linear-gradient(135deg, #7c3aed20, #FF6B3520)" }} />
          <div className="relative flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <img src={songs[0].img} alt="" className="w-16 h-16 rounded-2xl object-cover" />
              <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: "0 0 20px rgba(255,107,53,0.4)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-purple-300/60 uppercase tracking-widest font-semibold mb-0.5">Now Playing</p>
              <p className="text-white font-bold text-base truncate">{songs[0].title}</p>
              <p className="text-white/50 text-sm truncate">{songs[0].artist}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #FF6B35, #e05a2b)" }}>
                <Play size={14} color="white" fill="white" />
              </button>
              <button><Heart size={18} color="rgba(255,255,255,0.4)" /></button>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="h-1 rounded-full w-2/5" style={{ background: "linear-gradient(90deg, #7c3aed, #FF6B35)" }} />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-white/30">1:45</span>
              <span className="text-[10px] text-white/30">4:22</span>
            </div>
          </div>
        </div>

        {/* Trending Now */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Trending Now</h2>
            <span className="text-xs text-orange-400 font-medium">See all</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {trending.map((t) => (
              <div key={t.id} className="flex-shrink-0 w-32 group">
                <div className="relative rounded-2xl overflow-hidden mb-2.5">
                  <img src={t.img} alt="" className="w-32 h-32 object-cover" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.4)" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(255,107,53,0.9)", backdropFilter: "blur(8px)" }}>
                      <Play size={14} color="white" fill="white" />
                    </div>
                  </div>
                  {/* glass badge */}
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    ♫
                  </div>
                </div>
                <p className="text-white text-xs font-semibold truncate">{t.title}</p>
                <p className="text-white/40 text-[11px] truncate">{t.artist}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bollywood Hits — Glass list */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Bollywood Hits</h2>
            <span className="text-xs text-orange-400 font-medium">See all</span>
          </div>
          <div className="rounded-3xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
            {songs.map((song, i) => (
              <div key={song.id}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: i < songs.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <span className="text-white/20 text-xs w-4 text-center font-mono">{i + 1}</span>
                <img src={song.img} alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{song.title}</p>
                  <p className="text-white/40 text-[11px] truncate">{song.artist}</p>
                </div>
                <span className="text-white/30 text-xs font-mono">{song.dur}</span>
                <button><MoreHorizontal size={16} color="rgba(255,255,255,0.2)" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Moods */}
        <div>
          <h2 className="text-base font-bold text-white mb-4">Quick Moods</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Romantic", color: "from-pink-900/60 to-rose-900/40", border: "border-pink-500/20" },
              { label: "Workout", color: "from-orange-900/60 to-red-900/40", border: "border-orange-500/20" },
              { label: "Devotional", color: "from-yellow-900/60 to-amber-900/40", border: "border-yellow-500/20" },
              { label: "Party", color: "from-purple-900/60 to-violet-900/40", border: "border-purple-500/20" },
            ].map((m) => (
              <div key={m.label}
                className={`rounded-2xl px-4 py-5 bg-gradient-to-br ${m.color} border ${m.border} flex items-center justify-between`}
                style={{ backdropFilter: "blur(12px)" }}>
                <span className="text-white text-sm font-bold">{m.label}</span>
                <Play size={16} color="rgba(255,255,255,0.5)" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto"
        style={{ background: "rgba(10,0,21,0.85)", backdropFilter: "blur(24px)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex justify-around items-center px-6 py-4 pb-8">
          {["Home", "Search", "Library"].map((tab, i) => (
            <div key={tab} className="flex flex-col items-center gap-1">
              <div className={`w-1 h-1 rounded-full ${i === 0 ? "bg-orange-500" : "bg-transparent"}`} />
              <span className={`text-xs font-semibold ${i === 0 ? "text-orange-400" : "text-white/30"}`}>{tab}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
