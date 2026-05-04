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
  PartyPopper,
  Cake,
  HandHeart,
  MousePointer2,
  RefreshCw,
  Sparkles,
  Flame,
  Send,
  MessageCircle
} from 'lucide-react';
import { cn } from './lib/utils';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test Connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface Prayer {
  id?: string;
  name: string;
  content: string;
  createdAt: any;
}

// THE DEEP STORY OF LINTANG (Beranjak Dewasa Edition)
const STORY_PAGES = [
  {
    id: 0,
    type: "text",
    content: "katanya, waktu itu lari. tapi kadang kita yang terlalu sibuk jalan di tempat.",
    subContent: "hari ini… langkahmu nambah satu tahun lagi, Lintang. 🌟",
  },
  {
    id: 1,
    type: "text",
    title: "Di tengah ritme yang cepat...",
    content: "dunia makin berisik, tanggung jawab makin berat, dan mimpi kadang kerasa makin jauh.",
    subContent: "tapi di server kecil ini… kamu tetap punya tempat buat sekadar jadi diri sendiri. tanpa topeng, tanpa beban.",
  },
  {
    id: 2,
    type: "photo",
    title: "Beranjak Dewasa",
    content: "kamu mungkin merasa nggak banyak berubah...",
    subContent: "tapi kehadiranmu di sini itu berarti. cara kamu tumbuh, cara kamu bertahan… itu inspirasi buat kita. makasih ya, Lintang, udah tetap bersinar meski langit lagi mendung. ✨",
  },
  {
    id: 3,
    type: "troll",
    title: "Identity Check",
    content: "katanya kalau makin dewasa, makin susah buat bahagia...",
    subContent: "ayo kita lawan itu. buktikan kamu masih punya 'api' buat ngejar kebahagiaan kamu hari ini. (Tangkap tombolnya! 😈)"
  },
  {
    id: 4,
    type: "challenge",
    title: "Momen Pendek",
    content: "challenge buat Lintang yang makin dewasa.",
    challenge: {
        task: "rekam video 10 detik.",
        note: "lihat kamera, dan senyum yang paling lebar.",
        script: "halo, ini Lintang. di umur yang baru ini… aku bakal lebih sayang sama diriku sendiri. 🌟"
    },
    footerNote: "Simpan ini. Nanti kalau duniamu lagi capek, tonton lagi buat ingat kalau kamu pernah sesenang ini."
  },
  {
    id: 5,
    type: "candle",
    title: "The Ritual",
    content: "sebelum kita tutup hari ini...",
    subContent: "nyalakan lilin ini, tarik napas dalam-dalam, dan titipkan satu doa untuk satu tahun ke depan."
  },
  {
    id: 6,
    type: "finale",
    title: "Selamat Ulang Tahun",
    content: "selamat beranjak dewasa, Lintang. makasih sudah berani melangkah sejauh ini.",
    subContent: "di antara jutaan bintang, buat kita… kamu tetap yang paling terang di server ini. 🎂🌟",
    isFinal: true
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState(-1); // -1: Intro/Start
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [trollPos, setTrollPos] = useState({ x: 0, y: 0 });
  const [trollCount, setTrollCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isCandleLit, setIsCandleLit] = useState(false);
  const [wishes, setWishes] = useState<Prayer[]>([]);
  const [newName, setNewName] = useState('');
  const [newWish, setNewWish] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Fetch Wishes
    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Prayer[];
      setWishes(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'wishes'));

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Asset Paths
  const musicUrl = "/lintang_song.mp3";
  const photoUrl = "/lintang_star.png.png";

  const triggerConfetti = () => {
    const end = Date.now() + 6 * 1000;
    const colors = ['#C2A378', '#A37C74', '#ffffff', '#EBE8E4'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 45,
        origin: { x: 0, y: 0.8 },
        colors: colors
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 45,
        origin: { x: 1, y: 0.8 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleStart = () => {
    setHasStarted(true);
    setIsMusicPlaying(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(e => console.log("Audio blocked", e));
    }
    setCurrentPage(0);
  };

  const handleNext = () => {
    if (currentPage < STORY_PAGES.length - 1) {
      setCurrentPage(prev => prev + 1);
      if (STORY_PAGES[currentPage + 1]?.isFinal) {
        setTimeout(triggerConfetti, 800);
      }
    }
  };

  const handleTrollHover = () => {
    if (trollCount < 6) {
      const x = (Math.random() - 0.5) * 500;
      const y = (Math.random() - 0.5) * 400;
      setTrollPos({ x, y });
      setTrollCount(prev => prev + 1);
    } else {
      setTrollPos({ x: 0, y: 0 });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-canvas text-paper select-none cursor-none">
      <div className="film-grain" />
      <div className="vignette-overlay" />

      {/* Floating Star Cursor */}
      <motion.div 
        className="star-cursor pointer-events-none hidden md:block fixed top-0 left-0 z-[9999]"
        style={{ pointerEvents: 'none', width: '6px', height: '6px' }}
        animate={{ 
          x: mousePos.x - 4, 
          y: mousePos.y - 4,
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          x: { type: "spring", damping: 30, stiffness: 200, mass: 0.5 },
          y: { type: "spring", damping: 30, stiffness: 200, mass: 0.5 },
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
      />

      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="particle particle-animation"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      <audio ref={audioRef} src={musicUrl} loop />

      {/* Music Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: hasStarted ? 0.3 : 0 }}
        className="fixed top-12 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.5em] transition-all"
      >
        <div className="flex gap-1 items-end h-3">
          {[1, 2, 3, 4].map(i => (
            <motion.div 
              key={i}
              animate={{ height: isMusicPlaying ? [4, 12, 4] : 4 }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
              className="w-px bg-paper"
            />
          ))}
        </div>
        <div className="flex flex-col">
          <span className="animate-pulse">{isMusicPlaying ? 'Bernadya — Beranjak Dewasa' : 'Music Paused'}</span>
          <span className="text-[6px] opacity-50 tracking-normal mt-0.5 font-light">Now Playing from Local Asset</span>
        </div>
      </motion.div>

      {/* Audio Toggle */}
      <AnimatePresence>
        {hasStarted && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-12 right-12 z-[110]"
          >
            <button 
              onClick={() => {
                const nextState = !isMusicPlaying;
                setIsMusicPlaying(nextState);
                if (audioRef.current) {
                  if (nextState) audioRef.current.play();
                  else audioRef.current.pause();
                }
              }}
              className="group p-5 rounded-full border border-white/5 bg-white/5 backdrop-blur-xl text-paper hover:bg-white hover:text-canvas transition-all duration-700"
            >
              {isMusicPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentPage === -1 ? (
          <motion.div 
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 2 }}
            className="text-center space-y-12 z-10 max-w-xl"
          >
            <div className="space-y-6">
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 0.2 }}
                 transition={{ duration: 3 }}
                 className="flex justify-center"
               >
                 <Star size={100} strokeWidth={0.5} />
               </motion.div>
               <h1 className="font-serif italic text-6xl md:text-8xl tracking-tighter leading-tight">
                 Sebuah Pesan <br/> Untuk <span className="text-gold-dust">Lintang</span>
               </h1>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="btn-cinematic mx-auto mt-12"
            >
              Dengarkan <ArrowRight size={14} />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            key={`page-${currentPage}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-full max-w-4xl z-10"
          >
            <div className="card-letter">
               <Quote className="absolute -top-6 -left-6 text-gold-dust opacity-10" size={120} />
               
               <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
                  <div className={cn("space-y-10", STORY_PAGES[currentPage].type === "photo" ? "md:col-span-7" : "md:col-span-12")}>
                    {STORY_PAGES[currentPage].title && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-4 text-subtle"
                      >
                         <div className="w-8 h-px bg-gold-dust" />
                         <span>{STORY_PAGES[currentPage].title}</span>
                      </motion.div>
                    )}

                    <div className="font-serif italic text-3xl md:text-5xl text-paper leading-[1.4] tracking-tight">
                      <Typewriter
                        options={{
                          strings: [STORY_PAGES[currentPage].content],
                          autoStart: true,
                          delay: 45,
                          cursor: "",
                          loop: false
                        }}
                      />
                    </div>

                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.5 }}
                      className="text-lg md:text-2xl font-light text-paper/40 leading-relaxed max-w-2xl border-l border-gold-dust/20 pl-10 reveal-text"
                    >
                      {STORY_PAGES[currentPage].subContent}
                    </motion.p>
                  </div>

                  {STORY_PAGES[currentPage].type === "photo" && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                      animate={{ opacity: 1, scale: 1, rotate: 1 }}
                      className="md:col-span-5 flex justify-center"
                    >
                       <div className="relative p-3 bg-white/5 border border-white/10 ring-1 ring-white/5 photo-glow float-slow">
                          <div className="overflow-hidden aspect-[3/4] w-full bg-canvas">
                             <img 
                                src={photoUrl} 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800";
                                }}
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[4000ms] scale-110 hover:scale-100"
                                alt="Lintang Star"
                                referrerPolicy="no-referrer"
                             />
                          </div>
                          <div className="mt-6 space-y-1 px-2">
                            <p className="font-serif text-gold-dust text-lg italic opacity-80">Snapshot No. 0412</p>
                            <p className="text-[8px] tracking-widest uppercase opacity-30">Our bright moon in a quiet night</p>
                          </div>
                       </div>
                    </motion.div>
                  )}
               </div>

               {/* Troll Mechanism */}
               {STORY_PAGES[currentPage].type === "troll" && (
                 <div className="flex flex-col items-center py-20">
                   <motion.div
                     animate={{ x: trollPos.x, y: trollPos.y }}
                     onMouseEnter={handleTrollHover}
                   >
                     <motion.button 
                        onClick={() => { if (trollCount >= 5) handleNext(); }}
                        className="px-16 py-6 border border-gold-dust/50 text-gold-dust font-bold uppercase tracking-[0.4em] rounded-full shadow-2xl hover:bg-gold-dust hover:text-canvas transition-all duration-700 text-[10px] flex items-center gap-4"
                     >
                        Kirim Doa <MousePointer2 size={14} />
                     </motion.button>
                   </motion.div>
                   {trollCount > 0 && trollCount < 5 && (
                     <p className="mt-8 text-subtle animate-pulse">Oops! Kebahagiaan sedang berkejaran... tangkap dulu!</p>
                   )}
                 </div>
               )}

               {/* Challenge UI */}
               {STORY_PAGES[currentPage].type === "challenge" && (
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3 }}
                    className="mt-16 p-12 bg-white/[0.02] border border-white/5 rounded-2xl relative overflow-hidden group"
                 >
                    <div className="absolute top-10 right-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                        <Camera size={120} />
                    </div>
                    <div className="flex items-center gap-4 mb-10">
                       <Camera size={18} className="text-gold-dust" />
                       <span className="text-[9px] uppercase tracking-[0.4em] font-black opacity-30">Digital Time Capsule</span>
                    </div>
                    <div className="space-y-10 relative z-10">
                       <p className="text-3xl md:text-5xl font-serif italic text-gold-dust leading-tight">"{STORY_PAGES[currentPage].challenge?.task}"</p>
                       <div className="text-paper/40 text-lg md:text-xl font-light italic pl-8 border-l border-white/10 py-2">
                          "{STORY_PAGES[currentPage].challenge?.script}"
                       </div>
                    </div>
                    <p className="mt-12 text-[8px] uppercase tracking-[0.5em] opacity-20 text-center">{STORY_PAGES[currentPage].footerNote}</p>
                 </motion.div>
               )}

               {/* Candle UI */}
               {STORY_PAGES[currentPage].type === "candle" && (
                 <div className="flex flex-col items-center py-10 space-y-12">
                   <div className="relative group cursor-pointer" onClick={() => setIsCandleLit(true)}>
                      {/* Candle Base */}
                      <div className="w-16 h-32 bg-paper/10 border border-white/10 rounded-t-lg relative overflow-hidden">
                        <div className="absolute bottom-0 w-full bg-gold-dust/20 h-full transition-all duration-[10000ms]" style={{ height: isCandleLit ? '20%' : '100%' }} />
                      </div>
                      {/* Flame */}
                      <AnimatePresence>
                        {isCandleLit && (
                          <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute -top-24 left-1/2 -translate-x-1/2"
                          >
                            {/* Glare */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 candle-glare blur-3xl opacity-50" />
                            
                            <div className="flame-animation w-8 h-14 bg-gradient-to-t from-orange-600 via-yellow-400 to-white rounded-full shadow-[0_0_40px_rgba(249,115,22,0.8)] relative z-10" />
                            <div className="star-cursor pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 scale-[2]" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {!isCandleLit && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                           <span className="text-[10px] uppercase tracking-[0.3em] font-black opacity-30 group-hover:opacity-100 transition-opacity">Klik untuk menyalakan</span>
                        </div>
                      )}
                   </div>

                   {isCandleLit && (
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md space-y-6"
                     >
                        <div className="flex flex-col gap-4">
                           <input 
                              type="text" 
                              placeholder="Siapa namamu?" 
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              className="bg-transparent border-b border-white/10 pb-2 focus:border-gold-dust outline-none transition-colors text-paper placeholder:text-paper/20"
                           />
                           <textarea 
                              placeholder="Tulis doamu di sini..." 
                              value={newWish}
                              onChange={(e) => setNewWish(e.target.value)}
                              className="bg-transparent border-b border-white/10 pb-2 focus:border-gold-dust outline-none transition-colors text-paper placeholder:text-paper/20 h-24 resize-none"
                           />
                        </div>
                        <button 
                          disabled={isSubmitting || !newName || !newWish}
                          onClick={async () => {
                            setIsSubmitting(true);
                            try {
                              await addDoc(collection(db, 'wishes'), {
                                name: newName,
                                content: newWish,
                                createdAt: serverTimestamp()
                              });
                              setNewName('');
                              setNewWish('');
                              handleNext();
                            } catch (error) {
                              handleFirestoreError(error, OperationType.WRITE, 'wishes');
                            } finally {
                              setIsSubmitting(false);
                            }
                          }}
                          className="w-full btn-cinematic justify-center"
                        >
                          {isSubmitting ? 'Mengirim...' : 'Titipkan Doa'} <Send size={12} />
                        </button>
                     </motion.div>
                   )}
                 </div>
               )}

               {/* Final UI */}
               {STORY_PAGES[currentPage].isFinal && (
                 <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                    className="flex flex-col items-center gap-12 pt-12"
                 >
                    <div className="flex gap-12">
                       {[Heart, PartyPopper, Cake].map((Icon, idx) => (
                         <motion.div 
                            key={idx}
                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -10, 0] }} 
                            transition={{ repeat: Infinity, duration: 4, delay: idx * 0.5 }} 
                            className="text-gold-dust"
                         >
                            <Icon size={30} strokeWidth={1} />
                         </motion.div>
                       ))}
                    </div>
                    
                    <div className="space-y-4">
                       <h2 className="text-4xl md:text-7xl font-serif italic text-center max-w-2xl leading-tight">
                          Tetaplah menjadi terangnya Lintang.
                       </h2>
                       <motion.p 
                         initial={{ opacity: 0 }} 
                         animate={{ opacity: 0.3 }} 
                         transition={{ delay: 3 }}
                         className="text-[10px] tracking-[0.8em] uppercase text-center"
                       >
                         You are infinite.
                       </motion.p>
                    </div>

                    {/* Wishes Wall */}
                    <div className="w-full border-t border-white/5 pt-12 mt-12 overflow-hidden">
                       <div className="flex items-center gap-4 mb-8 text-subtle">
                          <MessageCircle size={14} />
                          <span>Titipan Doa</span>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                          {wishes.map((wish, idx) => (
                            <motion.div 
                              key={wish.id || idx}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-6 bg-white/[0.02] border border-white/5 rounded-xl space-y-4"
                            >
                               <Quote size={16} className="text-gold-dust opacity-30" />
                               <p className="text-sm font-light leading-relaxed italic">"{wish.content}"</p>
                               <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                  <span className="text-[10px] font-bold text-gold-dust uppercase tracking-widest">{wish.name}</span>
                                  <span className="text-[8px] opacity-20">{wish.createdAt?.toDate ? wish.createdAt.toDate().toLocaleDateString() : 'Baru saja'}</span>
                               </div>
                            </motion.div>
                          ))}
                          {wishes.length === 0 && (
                            <p className="col-span-full text-center text-subtle italic py-10 opacity-30">Belum ada doa yang ditulis... Jadilah yang pertama?</p>
                          )}
                       </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-10 pt-10">
                       <button onClick={() => { setCurrentPage(-1); setTrollCount(0); setIsCandleLit(false); }} className="text-subtle hover:text-paper transition-all flex items-center gap-2">
                         <RefreshCw size={12} /> Dari awal lagi?
                       </button>
                       <button onClick={triggerConfetti} className="text-gold-dust border-b border-gold-dust/20 pb-1 text-[10px] uppercase font-black tracking-[0.3em] flex items-center gap-3">
                         Kirim Cinta <HandHeart size={14} />
                       </button>
                    </div>
                 </motion.div>
               )}

               {/* Standard Navigation */}
               {!STORY_PAGES[currentPage].isFinal && STORY_PAGES[currentPage].type !== "troll" && (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4.5 }}
                    className="mt-20 flex justify-end"
                 >
                    <button onClick={handleNext} className="group flex items-center gap-8">
                       <span className="text-subtle group-hover:opacity-100 group-hover:text-gold-dust transition-all duration-1000">Langkah Berikutnya</span>
                       <div className="h-px bg-white/10 w-24 group-hover:w-40 group-hover:bg-gold-dust transition-all duration-[2000ms]" />
                       <div className="p-4 rounded-full border border-white/5 bg-white/5 group-hover:bg-white group-hover:text-canvas transition-all">
                          <ArrowRight size={18} />
                       </div>
                    </button>
                 </motion.div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-10 w-full px-12 flex justify-between items-center z-50 pointer-events-none opacity-20">
         <div className="text-[8px] font-black uppercase tracking-[1em]">LINTANG // 2026</div>
         <div className="flex gap-6">
            <Sparkles size={14} />
            <Sparkles size={14} />
         </div>
      </footer>
    </div>
  );
}
