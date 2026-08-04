import { useState } from 'react';
import { ArrowRight, Calendar, Compass, PenTool, Sparkles, Phone, Mail, User, Building2 } from 'lucide-react';

export default function ConsultationScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Residential Villa',
    vision: ''
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[#020202] text-white/90 relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[400px] md:h-[600px] bg-gradient-to-b from-[#106135]/20 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-[-10%] md:top-[-20%] right-[-10%] w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-[#cca550]/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-16 pt-24 md:pt-32 pb-16 md:pb-24 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 min-h-full items-center">
        
        {/* LEFT COLUMN: The Pitch */}
        <div className="lg:col-span-5 flex flex-col justify-center animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#cca550] tracking-[0.2em] uppercase mb-8 w-fit backdrop-blur-md">
            <Sparkles size={14} /> Private Consultation
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-light mb-6 md:mb-8 leading-[1.1] text-white">
            Bring Your <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#cca550] to-[#e8cf96]">Vision</span> to Life.
          </h1>
          
          <p className="text-lg text-white/60 font-light leading-relaxed mb-12 max-w-lg">
            Our master architects and surface specialists are at your disposal. Schedule an exclusive, one-on-one session to curate bespoke materials and transform your architectural blueprints into a breathing masterpiece.
          </p>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#106135] to-[#0a3d21] flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(16,97,53,0.3)]">
                <Compass size={20} className="text-[#cca550]" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-white mb-2">Bespoke Material Curation</h3>
                <p className="text-sm text-white/50 leading-relaxed font-light">Access our private vault of unlisted, rare-cut European marbles and avant-garde architectural porcelains.</p>
              </div>
            </div>
            
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#106135] to-[#0a3d21] flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(16,97,53,0.3)]">
                <PenTool size={20} className="text-[#cca550]" />
              </div>
              <div>
                <h3 className="text-xl font-serif text-white mb-2">Dedicated Concierge Design</h3>
                <p className="text-sm text-white/50 leading-relaxed font-light">Your personal architectural liaison will guide you from conceptual sketching to final installation logistics.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Form */}
        <div className="lg:col-span-7 flex flex-col justify-center animate-fade-up delay-100">
          <div className="bg-[#0a0a0a] border border-white/10 p-6 sm:p-10 rounded-2xl relative overflow-hidden backdrop-blur-2xl shadow-2xl group">
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <h2 className="text-2xl font-serif text-white mb-2">Request an Appointment</h2>
            <p className="text-sm text-white/40 tracking-wide font-light mb-10">Please provide your project details below. Our team will contact you within 24 hours.</p>

            <form className="space-y-6 relative z-10" onSubmit={e => e.preventDefault()}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><User size={12}/> Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:border-[#cca550] outline-none transition-colors placeholder:text-white/20" 
                    placeholder="E.g. Asad Qaisar" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><Mail size={12}/> Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:border-[#cca550] outline-none transition-colors placeholder:text-white/20" 
                    placeholder="asadqaisar@gmail.com" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><Phone size={12}/> Phone Number</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:border-[#cca550] outline-none transition-colors placeholder:text-white/20" 
                    placeholder="+92 300 1234567" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><Building2 size={12}/> Project Type</label>
                  <div className="relative">
                    <select 
                      value={formData.projectType}
                      onChange={e => setFormData({...formData, projectType: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-sm outline-none appearance-none cursor-pointer hover:border-white/30 focus:border-[#cca550] transition-colors"
                    >
                      <option className="bg-[#111]">Residential Villa</option>
                      <option className="bg-[#111]">Commercial Office</option>
                      <option className="bg-[#111]">Hospitality / Hotel</option>
                      <option className="bg-[#111]">Retail Boutique</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 text-xs">▼</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><Calendar size={12}/> Project Vision & Scope</label>
                <textarea 
                  value={formData.vision}
                  onChange={e => setFormData({...formData, vision: e.target.value})}
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:border-[#cca550] outline-none transition-colors placeholder:text-white/20 resize-none" 
                  placeholder="E.g. I want to tile my drawing room in Lahore, approx 500 sq ft, looking for marble or premium porcelain finish..." 
                />
              </div>

              <div className="pt-4">
                <button className="w-full group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#cca550] to-[#e8cf96] text-black font-bold tracking-widest uppercase text-sm rounded-xl overflow-hidden transition-all hover:scale-[1.02] shadow-[0_0_40px_rgba(204,165,80,0.3)]">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative">Request Consultation</span>
                  <ArrowRight size={18} className="relative group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
