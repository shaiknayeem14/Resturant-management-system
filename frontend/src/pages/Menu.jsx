import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Flame, 
  Sparkles, 
  ArrowUpDown, 
  X,
  UtensilsCrossed
} from 'lucide-react';
import { api } from '../services/api';
import { FoodCard } from '../components/FoodCard';
import { FoodModal } from '../components/FoodModal';
import { MagicBento } from '../components/MagicBento';

export const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedFood, setSelectedFood] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.getCategories();
        if (res.success) {
          setCategories(res.categories || []);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Update category from URL if changed
  useEffect(() => {
    const catFromUrl = searchParams.get('category');
    if (catFromUrl) {
      setSelectedCategory(catFromUrl);
    }
  }, [searchParams]);

  // Load foods whenever filter params change
  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      try {
        const params = {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery.trim() || undefined,
          dietary: selectedDietary !== 'all' ? selectedDietary : undefined,
          sort: sortBy,
        };

        const res = await api.getFoodItems(params);
        if (res.success) {
          setFoods(res.foods || []);
        }
      } catch (err) {
        console.error('Failed to load food items', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchFoods, 250);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, selectedDietary, sortBy]);

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: slug });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedDietary('all');
    setSortBy('rating');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  return (
    <div className="section-padding" style={{ minHeight: '80vh' }}>
      <div className="container">
        {/* Header Title */}
        <div className="text-center" style={{ maxWidth: '750px', margin: '0 auto 2.5rem auto' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>Haute Gastronomy</span>
          <h1 style={{ fontSize: '2.8rem', color: '#fff', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)', fontWeight: 800 }}>The Spicey House</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--primary-gold)', fontWeight: 600, marginBottom: '0.5rem' }}>Artisanal Menu</p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Each dish is passionately prepared with fresh, premium seasonal produce, heritage spices, and contemporary culinary artistry.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div
          className="glass-card"
          style={{
            padding: '1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Search Bar */}
            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="food-search-input"
                type="text"
                className="form-control"
                placeholder="Search by dish name, truffle, curry, biryani, steak, tikka..."
                style={{ paddingLeft: '40px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Dietary & Sorting Controls */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              {/* Dietary Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={16} color="var(--text-muted)" />
                <select
                  id="dietary-filter-select"
                  className="form-select"
                  style={{ width: 'auto', padding: '0.6rem 2rem 0.6rem 0.8rem', fontSize: '0.88rem' }}
                  value={selectedDietary}
                  onChange={(e) => setSelectedDietary(e.target.value)}
                >
                  <option value="all">All Dietary Types</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="gluten-free">Gluten-Free</option>
                  <option value="spicy">Spicy</option>
                  <option value="chef-special">Chef's Special</option>
                </select>
              </div>

              {/* Sorting */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowUpDown size={16} color="var(--text-muted)" />
                <select
                  id="sort-filter-select"
                  className="form-select"
                  style={{ width: 'auto', padding: '0.6rem 2rem 0.6rem 0.8rem', fontSize: '0.88rem' }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="rating">Top Rated (Default)</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills Bar */}
          <div
            style={{
              display: 'flex',
              gap: '0.6rem',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none',
            }}
          >
            <button
              id="category-pill-all"
              type="button"
              onClick={() => handleCategoryChange('all')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '999px',
                border: selectedCategory === 'all' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                background: selectedCategory === 'all' ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                color: selectedCategory === 'all' ? '#0b0f17' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'var(--transition)',
              }}
            >
              All Courses ({foods.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                id={`category-pill-${cat.slug}`}
                type="button"
                onClick={() => handleCategoryChange(cat.slug)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '999px',
                  border: selectedCategory === cat.slug ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: selectedCategory === cat.slug ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                  color: selectedCategory === cat.slug ? '#0b0f17' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items Grid or Empty State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--primary)' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Curating our dishes...</div>
          </div>
        ) : foods.length === 0 ? (
          <div
            className="glass-card text-center"
            style={{
              padding: '4rem 2rem',
              maxWidth: '500px',
              margin: '2rem auto',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                color: 'var(--text-muted)',
              }}
            >
              <UtensilsCrossed size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '0.5rem' }}>No Dishes Found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              We couldn't find any dishes matching your current search or filter criteria.
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
              Reset All Filters
            </button>
          </div>
        ) : (
          <MagicBento foods={foods} onSelectFood={(item) => setSelectedFood(item)} />
        )}
      </div>

      {/* Food Details Modal */}
      {selectedFood && (
        <FoodModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      )}
    </div>
  );
};
