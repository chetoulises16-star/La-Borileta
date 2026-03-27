/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, ChevronDown, Star, Flame, MapPin, Quote } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

// --- Constants & Assets ---
const WHATSAPP_URL = "https://wa.me/549XXXXXXXXXX?text=Hola! Quiero pedir ahora";
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidMapsKey = Boolean(GOOGLE_MAPS_API_KEY) && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY';

// Default location for the Food Truck (Buenos Aires example)
const FOOD_TRUCK_LOCATION = { lat: -34.6037, lng: -58.3816 };

const ASSETS = {
  heroVideo: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/urls%20web/choripan.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1cmxzIHdlYi9jaG9yaXBhbi53ZWJwIiwiaWF0IjoxNzc0NjQ0OTY0LCJleHAiOjE4MDYxODA5NjR9.zemZ7uvuTA4vBnYNHZ1V3DQoIiNhYqMdYOCSosOI0zw",
  logo: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/urls%20web/cartelneon-ezgif.com-png-to-webp-converter.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1cmxzIHdlYi9jYXJ0ZWxuZW9uLWV6Z2lmLmNvbS1wbmctdG8td2VicC1jb252ZXJ0ZXIud2VicCIsImlhdCI6MTc3NDY0NDkyOSwiZXhwIjoxODA2MTgwOTI5fQ.AHQ2kQ0QPUca4SwWC-P_p7d2tqVAiYVLvuDFD0ip_YM",
  mascotVideo: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/urls%20web/foodtruck.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1cmxzIHdlYi9mb29kdHJ1Y2sud2VicCIsImlhdCI6MTc3NDY0NTExMSwiZXhwIjoxODA2MTgxMTExfQ.2yxhcbIrDI_P9ME7JlE-m0A2YLsibBrDxeRNELMT9bI",
  products: [
    {
      id: 1,
      name: "Choripán Argentino",
      description: "Chorizo jugoso a la parrilla, pan crocante y chimichurri casero.",
      price: "$6.000",
      image: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/urls%20web/Choripnargentinoconpapasfritas-ezgif.com-jpg-to-webp-converter.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1cmxzIHdlYi9DaG9yaXBuYXJnZW50aW5vY29ucGFwYXNmcml0YXMtZXpnaWYuY29tLWpwZy10by13ZWJwLWNvbnZlcnRlci53ZWJwIiwiaWF0IjoxNzc0NjQ1MDAyLCJleHAiOjE4MDYxODEwMDJ9.N11dJDRO0JQfv5jrjEEMU3JTQ7k3T0NwGtFekqLQpVc",
      badge: "🔥 Más vendido"
    },
    {
      id: 2,
      name: "Sándwich de Bondiola",
      description: "Bondiola a la parrilla, queso derretido, lechuga y tomate en pan rústico.",
      price: "$5.000",
      image: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/urls%20web/Sndwichdebondiolaconpapasfritas-ezgif.com-jpg-to-webp-converter.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1cmxzIHdlYi9TbmR3aWNoZGVib25kaW9sYWNvbnBhcGFzZnJpdGFzLWV6Z2lmLmNvbS1qcGctdG8td2VicC1jb252ZXJ0ZXIud2VicCIsImlhdCI6MTc3NDY0NTAyNSwiZXhwIjoxODA2MTgxMDI1fQ.IROvIsvnCX5UWCtfkF6XoVBsJuDgkZy9A8vGCoTd5uo",
      badge: "⭐ Recomendado"
    },
    {
      id: 3,
      name: "Hamburguesa Doble",
      description: "Doble carne, queso derretido, lechuga, tomate y pan crocante.",
      price: "$6.000",
      image: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/urls%20web/Sndwichdebondiolaconpapasfritas-ezgif.com-jpg-to-webp-converter.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1cmxzIHdlYi9TbmR3aWNoZGVib25kaW9sYWNvbnBhcGFzZnJpdGFzLWV6Z2lmLmNvbS1qcGctdG8td2VicC1jb252ZXJ0ZXIud2VicCIsImlhdCI6MTc3NDY0NTA3MCwiZXhwIjoxODA2MTgxMDcwfQ.GoHEBAJuhIDMRu488ADkaK0UBvSQS_EXc4BRFxdZG_Q",
      badge: "🔥 Más vendido"
    },
    {
      id: 4,
      name: "Salchipapas",
      description: "Papas fritas con salchichas troceadas y salsas especiales.",
      price: "$450",
      image: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/urls%20web/Salchipapasconsalsayhierbas-ezgif.com-jpg-to-webp-converter.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1cmxzIHdlYi9TYWxjaGlwYXBhc2NvbnNhbHNheWhpZXJiYXMtZXpnaWYuY29tLWpwZy10by13ZWJwLWNvbnZlcnRlci53ZWJwIiwiaWF0IjoxNzc0NjQ1MDg5LCJleHAiOjE4MDYxODEwODl9.T64W3LW6n81NFDqvnvu-C7r6X-roCuWFo6ALlhrsnIE"
    }
  ],
  promos: [
    {
      id: 1,
      name: "Combo Amigos: 2 Choripanes + Papas",
      price: "$11.000",
      image: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/urls%20web/Choripnargentinoconpapasfritas-ezgif.com-jpg-to-webp-converter.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1cmxzIHdlYi9DaG9yaXBuYXJnZW50aW5vY29ucGFwYXNmcml0YXMtZXpnaWYuY29tLWpwZy10by13ZWJwLWNvbnZlcnRlci53ZWJwIiwiaWF0IjoxNzc0NjQ1MDAyLCJleHAiOjE4MDYxODEwMDJ9.N11dJDRO0JQfv5jrjEEMU3JTQ7k3T0NwGtFekqLQpVc"
    },
    {
      id: 2,
      name: "Promo Bondiola: Sándwich + Bebida",
      price: "$6.500",
      image: "https://tligscofqdyubgmumyla.supabase.co/storage/v1/object/sign/urls%20web/Sndwichdebondiolaconpapasfritas-ezgif.com-jpg-to-webp-converter.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZjQwOWM4Zi0wYmI1LTQyODMtYjZlZS1iNDQ2MTY3YjQxMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1cmxzIHdlYi9TbmR3aWNoZGVib25kaW9sYWNvbnBhcGFzZnJpdGFzLWV6Z2lmLmNvbS1qcGctdG8td2VicC1jb252ZXJ0ZXIud2VicCIsImlhdCI6MTc3NDY0NTAyNSwiZXhwIjoxODA2MTgxMDI1fQ.IROvIsvnCX5UWCtfkF6XoVBsJuDgkZy9A8vGCoTd5uo"
    }
  ],
  reviews: [
    {
      id: 1,
      author: "Juan Pérez",
      rating: 5,
      text: "El mejor choripán que probé en mi vida. El chimichurri es de otro planeta. ¡Súper recomendado!",
      date: "Hace 2 semanas"
    },
    {
      id: 2,
      author: "María García",
      rating: 5,
      text: "La bondiola estaba increíblemente tierna. El servicio por WhatsApp fue rapidísimo. ¡Volveré!",
      date: "Hace 1 mes"
    },
    {
      id: 3,
      author: "Carlos Rodríguez",
      rating: 4,
      text: "Muy buena calidad y las salchipapas son gigantes. El food truck tiene toda la onda.",
      date: "Hace 3 días"
    }
  ]
};

