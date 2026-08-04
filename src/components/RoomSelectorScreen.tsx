import type { Room } from '../lib/types';
import { ArrowRight, ArrowLeft, MapPin, Phone, Mail } from 'lucide-react';
import { Logo } from './Logo';

interface Props {
  onSelect: (room: Room) => void;
  onOpen3D?: () => void;
  onOpenCalculator?: () => void;
}

export default function RoomSelectorScreen({ onOpen3D, onOpenCalculator }: Props) {
  return (
    <div className="flex-1 flex flex-col bg-[#060606] overflow-y-auto overflow-x-hidden text-white/90">

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative w-full min-h-screen flex flex-col justify-center items-center px-5 sm:px-10 md:px-20 overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-[url('/hero-new.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-[#060606]/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060606]/50 via-transparent to-transparent" />

        {/* High-End Editorial Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center mt-20">
          
          <div className="flex flex-col items-center mb-8">
            <span className="w-px h-16 bg-gradient-to-b from-transparent to-[#cca550] mb-6" />
            <p className="text-[#cca550] text-[10px] sm:text-xs font-sans font-semibold tracking-[0.4em] uppercase">
              Marhaba Home
            </p>
          </div>

          <h1 className="font-serif font-light leading-[0.9] tracking-tight mb-10 w-full">
            <span className="block text-5xl sm:text-7xl md:text-[110px] lg:text-[140px] text-white">
              CURATED
            </span>
            <span className="block text-4xl sm:text-6xl md:text-[90px] lg:text-[120px] text-transparent bg-clip-text bg-gradient-to-r from-[#cca550] via-[#e8cf96] to-[#cca550] italic pr-4 md:pr-12">
              Surfaces
            </span>
          </h1>

          <p className="text-white/70 text-xs sm:text-sm md:text-base font-sans font-light leading-relaxed max-w-2xl mb-16 tracking-[0.15em] uppercase">
            Pakistan's foremost supplier of architectural ceramics and natural stone. <br className="hidden md:block" /> Specified by leading practices.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 w-full">
            <button
              onClick={() => onOpen3D && onOpen3D()}
              className="group flex items-center justify-center gap-4 text-white text-xs sm:text-sm font-sans font-bold uppercase tracking-[0.25em] transition-all hover:text-[#cca550]"
            >
              <span className="relative">
                Enter 3D Visualizer
                <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-white/30 group-hover:bg-[#cca550] transition-colors duration-500" />
              </span>
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
            </button>
            
            <button
              onClick={() => onOpenCalculator && onOpenCalculator()}
              className="group flex items-center justify-center gap-4 text-white/50 text-xs sm:text-sm font-sans font-bold uppercase tracking-[0.25em] transition-all hover:text-white"
            >
              <span className="relative">
                Tile Calculator
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-500" />
              </span>
            </button>
          </div>
          
        </div>

      </section>

      {/* ─── EDITORIAL GALLERY ────────────────────────── */}
      <section className="w-full py-28 px-10 md:px-20 bg-[#060606]">
        <div className="max-w-[1400px] mx-auto">

          {/* Section label */}
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-6">
              <span className="w-12 h-px bg-[#cca550]/50" />
              <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em]">Current Collection · 2026</p>
            </div>
            <div className="flex gap-2">
              <button className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:border-white/30 hover:text-white transition-all">
                <ArrowLeft size={14} />
              </button>
              <button className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40 hover:border-white/30 hover:text-white transition-all">
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Asymmetric editorial grid */}
          <div className="grid grid-cols-12 gap-6">

            {/* Large feature: col 1-7, 2 rows */}
            <div className="col-span-12 md:col-span-7 row-span-2 group cursor-pointer relative overflow-hidden rounded-[2rem] border border-white/10" style={{aspectRatio: '7/5'}}>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center transition-all duration-[800ms] group-hover:scale-110 group-hover:blur-[2px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-x-4 bottom-4 p-6 flex items-end justify-between backdrop-blur-xl bg-black/20 border border-white/10 rounded-3xl translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                <div>
                  <p className="text-xs text-[#cca550] uppercase tracking-[0.25em] mb-2 font-sans font-bold">Feature Stone</p>
                  <h3 className="text-3xl font-serif font-light text-white group-hover:text-[#cca550] transition-colors duration-300">Statuario Venato</h3>
                  <p className="text-xs text-white/70 font-sans uppercase tracking-[0.15em] mt-2">Carrara · Large Format · Polished</p>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#cca550] group-hover:bg-[#cca550] transition-all duration-300 flex-shrink-0">
                  <ArrowRight size={16} className="text-white group-hover:text-black transition-colors" />
                </div>
              </div>
            </div>

            {/* Right col top */}
            <div className="col-span-12 md:col-span-5 group cursor-pointer relative overflow-hidden rounded-[2rem] border border-white/10" style={{aspectRatio: '5/3'}}>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center transition-all duration-[800ms] group-hover:scale-110 group-hover:blur-[2px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-x-4 bottom-4 p-5 flex items-end justify-between backdrop-blur-xl bg-black/20 border border-white/10 rounded-[1.5rem] translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                <div>
                  <h3 className="text-xl font-serif font-light text-white group-hover:text-[#cca550] transition-colors duration-300">Ardesia Grigia</h3>
                  <p className="text-[10px] text-white/70 font-sans uppercase tracking-widest mt-1">Slate · Textured · Natural</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#cca550] group-hover:border-[#cca550] transition-all duration-300 flex-shrink-0">
                  <ArrowRight size={14} className="text-white group-hover:text-black" />
                </div>
              </div>
            </div>

            {/* Right col bottom */}
            <div className="col-span-12 md:col-span-5 group cursor-pointer relative overflow-hidden rounded-[2rem] border border-white/10" style={{aspectRatio: '5/3'}}>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center transition-all duration-[800ms] group-hover:scale-110 group-hover:blur-[2px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-x-4 bottom-4 p-5 flex items-end justify-between backdrop-blur-xl bg-black/20 border border-white/10 rounded-[1.5rem] translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                <div>
                  <h3 className="text-xl font-serif font-light text-white group-hover:text-[#cca550] transition-colors duration-300">Calacatta Gold</h3>
                  <p className="text-[10px] text-white/70 font-sans uppercase tracking-widest mt-1">Marble · Polished · 120×60</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#cca550] group-hover:border-[#cca550] transition-all duration-300 flex-shrink-0">
                  <ArrowRight size={14} className="text-white group-hover:text-black" />
                </div>
              </div>
            </div>

            {/* Bottom row: 3 equal cards */}
            {[
              { img: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=600', name: 'Terrazzo Milano', sub: 'Composite · Bespoke Mix' },
              { img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600', name: 'Travertino Noce', sub: 'Classic · Cross-Cut' },
              { img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600', name: 'Pietra Serena', sub: 'Limestone · Honed' },
            ].map((c, i) => (
              <div key={i} className="col-span-12 md:col-span-4 group cursor-pointer relative overflow-hidden rounded-[2rem] border border-white/10" style={{aspectRatio: '4/3'}}>
                <div className="absolute inset-0 bg-cover bg-center transition-all duration-[800ms] group-hover:scale-110 group-hover:blur-[2px]" style={{backgroundImage: `url('${c.img}')`}} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute inset-x-3 bottom-3 p-4 flex items-end justify-between backdrop-blur-xl bg-black/20 border border-white/10 rounded-[1.2rem] translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  <div>
                    <h3 className="text-lg font-serif font-light text-white group-hover:text-[#cca550] transition-colors duration-300">{c.name}</h3>
                    <p className="text-[9px] text-white/70 font-sans uppercase tracking-widest mt-1">{c.sub}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#cca550] group-hover:border-[#cca550] transition-all duration-300 flex-shrink-0">
                    <ArrowRight size={12} className="text-white group-hover:text-black" />
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>



      {/* ─── WHY MARHABA — 3-col editorial ───────────── */}
      <section className="w-full py-20 md:py-32 px-5 sm:px-10 md:px-20 bg-[url('https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-fixed bg-center relative">
        <div className="absolute inset-0 bg-[#060606]/90 backdrop-blur-md" />
        
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 relative z-10">

          <div className="p-10 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 hover:-translate-y-2 transition-all duration-500 shadow-2xl">
            <p className="text-[#cca550] text-5xl font-serif font-light mb-6 leading-none">18+</p>
            <h3 className="text-sm font-sans font-bold text-white tracking-widest uppercase mb-4">Years of Precedent</h3>
            <p className="text-white/60 text-sm font-sans font-light leading-relaxed">
              Supplying Pakistan's most ambitious architectural projects since 2006. From private villas to five-star hospitality, our materials are specified at the highest level.
            </p>
          </div>

          <div className="p-10 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 hover:-translate-y-2 transition-all duration-500 shadow-2xl md:translate-y-8">
            <p className="text-[#cca550] text-5xl font-serif font-light mb-6 leading-none">340+</p>
            <h3 className="text-sm font-sans font-bold text-white tracking-widest uppercase mb-4">Material References</h3>
            <p className="text-white/60 text-sm font-sans font-light leading-relaxed">
              An unrivalled portfolio spanning Italian marble, Spanish porcelain, Turkish ceramics, and indigenous Pakistani stone — all held in stock and sample.
            </p>
          </div>

          <div className="p-10 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 hover:-translate-y-2 transition-all duration-500 shadow-2xl md:translate-y-16">
            <p className="text-[#cca550] text-5xl font-serif font-light mb-6 leading-none">3</p>
            <h3 className="text-sm font-sans font-bold text-white tracking-widest uppercase mb-4">Showrooms Nationwide</h3>
            <p className="text-white/60 text-sm font-sans font-light leading-relaxed">
              Our design studios in Faisalabad, Lahore and Multan are open by appointment — each offering a full-scale material library and consultation service.
            </p>
          </div>

        </div>
      </section>

      {/* ─── EDITORIAL IMAGE + COPY ───────────────────── */}
      <section className="w-full py-0 px-5 sm:px-10 md:px-20 bg-[#060606] pb-16 md:pb-28">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 border border-white/5">

          {/* Image */}
          <div className="relative overflow-hidden" style={{minHeight: '520px'}}>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=900')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#060606]/50" />
          </div>

          {/* Copy */}
          <div className="flex flex-col justify-center p-12 md:p-16 bg-[#0a0a0a]">
            <p className="text-sm font-bold text-white/25 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-[#cca550]/40" />
              Our Approach
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white leading-tight mb-8">
              Material selection<br/>is a discipline,<br/><span className="text-white/30 italic">not a decision.</span>
            </h2>
            <p className="text-white/45 text-sm font-light leading-relaxed mb-6">
              Every surface we supply is specified against the architectural intent of the project — not sold from a catalogue. Our technical team works alongside your practice from initial concept through to site sign-off.
            </p>
            <p className="text-white/40 text-sm font-light leading-relaxed mb-10">
              We hold full technical data sheets, slip-resistance ratings, chemical resistance profiles, and photographic installation records for every material in our range.
            </p>

          </div>

        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────── */}
      <footer className="w-full bg-[#0a0a0a] border-t border-white/5">

        {/* Top footer */}
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 md:px-20 py-8 md:py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">

          {/* Brand */}
          <div className="flex flex-col">
            <Logo className="w-24 h-auto mb-4 opacity-80" />
            <p className="text-white/40 text-xs font-light leading-relaxed max-w-xs">
              Supplying Pakistan's most ambitious architectural projects with natural stone and ceramic tile since 2006.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-xs text-white/40">
              <MapPin size={13} className="text-[#cca550]/60 flex-shrink-0" />
              47-B, Commercial Zone, DHA Phase 5, Lahore
            </div>
            <div className="flex items-center gap-3 text-xs text-white/40">
              <Phone size={13} className="text-[#cca550]/60 flex-shrink-0" />
              +92 300 000 0000
            </div>
            <div className="flex items-center gap-3 text-xs text-white/40">
              <Mail size={13} className="text-[#cca550]/60 flex-shrink-0" />
              hello@marhabahome.pk
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 px-5 sm:px-10 md:px-20 py-4 max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">© 2026 Marhaba Home Pvt. Ltd. · All Rights Reserved</p>
        </div>
      </footer>

      {/* Marquee keyframe */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

    </div>
  );
}
