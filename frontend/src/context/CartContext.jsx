import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('bistro_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'dine_in' | 'pickup'
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: '',
  });
  const [tableNumber, setTableNumber] = useState('');
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('bistro_cart', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (foodItem, quantity = 1, instructions = '') => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.foodItemId === foodItem._id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          instructions: instructions || updated[existingIndex].instructions,
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            foodItemId: foodItem._id,
            name: foodItem.name,
            price: foodItem.price,
            image: foodItem.image,
            dietary: foodItem.dietary,
            categoryName: foodItem.categoryName || foodItem.category?.name || '',
            quantity,
            instructions,
          },
        ];
      }
    });
  };

  const updateQuantity = (foodItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodItemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.foodItemId === foodItemId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (foodItemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.foodItemId !== foodItemId));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  // Calculations
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const tax = useMemo(() => {
    return Number((subtotal * 0.08).toFixed(2));
  }, [subtotal]);

  const deliveryFee = useMemo(() => {
    if (orderType !== 'delivery' || subtotal === 0) return 0;
    return subtotal >= 50 ? 0 : 4.99;
  }, [orderType, subtotal]);

  const discountAmount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.type === 'percent') {
      return Number(((subtotal * coupon.value) / 100).toFixed(2));
    }
    return coupon.value;
  }, [coupon, subtotal]);

  const total = useMemo(() => {
    const calculated = subtotal + tax + deliveryFee - discountAmount;
    return Math.max(0, Number(calculated.toFixed(2)));
  }, [subtotal, tax, deliveryFee, discountAmount]);

  const totalItemsCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const applyCoupon = (code) => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'BISTRO10') {
      setCoupon({ code: 'BISTRO10', value: 10, type: 'percent', label: '10% Welcome Discount' });
      return { success: true, message: '10% discount applied!' };
    }
    if (formatted === 'CHEF20') {
      setCoupon({ code: 'CHEF20', value: 20, type: 'percent', label: '20% Gourmet Special' });
      return { success: true, message: '20% Chef special discount applied!' };
    }
    return { success: false, message: 'Invalid or expired coupon code' };
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        tax,
        deliveryFee,
        discountAmount,
        total,
        totalItemsCount,
        orderType,
        setOrderType,
        deliveryAddress,
        setDeliveryAddress,
        tableNumber,
        setTableNumber,
        isDrawerOpen,
        setIsDrawerOpen,
        coupon,
        applyCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