// --- Components ---

const Badge = ({ text }: { text: string }) => (
  <div className="absolute top-4 left-4 z-10">
    <span className="bg-gold text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest glow-gold flex items-center gap-1">
      {text.includes('🔥') ? <Flame size={12} /> : <Star size={12} />}
      {text}
    </span>
  </div>
);

const WhatsAppButton = ({ className = "", text = "PEDIR POR WHATSAPP" }) => (
  <motion.a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`bg-gold hover:bg-gold-light text-black font-black py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 glow-gold hover:glow-gold-strong tracking-tighter ${className}`}
  >
    <MessageCircle size={20} fill="currentColor" />
    {text}
  </motion.a>
);

const MapsSplashScreen = () => (
  <div className="flex items-center justify-center p-8 bg-zinc-900/50 rounded-3xl border border-gold/20 text-center">
    <div className="max-w-md">
      <h2 className="text-xl font-bold mb-4 text-gold">Google Maps API Key Required</h2>
      <p className="text-sm text-zinc-400 mb-6">Para ver nuestra ubicación exacta, por favor configura tu API Key:</p>
      <div className="text-left text-xs space-y-3 bg-black/40 p-4 rounded-xl border border-white/5">
        <p>1. Obtén una clave en <a href="https://console.cloud.google.com/google/maps-apis/credentials" target="_blank" className="underline text-gold">Google Cloud</a></p>
        <p>2. Ve a <strong>Settings</strong> (⚙️) → <strong>Secrets</strong></p>
        <p>3. Agrega <code>GOOGLE_MAPS_PLATFORM_KEY</code></p>
      </div>
    </div>
  </div>
);

