import { useState } from 'react';
import { toast } from 'sonner';
import Header from '@/components/fartburger/Header';
import MenuGrid from '@/components/fartburger/MenuGrid';
import ItemDialog from '@/components/fartburger/ItemDialog';
import Footer from '@/components/fartburger/Footer';
import { MenuItem, CartItem, Category } from '@/components/fartburger/types';
import { menuData } from '@/components/fartburger/menuData';

const Index = () => {
  const [balance, setBalance] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [customization, setCustomization] = useState<{
    selectedOptions: Record<string, string>;
    removedIngredients: string[];
    addedIngredients: Record<string, number>;
  }>({
    selectedOptions: {},
    removedIngredients: [],
    addedIngredients: {},
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'balance' | 'cash'>('balance');
  const [tipAmount, setTipAmount] = useState('');
  const [adminLogin, setAdminLogin] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');

  const categories: Category[] = [
    { id: 'all', label: 'Всё меню', icon: 'Grid' },
    { id: 'burgers', label: 'Бургеры', icon: 'Beef' },
    { id: 'snacks', label: 'Снеки', icon: 'Cookie' },
    { id: 'desserts', label: 'Десерты', icon: 'IceCream' },
    { id: 'drinks', label: 'Напитки', icon: 'Coffee' },
    { id: 'special', label: 'Особое', icon: 'Star' },
  ];

  const filteredMenu =
    selectedCategory === 'all'
      ? menuData
      : menuData.filter((item) => item.category === selectedCategory);

  const handleTopUp = (amount?: number) => {
    const value = amount || parseInt(topUpAmount);
    if (value > 0) {
      setBalance(balance + value);
      setTopUpAmount('');
      toast.success(`Баланс пополнен на ${value}₽`);
    }
  };

  const calculateItemPrice = (item: MenuItem | CartItem, options?: Record<string, string>, addedIngredients?: Record<string, number>) => {
    let price = item.price;
    
    if (item.options && options) {
      item.options.forEach((optionGroup) => {
        const selected = options[optionGroup.type];
        if (selected) {
          const choice = optionGroup.choices.find((c) => c.label === selected);
          if (choice) {
            price = choice.price;
          }
        }
      });
    }

    if (addedIngredients) {
      Object.entries(addedIngredients).forEach(([ingredient, count]) => {
        price += count * 30;
      });
    }

    return price;
  };

  const addToCart = () => {
    if (!selectedItem) return;

    const price = calculateItemPrice(selectedItem, customization.selectedOptions, customization.addedIngredients);

    const existingItemIndex = cart.findIndex(
      (item) =>
        item.id === selectedItem.id &&
        JSON.stringify(item.selectedOptions) === JSON.stringify(customization.selectedOptions) &&
        JSON.stringify(item.removedIngredients) === JSON.stringify(customization.removedIngredients) &&
        JSON.stringify(item.addedIngredients) === JSON.stringify(customization.addedIngredients)
    );

    if (existingItemIndex >= 0) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([
        ...cart,
        {
          ...selectedItem,
          quantity: 1,
          selectedOptions: customization.selectedOptions,
          removedIngredients: customization.removedIngredients,
          addedIngredients: customization.addedIngredients,
          price,
        },
      ]);
    }

    toast.success('Добавлено в корзину');
    setSelectedItem(null);
    setCustomization({ selectedOptions: {}, removedIngredients: [], addedIngredients: {} });
  };

  const openItemDialog = (item: MenuItem) => {
    setSelectedItem(item);
    const defaultOptions: Record<string, string> = {};
    item.options?.forEach((optionGroup) => {
      defaultOptions[optionGroup.type] = optionGroup.choices[0].label;
    });
    setCustomization({ selectedOptions: defaultOptions, removedIngredients: [], addedIngredients: {} });
  };

  const toggleIngredient = (ingredient: string) => {
    setCustomization((prev) => ({
      ...prev,
      removedIngredients: prev.removedIngredients.includes(ingredient)
        ? prev.removedIngredients.filter((i) => i !== ingredient)
        : [...prev.removedIngredients, ingredient],
    }));
  };

  const addIngredient = (ingredient: string) => {
    setCustomization((prev) => {
      const current = prev.addedIngredients[ingredient] || 0;
      if (current >= 3) return prev;
      return {
        ...prev,
        addedIngredients: { ...prev.addedIngredients, [ingredient]: current + 1 },
      };
    });
  };

  const removeIngredient = (ingredient: string) => {
    setCustomization((prev) => {
      const current = prev.addedIngredients[ingredient] || 0;
      if (current <= 0) return prev;
      const newAdded = { ...prev.addedIngredients };
      if (current === 1) {
        delete newAdded[ingredient];
      } else {
        newAdded[ingredient] = current - 1;
      }
      return { ...prev, addedIngredients: newAdded };
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!deliveryAddress.match(/\d+/)) {
      toast.error('Укажите корректный адрес с номером дома');
      return;
    }

    const tip = parseInt(tipAmount) || 0;
    const total = cartTotal + tip;

    if (paymentMethod === 'balance' && balance < total) {
      toast.error('Недостаточно средств на балансе');
      return;
    }

    if (paymentMethod === 'balance') {
      setBalance(balance - total);
    }

    toast.success(`Заказ оформлен! Сумма: ${total}₽`);
    setCart([]);
    setDeliveryAddress('');
    setPromoCode('');
    setTipAmount('');
    setCartOpen(false);
  };

  const handleAdminLogin = () => {
    if (adminLogin === 'XeX' && adminPassword === '18181818') {
      setIsAdmin(true);
      toast.success('Вход выполнен');
    } else {
      toast.error('Неверный логин или пароль');
    }
  };

  const handleSupportMessage = () => {
    if (supportMessage.trim()) {
      toast.success('Сообщение отправлено в поддержку');
      setSupportMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header
        balance={balance}
        cart={cart}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        topUpAmount={topUpAmount}
        setTopUpAmount={setTopUpAmount}
        handleTopUp={handleTopUp}
        deliveryAddress={deliveryAddress}
        setDeliveryAddress={setDeliveryAddress}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        tipAmount={tipAmount}
        setTipAmount={setTipAmount}
        cartTotal={cartTotal}
        handleCheckout={handleCheckout}
      />

      <main className="container mx-auto px-4 py-8">
        <MenuGrid
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          filteredMenu={filteredMenu}
          openItemDialog={openItemDialog}
        />
      </main>

      <ItemDialog
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        customization={customization}
        setCustomization={setCustomization}
        toggleIngredient={toggleIngredient}
        addIngredient={addIngredient}
        removeIngredient={removeIngredient}
        calculateItemPrice={calculateItemPrice}
        addToCart={addToCart}
      />

      <Footer
        supportMessage={supportMessage}
        setSupportMessage={setSupportMessage}
        handleSupportMessage={handleSupportMessage}
        adminLogin={adminLogin}
        setAdminLogin={setAdminLogin}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
        isAdmin={isAdmin}
        handleAdminLogin={handleAdminLogin}
      />
    </div>
  );
};

export default Index;
