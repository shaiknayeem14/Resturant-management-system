import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Utensils, 
  Calendar, 
  Sparkles, 
  Star, 
  Award, 
  Clock, 
  ArrowRight, 
  Flame, 
  ShieldCheck, 
  Wine, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { FoodCard } from '../components/FoodCard';
import { FoodModal } from '../components/FoodModal';

export const Home = () => {
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [foodsRes, catsRes] = await Promise.all([
          api.getFoodItems({ isFeatured: 'true', limit: 6 }),
          api.getCategories(),
        ]);
        if (foodsRes.success) setFeaturedFoods(foodsRes.foods || []);
        if (catsRes.success) setCategories(catsRes.categories || []);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div>
      {/* ================= HERO BANNER SECTION ================= */}
      <section
        style={{
          position: 'relative',
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(11,15,23,0.92) 0%, rgba(18,24,38,0.85) 100%), url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          padding: '4rem 0',
        }}
      >
        {/* Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(229,169,60,0.15) 0%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '780px' }}>
            {/* Top Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                background: 'rgba(229, 169, 60, 0.12)',
                border: '1px solid var(--border-gold)',
                borderRadius: '999px',
                marginBottom: '1.5rem',
              }}
            >
              <Sparkles size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Exquisite Fine Dining & Artisan Gastronomy
              </span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                lineHeight: 1.1,
                marginBottom: '1.5rem',
                color: '#fff',
              }}
            >
              Where Every Bite is a <span className="gold-text">Culinary Symphony</span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '1.15rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: '2.5rem',
                maxWidth: '640px',
              }}
            >
              Indulge in our Michelin-inspired creations, wood-fired artisanal pizzas, 45-day dry-aged steaks, and hand-crafted botanical elixirs prepared with pristine organic provenance.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <Link to="/menu" className="btn btn-primary btn-lg" id="hero-order-btn">
                <Utensils size={20} />
                <span>Explore Full Menu</span>
              </Link>
              <Link to="/table-booking" className="btn btn-secondary btn-lg" id="hero-book-btn">
                <Calendar size={20} />
                <span>Reserve a Table</span>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1.5rem',
                marginTop: '3.5rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
                  4.9 / 5.0
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Over 3,400+ Gourmet Reviews</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
                  35 Mins
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Average Gourmet Delivery</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
                  100% Organic
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Locally Farm-Sourced</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORY SHOWCASE ================= */}
      <section className="section-padding" style={{ backgroundColor: '#0e1422' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>Curated Selections</span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>Explore Our Culinary Universe</h2>
            <p style={{ color: 'var(--text-secondary)' }}>From hand-rolled pastas to flame-kissed dry-aged cuts, every category offers an unparalleled tasting journey.</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => navigate(`/menu?category=${cat.slug}`)}
                className="glass-card"
                style={{
                  position: 'relative',
                  height: '240px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.5rem',
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(11,15,23,0.1) 0%, rgba(11,15,23,0.92) 100%)',
                  }}
                />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '4px' }}>{cat.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>Browse Dishes</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CHEF'S SIGNATURE SPECIALS ================= */}
      <section className="section-padding">
        <div className="container">
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Master Chef Creations</span>
              <h2 style={{ fontSize: '2.4rem' }}>Signature Chef's Specials</h2>
            </div>
            <Link to="/menu" className="btn btn-secondary" style={{ borderRadius: '10px' }}>
              <span>View Full Menu</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--primary)' }}>Loading signature dishes...</div>
          ) : (
            <div className="grid-responsive">
              {featuredFoods.map((food) => (
                <FoodCard
                  key={food._id}
                  food={food}
                  onSelect={(item) => setSelectedFood(item)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= TABLE RESERVATION CTA CALLOUT ================= */}
      <section className="section-padding" style={{ backgroundColor: '#0e1422' }}>
        <div className="container">
          <div
            className="glass-card"
            style={{
              padding: '3.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
              border: '1px solid var(--border-gold)',
              background: 'linear-gradient(135deg, rgba(26,35,54,0.9) 0%, rgba(14,20,34,0.9) 100%)',
            }}
          >
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>Instant Confirmation</span>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>
                Reserve Your Table in Our <span className="gold-text">Grand Dining Halls</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                Whether celebrating an intimate romantic anniversary on our panoramic Rooftop Terrace or hosting a private VIP tasting session, our sommeliers and maître d' ensure an unforgettable evening.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#e2e8f0', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} color="var(--primary)" />
                  <span>Choose from Indoor Halls, Garden Patio, Skyline Rooftop, or VIP Lounges</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#e2e8f0', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} color="var(--primary)" />
                  <span>Complimentary sommelier pairing recommendations with reservations</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#e2e8f0', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} color="var(--primary)" />
                  <span>Instant reservation code & zero cancellation fees up to 2 hours prior</span>
                </div>
              </div>

              <Link to="/table-booking" className="btn btn-primary btn-lg" id="home-reserve-action">
                <Calendar size={20} />
                <span>Book a Table Now</span>
              </Link>
            </div>

            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                alt="Dining Room Experience"
                style={{
                  width: '100%',
                  height: '380px',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-lg)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '-20px',
                  background: '#131b2e',
                  border: '1px solid var(--border-gold)',
                  padding: '1.25rem',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0b0f17',
                  }}
                >
                  <Award size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>Voted Best Dining 2026</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>San Francisco Epicurean Guild</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Dish Detail Modal */}
      {selectedFood && (
        <FoodModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      )}
    </div>
  );
};