const ReviewCard = ({ review }: { review: typeof ASSETS.reviews[0] }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="bg-zinc-900/30 p-6 rounded-2xl border border-white/5 hover:border-gold/20 transition-all"
  >
    <div className="flex items-center gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} className={i < review.rating ? "fill-gold text-gold" : "text-zinc-700"} />
      ))}
    </div>
    <p className="text-zinc-300 text-sm italic mb-4 leading-relaxed">"{review.text}"</p>
    <div className="flex justify-between items-center">
      <span className="font-bold text-xs uppercase tracking-widest">{review.author}</span>
      <span className="text-zinc-600 text-[10px]">{review.date}</span>
    </div>
  </motion.div>
);

export default function App() {
  const [heroTitleVisible, setHeroTitleVisible] = useState(false);
  const [showPromos, setShowPromos] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroTitleVisible(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={ASSETS.heroVideo} 
            alt="Choripan Hero" 
            className="w-full h-full object-cover scale-105 animate-pulse-slow"
            style={{ animationDuration: '8s' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 left-8 z-20"
        >
          <img src={ASSETS.logo} alt="La Borileta Logo" className="h-20 md:h-28 w-auto drop-shadow-2xl" />
        </motion.div>

        <div className="relative z-20 flex flex-col items-center text-center px-6 mt-20">
          <AnimatePresence>
            {heroTitleVisible && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none mb-8 text-shadow-gold">
                  DE LA PARRILLA <br />
                  <span className="text-gold">DIRECTO A TU PALADAR</span>
                </h1>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none">
                  <motion.button
                    onClick={() => scrollToSection('menu')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-transparent border-2 border-gold text-gold font-black py-4 px-10 rounded-xl glow-gold hover:bg-gold hover:text-black transition-all duration-300 tracking-widest text-sm"
                  >
                    MENÚ
                  </motion.button>
                  <motion.button
                    onClick={() => scrollToSection('promos')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gold text-black font-black py-4 px-10 rounded-xl glow-gold-strong tracking-widest text-sm"
                  >
                    PROMOCIONES
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 z-20 text-gold/50"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* --- MENU SECTION --- */}
      <section id="menu" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">NUESTRO <span className="text-gold">MENÚ</span></h2>
          <p className="text-zinc-400 text-sm uppercase tracking-widest">Sabor auténtico en cada bocado</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ASSETS.products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative bg-zinc-900/50 rounded-3xl overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-500"
            >
              {product.badge && <Badge text={product.badge} />}
              
              <div className="aspect-[16/10] overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black tracking-tight">{product.name}</h3>
                  <span className="text-2xl font-black text-gold">{product.price}</span>
                </div>
                <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                  {product.description}
                </p>
                <WhatsAppButton text="PEDIR AHORA" className="w-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- PROMOS SECTION --- */}
      <section id="promos" className="relative min-h-screen w-full bg-black">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <img 
            src={ASSETS.mascotVideo} 
            alt="La Borileta Mascot" 
            className={`w-full h-full object-cover transition-all duration-1000 ${showPromos ? 'opacity-30 scale-110 blur-sm' : 'opacity-100 scale-100'}`}
          />
          <div className={`absolute inset-0 bg-black/40 transition-opacity duration-1000 ${showPromos ? 'opacity-80' : 'opacity-0'}`} />
          
          {!showPromos && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setShowPromos(true)}
                className="bg-gold text-black font-black py-4 px-12 rounded-full glow-gold-strong text-xl tracking-tighter"
              >
                VER PROMOS 🔥
              </motion.button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {showPromos && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-30 px-4 py-20 -mt-[50vh] max-w-3xl mx-auto"
            >
              <div className="bg-black/80 backdrop-blur-xl rounded-[40px] p-8 border border-gold/20 shadow-2xl">
                <h2 className="text-3xl font-black text-center mb-12 tracking-tighter">COMBOS <span className="text-gold">BORILETA</span></h2>
                
                <div className="space-y-6">
                  {ASSETS.promos.map((promo) => (
                    <motion.div 
                      key={promo.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-zinc-900/50 border border-white/5"
                    >
                      <img src={promo.image} alt={promo.name} className="w-32 h-32 object-cover rounded-xl" />
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-bold text-lg mb-1">{promo.name}</h4>
                        <p className="text-gold font-black text-xl mb-4">{promo.price}</p>
                        <WhatsAppButton text="PEDIR COMBO" className="py-2 px-6 text-xs sm:w-fit" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 text-center">
                  <button 
                    onClick={() => setShowPromos(false)}
                    className="text-zinc-500 text-xs uppercase tracking-widest hover:text-gold transition-colors"
                  >
                    Volver a ver mascota
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* --- LOCATION & REVIEWS SECTION --- */}
      <section id="location" className="py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">DÓNDE <span className="text-gold">ENCONTRARNOS</span></h2>
          <p className="text-zinc-400 text-sm uppercase tracking-widest">Vení a visitarnos y viví la experiencia Borileta</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 h-[400px] md:h-[500px] rounded-[40px] overflow-hidden border border-white/10 glow-gold/20 relative">
            {hasValidMapsKey ? (
              <APIProvider apiKey={GOOGLE_MAPS_API_KEY} version="weekly">
                <Map
                  defaultCenter={FOOD_TRUCK_LOCATION}
                  defaultZoom={15}
                  mapId="BORILETA_MAP_ID"
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  style={{ width: '100%', height: '100%' }}
                  disableDefaultUI={true}
                >
                  <AdvancedMarker position={FOOD_TRUCK_LOCATION}>
                    <div className="relative">
                      <div className="absolute -top-12 -left-6 bg-gold text-black px-3 py-1 rounded-lg font-black text-[10px] whitespace-nowrap glow-gold">
                        LA BORILETA AQUÍ
                      </div>
                      <Pin background="#D4AF37" glyphColor="#000" borderColor="#000" />
                    </div>
                  </AdvancedMarker>
                </Map>
              </APIProvider>
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <MapsSplashScreen />
              </div>
            )}
            
            <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4">
              <div className="bg-gold p-3 rounded-xl text-black">
                <MapPin size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Ubicación Actual</p>
                <p className="text-sm font-bold">Av. Corrientes & 9 de Julio, Buenos Aires</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gold/10 p-2 rounded-lg text-gold">
                <Quote size={20} />
              </div>
              <h3 className="text-xl font-black tracking-tight uppercase">Lo que dicen <br />nuestros clientes</h3>
            </div>
            
            {ASSETS.reviews.map((review) => (
              <div key={review.id}>
                <ReviewCard review={review} />
              </div>
            ))}

            <motion.a
              href="https://maps.google.com"
              target="_blank"
              className="block text-center py-4 border border-gold/30 rounded-xl text-gold text-xs font-bold uppercase tracking-widest hover:bg-gold/5 transition-all"
            >
              Ver todas las reseñas en Google
            </motion.a>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 px-6 text-center border-t border-white/5">
        <img src={ASSETS.logo} alt="Logo" className="h-16 mx-auto mb-8 opacity-50" />
        <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] mb-8">
          © 2024 LA BORILETA · PREMIUM STREET FOOD
        </p>
        <div className="flex justify-center gap-6 text-zinc-400">
          <a href="#" className="hover:text-gold transition-colors">Instagram</a>
          <a href="#" className="hover:text-gold transition-colors">Facebook</a>
          <a href="#" className="hover:text-gold transition-colors">TikTok</a>
        </div>
      </footer>

      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-6 right-6 z-50 md:hidden"
      >
        <motion.a
          href={WHATSAPP_URL}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-green-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center glow-gold"
        >
          <MessageCircle size={32} fill="currentColor" />
        </motion.a>
      </motion.div>

    </div>
  );
}
