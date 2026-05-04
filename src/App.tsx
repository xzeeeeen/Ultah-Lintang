import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import Typewriter from 'typewriter-effect';
import { 
  Star, 
  Heart, 
  Quote, 
  ArrowRight, 
  Camera, 
  Volume2, 
  VolumeX, 
  Sparkles,
  PartyPopper,
  Cake,
  HandHeart,
  Target,
  RefreshCw,
  Moon
} from 'lucide-react';
import { cn } from './lib/utils';

// POETIC STORY SEQUENCE
const STORY_PAGES = [
  {
    id: 0,
    type: "text",
    title: "A Shared Silence",
    content: "hari ini ada satu orang yang harus berhenti scroll bentar.",
    subContent: "iya, kamu, Lintang. 🌟",
    delay: 3
  },
  {
    id: 1,
    type: "text",
    title: "Small Fragments",
    content: "kadang kita ngobrol random. kadang cuma lihat chat lewat. kadang cuma ketawa gara-gara hal receh yang bahkan besok udah lupa.",
    subContent: "tapi anehnya… hal-hal kecil kayak gitu justru yang bikin server ini kerasa hidup.",
  },
  {
    id: 2,
    type: "photo",
    title: "The Invisible Presence",
    content: "mungkin kamu nggak selalu sadar…",
    subContent: "tapi kehadiran kamu di sini itu kerasa. Bukan karena kamu ngomong banyak, tapi cukup karena 'oh, Lintang online.' Dan entah kenapa… rasanya jadi lebih hangat. ✨",
    photoUrl: "/lintang_star.png"
  },
  {
    id: 3,
    type: "troll",
    title: "Happiness Verification",
    content: "sebelum lanjut ke pesan yang paling dalam...",
    subContent: "ada satu syarat terakhir: buktikan kamu siap bahagia hari ini dengan klik tombol di bawah. (Jangan kabur ya! 😈)"
  },
  {
    id: 4,
    type: "challenge",
    title: "A Moment Stuck in Time",
    content: "sekarang ada challenge kecil nih.",
    challenge: {
        task: "rekam video 10 detik.",
        note: "nggak perlu pidato aneh-aneh.",
        script: "halo, aku Lintang. makasih ya… udah nemenin aku tumbuh satu tahun lagi. 🌟"
    },
    footerNote: "Bukan buat ngerjain kamu—lebih kayak kapsul waktu buat kamu di masa depan."
  },
  {
    id: 5,
    type: "wishes",
    title: "Gentle Hopes",
    content: "umur memang nambah. tapi semoga capeknya nggak ikut numpuk.",
    subContent: "semoga hal-hal baik… pelan-pelan nemuin kamu. dan semoga hari-hari random ke depan tetap punya alasan buat senyum. 🐻"
  },
  {
    id: 6,
    type: "finale",
    title: "Happy Birthday, Lintang",
    content: "selamat ulang tahun ya, Lintang. makasih… udah jadi bagian kecil dari tempat random ini.",
    subContent: "dan semoga… kamu tetap jadi Lintang yang kita kenal. Terang terus ya, si Bintang di server ini. 🎂🌟",
    isFinal: true
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState(-1);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [trollPos, setTrollPos] = useState({ x: 0, y: 0 });
  const [trollAttempt, setTrollAttempt] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sentimental Background Music - Inspired by "Bernadya - Satu Bulan"
  const musicUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";

  const triggerGrandFinale = () => {
    const end = Date.now() + (4 * 1000);
    const colors = ['#B4975A', '#D4A39A', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleNext = () => {
    if (currentPage < STORY_PAGES.length - 1) {
      setCurrentPage(prev => prev + 1);
      if (STORY_PAGES[currentPage + 1]?.isFinal) {
        setTimeout(triggerGrandFinale, 500);
      }
    }
  };

  const handleTrollInteraction = () => {
    if (trollAttempt < 5) {
      const newX = (Math.random() - 0.5) * 350;
      const newY = (Math.random() - 0.5) * 350;
      setTrollPos({ x: newX, y: newY });
      setTrollAttempt(prev => prev + 1);
    } else {
      // After a few tries, let them catch it
      setTrollPos({ x: 0, y: 0 });
    }
  };

  return (
    <div className="min-h-screen bg-silk-cream flex flex-col items-center justify-center p-6 relative overflow-hidden vignette select-none">
      <div className="grain-overlay" />
      <audio ref={audioRef} src={musicUrl} loop />

      {/* Decorative Floating Stars */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <StarsLayer />
      </div>

      {/* Audio Toggle */}
      <button 
        onClick={() => {
          setIsMusicPlaying(!isMusicPlaying);
          if (audioRef.current) {
            if (isMusicPlaying) audioRef.current.pause();
            else audioRef.current.play();
          }
        }}
        className="fixed top-12 right-12 z-[110] p-4 rounded-full border border-noir-dark/5 bg-white/20 backdrop-blur-md text-noir-dark hover:bg-white/80 transition-all shadow-sm"
      >
        {isMusicPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>

      <AnimatePresence mode="wait">
        {currentPage === -1 ? (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
            transition={{ duration: 1.5 }}
            className="text-center space-y-12 z-10 max-w-xl"
          >
            <div className="space-y-4">
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 transition={{ delay: 0.5 }}
                 className="flex justify-center mb-8"
               >
                 <Moon size={40} className="text-muted-gold opacity-50" strokeWidth={1} />
               </motion.div>
               <h1 className="font-serif italic text-7xl md:text-9xl text-noir-dark tracking-tighter leading-tight">
                 Surat Untuk <br/> <span className="text-muted-gold">Lintang</span>
               </h1>
            </div>
            
            <p className="text-noir-dark font-light tracking-[0.6em] uppercase text-[9px] opacity-40">
              The star inhabiting our server
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="btn-ethereal mx-auto mt-8"
            >
              Langkah Pertama <ArrowRight size={14} />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            key={`page-${currentPage}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 1 }}
            className="w-full max-w-5xl z-10 p-4 md:p-12"
          >
            <div className="card-poetic">
               <Quote className="absolute -top-6 -left-6 text-muted-gold opacity-10" size={120} />
               
               <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
                  <div className={cn("space-y-10", STORY_PAGES[currentPage].type === "photo" ? "md:col-span-7" : "md:col-span-12")}>
                    {STORY_PAGES[currentPage].title && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-4"
                      >
                         <div className="w-12 h-px bg-muted-gold/30" />
                         <span className="text-[9px] uppercase font-bold tracking-[0.5em] text-muted-gold">
                           {STORY_PAGES[currentPage].title}
                         </span>
                      </motion.div>
                    )}

                    <div className="font-serif italic text-4xl md:text-6xl text-noir-dark leading-[1.3]">
                      <Typewriter
                        options={{
                          strings: [STORY_PAGES[currentPage].content],
                          autoStart: true,
                          delay: 45,
                          cursor: "|",
                          loop: false
                        }}
                      />
                    </div>

                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2 }}
                      className="text-lg md:text-2xl font-light text-noir-dark/60 leading-relaxed max-w-3xl border-l border-muted-gold/20 pl-10 py-4 italic font-sans"
                    >
                      {STORY_PAGES[currentPage].subContent}
                    </motion.p>
                  </div>

                  {/* Aesthetic Photo Placeholder */}
                  {STORY_PAGES[currentPage].type === "photo" && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                      animate={{ opacity: 1, scale: 1, rotate: 2 }}
                      className="md:col-span-5 flex justify-center"
                    >
                       <div className="bg-white p-6 pb-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] ring-1 ring-black/5 rotate-2 group">
                          <div className="overflow-hidden aspect-[3/4] w-full bg-silk-cream">
                             <img 
                                src={STORY_PAGES[currentPage].photoUrl} 
                                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[2000ms]"
                                alt="Memory Snapshot"
                                referrerPolicy="no-referrer"
                             />
                          </div>
                          <div className="mt-8 space-y-1">
                            <p className="font-serif text-muted-gold text-xl text-center italic">Lintang_Star.jpeg</p>
                            <p className="text-[8px] tracking-widest text-center uppercase opacity-30">Captured in the hearts of others</p>
                          </div>
                       </div>
                    </motion.div>
                  )}
               </div>

               {/* Troll Mechanism - Syarat Bahagia */}
               {STORY_PAGES[currentPage].type === "troll" && (
                 <div className="flex flex-col items-center py-16 space-y-8">
                   <motion.div
                     animate={{ x: trollPos.x, y: trollPos.y }}
                     onMouseEnter={handleTrollInteraction}
                   >
                     <motion.button 
                        onClick={() => {
                          if (trollAttempt >= 5) handleNext();
                        }}
                        className="px-16 py-6 bg-noir-dark text-white font-bold uppercase tracking-[0.3em] rounded-full shadow-3xl hover:bg-muted-gold transition-all duration-500 text-[10px] flex items-center gap-4"
                     >
                        {trollAttempt < 5 ? "Ambil Bahagiamu" : "Bahagia Terverifikasi ✅"} 
                        <Target size={14} className={trollAttempt < 5 ? "animate-pulse" : ""} />
                     </motion.button>
                   </motion.div>
                   <p className="text-[9px] font-bold text-muted-gold uppercase tracking-[0.4em] animate-pulse">
                     {trollAttempt > 0 && trollAttempt < 5 ? "Jangan biarkan bahagiamu lepas! Ayo tangkap!" : ""}
                   </p>
                 </div>
               )}

               {/* Challenge UI - Sentimental Box */}
               {STORY_PAGES[currentPage].type === "challenge" && (
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5 }}
                    className="mt-16 p-12 bg-white/20 rounded-[3rem] border border-white/50 space-y-10 group relative"
                 >
                    <div className="absolute right-12 top-12 text-muted-gold/10">
                       <Camera size={140} />
                    </div>
                    <div className="flex items-center gap-4">
                       <Camera className="text-muted-gold" size={20} />
                       <h4 className="text-[9px] font-black tracking-[0.4em] uppercase text-muted-gold">The 10-Second Digital Echo</h4>
                    </div>
                    <div className="space-y-8 relative z-10">
                       <p className="text-3xl md:text-5xl font-serif italic text-noir-dark leading-tight">"{STORY_PAGES[currentPage].challenge?.task}"</p>
                       <div className="p-8 bg-noir-dark/5 backdrop-blur-md rounded-3xl border border-noir-dark/5 italic text-noir-dark/70 text-lg md:text-xl">
                          "{STORY_PAGES[currentPage].challenge?.script}"
                       </div>
                    </div>
                    <p className="mt-8 text-[8px] uppercase tracking-[0.5em] opacity-30 text-center italic">{STORY_PAGES[currentPage].footerNote}</p>
                 </motion.div>
               )}

               {/* Finale UI */}
               {STORY_PAGES[currentPage].isFinal && (
                 <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }}
                    className="flex flex-col items-center gap-12 pt-24"
                 >
                    <div className="flex gap-10">
                       {[Heart, PartyPopper, Cake].map((Icon, idx) => (
                         <motion.div 
                            key={idx}
                            animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }} 
                            transition={{ repeat: Infinity, duration: 4, delay: idx * 0.5 }} 
                            className="bg-white p-6 rounded-full shadow-xl text-muted-gold"
                         >
                            <Icon size={28} />
                         </motion.div>
                       ))}
                    </div>
                    
                    <h2 className="text-5xl md:text-7xl font-serif italic text-center text-noir-dark tracking-tight">Kado terbesar kami adalah kamu.</h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 -mt-6">Halaman ini untukmu, Lintang.</p>
                    
                    <div className="flex flex-wrap justify-center gap-8 pt-8">
                       <button 
                         onClick={() => { setCurrentPage(-1); }}
                         className="flex items-center gap-3 text-muted-gold hover:text-noir-dark transition-all border-b border-muted-gold/20 pb-1 text-[10px] font-bold uppercase tracking-[0.4em]"
                       >
                         <RefreshCw size={14} /> Baca Awal Lagi
                       </button>
                       <button 
                         onClick={triggerGrandFinale}
                         className="px-10 py-4 bg-muted-gold text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:shadow-muted-gold/40 transition-all hover:-translate-y-1"
                       >
                         Kirim Cinta Sekali Lagi <HandHeart size={14} className="inline ml-2" />
                       </button>
                    </div>
                 </motion.div>
               )}

               {/* Navigation Controls */}
               {!STORY_PAGES[currentPage].isFinal && STORY_PAGES[currentPage].type !== "troll" && (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4 }}
                    className="mt-16 flex justify-end"
                 >
                    <button 
                       onClick={handleNext} 
                       className="group flex items-center gap-8 text-noir-dark"
                    >
                       <span className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-20 group-hover:opacity-100 transition-all duration-1000">Selami Lebih Dalam</span>
                       <div className="h-px bg-noir-dark/10 w-24 group-hover:w-40 group-hover:bg-muted-gold transition-all duration-[1500ms]" />
                       <div className="p-4 rounded-full bg-noir-dark/5 group-hover:bg-noir-dark group-hover:text-white transition-all transform hover:rotate-12">
                          <ArrowRight size={18} />
                       </div>
                    </button>
                 </motion.div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-12 w-full px-16 flex justify-between items-center z-50 pointer-events-none">
         <div className="text-[8px] font-black uppercase tracking-[1em] opacity-10">LINTANG MEMOIRE // MAY 2026</div>
         <div className="flex gap-6 opacity-10">
            <Sparkles size={14} />
            <Star size={14} />
         </div>
      </footer>
    </div>
  );
}

function StarsLayer() {
  const [elements, setElements] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  useEffect(() => {
    const stars = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
    }));
    setElements(stars);
  }, []);

  return (
    <div className="absolute inset-0">
      {elements.map(s => (
        <motion.div 
          key={s.id}
          animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 2, 1] }}
          transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
          style={{ 
            left: `${s.x}%`, 
            top: `${s.y}%`, 
            width: `${s.size}px`, 
            height: `${s.size}px` 
          }}
          className="absolute bg-muted-gold rounded-full shadow-[0_0_10px_#B4975A]"
        />
      ))}
    </div>
  );
}
