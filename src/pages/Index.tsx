import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  ingredients: string[];
  protein: number;
  fat: number;
  carbs: number;
  options?: {
    type: string;
    choices: { label: string; price: number }[];
  }[];
  imageUrl: string;
}

interface CartItem extends MenuItem {
  quantity: number;
  selectedOptions: Record<string, string>;
  removedIngredients: string[];
  addedIngredients: Record<string, number>;
}

const menuData: MenuItem[] = [
  {
    id: 'hamburger',
    name: 'Гамбургер',
    price: 89,
    category: 'burgers',
    description: 'Классический бургер с сочной котлетой и фирменным соусом. Идеально для быстрого перекуса.',
    ingredients: ['Две булочки', 'Котлета говяжья', 'Соус классический'],
    protein: 15,
    fat: 12,
    carbs: 32,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
  },
  {
    id: 'cheeseburger',
    name: 'Чизбургер',
    price: 109,
    category: 'burgers',
    description: 'Гамбургер с добавлением нежного сыра. Насыщенный вкус для настоящих любителей сыра.',
    ingredients: ['Две булочки', 'Котлета говяжья', 'Соус классический', 'Один ломтик сыра'],
    protein: 18,
    fat: 15,
    carbs: 33,
    imageUrl: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400',
  },
  {
    id: 'chickenburger',
    name: 'Чикенбургер',
    price: 119,
    category: 'burgers',
    description: 'Бургер с хрустящей куриной котлетой и свежим листом салата. Легкий и сочный вариант.',
    ingredients: ['Две булочки', 'Котлета куриная', 'Соус классический', 'Лист салата'],
    protein: 20,
    fat: 10,
    carbs: 35,
    imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400',
  },
  {
    id: 'fartburger',
    name: 'Фартбургер',
    price: 199,
    category: 'burgers',
    description: 'Наш фирменный бургер! Сочная котлета, свежие овощи и секретный соус делают его незабываемым.',
    ingredients: ['Две булочки', 'Котлета говяжья', 'Соус классический', 'Лист салата', 'Три кусочка огурчика', 'Два ломтика помидора'],
    protein: 22,
    fat: 18,
    carbs: 38,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
  },
  {
    id: 'fartburger-chicken',
    name: 'Фартбургер куриный',
    price: 199,
    category: 'burgers',
    description: 'Легкая версия фирменного бургера с куриной котлетой. Все та же свежесть и вкус!',
    ingredients: ['Две булочки', 'Котлета куриная', 'Соус классический', 'Лист салата', 'Три кусочка огурчика', 'Два ломтика помидора'],
    protein: 25,
    fat: 12,
    carbs: 40,
    imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400',
  },
  {
    id: 'fries',
    name: 'Картофель фри',
    price: 99,
    category: 'snacks',
    description: 'Хрустящая золотистая картошка, жаренная во фритюре до идеального состояния.',
    ingredients: ['Картошка жареная во фритюре'],
    protein: 3,
    fat: 15,
    carbs: 35,
    options: [
      {
        type: 'size',
        choices: [
          { label: 'Маленькая', price: 99 },
          { label: 'Средняя', price: 139 },
          { label: 'Большая', price: 199 },
          { label: 'Огромная', price: 299 },
        ],
      },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
  },
  {
    id: 'nuggets',
    name: 'Наггетсы',
    price: 99,
    category: 'snacks',
    description: 'Нежное куриное филе в хрустящей панировке. Отличная закуска для любого случая.',
    ingredients: ['Куриное филе'],
    protein: 18,
    fat: 12,
    carbs: 20,
    options: [
      {
        type: 'count',
        choices: [
          { label: '3шт', price: 99 },
          { label: '6шт', price: 179 },
          { label: '9шт', price: 249 },
          { label: '20шт', price: 479 },
        ],
      },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
  },
  {
    id: 'pancakes',
    name: 'Блины',
    price: 99,
    category: 'desserts',
    description: 'Традиционные блины с неожиданной изюминкой. Нежные, тающие во рту.',
    ingredients: ['Самые обычные блины с изюминкой'],
    protein: 8,
    fat: 10,
    carbs: 45,
    options: [
      {
        type: 'filling',
        choices: [
          { label: 'С шоколадом', price: 0 },
          { label: 'С маслом', price: 0 },
          { label: 'С ветчиной и сыром', price: 0 },
        ],
      },
      {
        type: 'count',
        choices: [
          { label: '1шт', price: 99 },
          { label: '3шт', price: 259 },
          { label: '5шт', price: 399 },
        ],
      },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400',
  },
  {
    id: 'icecream',
    name: 'Мороженое',
    price: 119,
    category: 'desserts',
    description: 'Натуральное мороженое высшего качества. Освежающий десерт на любой вкус.',
    ingredients: ['Самое обычное мороженое'],
    protein: 4,
    fat: 8,
    carbs: 25,
    options: [
      {
        type: 'flavor',
        choices: [
          { label: 'Малиновое', price: 139 },
          { label: 'Шоколадное', price: 149 },
          { label: 'Пломбир', price: 129 },
          { label: 'С орехами', price: 119 },
        ],
      },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
  },
  {
    id: 'milkshake',
    name: 'МилкШейк',
    price: 129,
    category: 'desserts',
    description: 'Густой охлажденный коктейль из молока и мороженого. Идеальное дополнение к еде.',
    ingredients: ['холодный и густой коктейль из молока и мороженого'],
    protein: 6,
    fat: 12,
    carbs: 35,
    options: [
      {
        type: 'flavor',
        choices: [
          { label: 'Малиновый', price: 139 },
          { label: 'Шоколадный', price: 159 },
          { label: 'Пломбир', price: 129 },
        ],
      },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
  },
  {
    id: 'coffee',
    name: 'Кофе',
    price: 99,
    category: 'drinks',
    description: 'Ароматный кофе из свежеобжаренных зерен. Бодрящий напиток для продуктивного дня.',
    ingredients: ['Состав зависит от вида кофе'],
    protein: 2,
    fat: 3,
    carbs: 5,
    options: [
      {
        type: 'type',
        choices: [
          { label: 'Латте', price: 0 },
          { label: 'Эспрессо', price: 0 },
          { label: 'Американо', price: 0 },
          { label: 'Флет Уайт', price: 0 },
          { label: 'Горячий шоколад', price: 0 },
          { label: 'Какао', price: 0 },
          { label: 'Раф', price: 0 },
          { label: 'Мокко', price: 0 },
        ],
      },
      {
        type: 'size',
        choices: [
          { label: 'Маленький', price: 99 },
          { label: 'Средний', price: 139 },
          { label: 'Большой', price: 179 },
        ],
      },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
  },
  {
    id: 'tea',
    name: 'Чай',
    price: 99,
    category: 'drinks',
    description: 'Отборный рассыпной чай высшего сорта. Традиционный напиток для души и тела.',
    ingredients: ['Чай рассыпной'],
    protein: 0,
    fat: 0,
    carbs: 2,
    options: [
      {
        type: 'type',
        choices: [
          { label: 'Зелёный', price: 0 },
          { label: 'Чёрный', price: 0 },
        ],
      },
      {
        type: 'size',
        choices: [
          { label: 'Маленький', price: 99 },
          { label: 'Средний', price: 129 },
          { label: 'Большой', price: 159 },
        ],
      },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
  },
  {
    id: 'cola',
    name: 'Кока кола',
    price: 79,
    category: 'drinks',
    description: 'Оригинальная Coca-Cola с неповторимым вкусом. Освежает и бодрит в любое время.',
    ingredients: ['Оригинальная Кока кола'],
    protein: 0,
    fat: 0,
    carbs: 42,
    options: [
      {
        type: 'volume',
        choices: [
          { label: '0.5л', price: 79 },
          { label: '0.8л', price: 99 },
          { label: '1.0л', price: 119 },
        ],
      },
      {
        type: 'container',
        choices: [
          { label: 'В стакане', price: 0 },
          { label: 'В пластиковой бутылке', price: 0 },
          { label: 'В стеклянной бутылке', price: 10 },
        ],
      },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
  },
  {
    id: 'juice',
    name: 'Сок',
    price: 99,
    category: 'drinks',
    description: 'Свежевыжатый сок из натуральных фруктов. Витамины и польза в каждом глотке.',
    ingredients: ['Свежевыжатый сок'],
    protein: 1,
    fat: 0,
    carbs: 25,
    options: [
      {
        type: 'volume',
        choices: [
          { label: '0.5л', price: 99 },
          { label: '0.8л', price: 149 },
          { label: '1.0л', price: 189 },
        ],
      },
      {
        type: 'container',
        choices: [
          { label: 'В стакане', price: 0 },
          { label: 'В картонной коробке', price: 0 },
          { label: 'В стеклянной бутылке', price: 10 },
        ],
      },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
  },
  {
    id: 'water',
    name: 'Вода',
    price: 49,
    category: 'drinks',
    description: 'Чистая питьевая вода высшего качества. Основа здоровья и жизни.',
    ingredients: ['Питьевая вода'],
    protein: 0,
    fat: 0,
    carbs: 0,
    options: [
      {
        type: 'volume',
        choices: [
          { label: '0.5л', price: 49 },
          { label: '0.8л', price: 69 },
          { label: '1.0л', price: 89 },
        ],
      },
      {
        type: 'container',
        choices: [
          { label: 'В стакане', price: 0 },
          { label: 'В пластиковой бутылке', price: 0 },
          { label: 'В стеклянной бутылке', price: 10 },
        ],
      },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
  },
  {
    id: 'mashed-potatoes',
    name: 'Пюре с котлетой',
    price: 159,
    category: 'special',
    description: 'Домашнее нежное пюре с сочной котлетой. Комфортная еда, как дома.',
    ingredients: ['Домашнее вкусное пюре с котлетой'],
    protein: 18,
    fat: 15,
    carbs: 42,
    imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400',
  },
];

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

  const categories = [
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
      <header className="sticky top-0 z-50 border-b border-[#2a2a2a] bg-[#0a0a0a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0a0a]/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🍔</div>
              <h1 className="text-2xl font-bold text-[#d4af37]">FartBurger</h1>
            </div>

            <div className="flex items-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all"
                  >
                    <Icon name="Wallet" className="mr-2" size={18} />
                    <span className="hover:text-inherit transition-colors">{balance}₽</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                  <DialogHeader>
                    <DialogTitle className="text-[#d4af37]">Пополнение баланса</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <Button onClick={() => handleTopUp(100)} variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black">
                        +100₽
                      </Button>
                      <Button onClick={() => handleTopUp(500)} variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black">
                        +500₽
                      </Button>
                      <Button onClick={() => handleTopUp(1000)} variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black">
                        +1000₽
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Введите сумму"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
                      />
                      <Button onClick={() => handleTopUp()} className="bg-[#d4af37] text-black hover:bg-[#c4a037]">
                        Пополнить
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                <SheetTrigger asChild>
                  <Button className="bg-[#d4af37] text-black hover:bg-[#c4a037] relative">
                    <Icon name="ShoppingCart" className="mr-2" size={18} />
                    Корзина
                    {cart.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-[#1a1a1a] border-[#2a2a2a] w-full sm:max-w-lg overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="text-[#d4af37]">Корзина</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">Корзина пуста</p>
                    ) : (
                      <>
                        {cart.map((item, index) => (
                          <Card key={index} className="bg-[#0a0a0a] border-[#2a2a2a] p-4">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-semibold text-white">{item.name}</h3>
                                {Object.entries(item.selectedOptions).length > 0 && (
                                  <p className="text-sm text-gray-400">
                                    {Object.values(item.selectedOptions).join(', ')}
                                  </p>
                                )}
                                {item.removedIngredients.length > 0 && (
                                  <p className="text-xs text-red-400">
                                    Без: {item.removedIngredients.join(', ')}
                                  </p>
                                )}
                                {Object.keys(item.addedIngredients).length > 0 && (
                                  <p className="text-xs text-green-400">
                                    Добавлено: {Object.entries(item.addedIngredients).map(([ing, count]) => `${ing} x${count}`).join(', ')}
                                  </p>
                                )}
                                <p className="text-sm text-gray-500">Количество: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-[#d4af37]">{item.price * item.quantity}₽</p>
                              </div>
                            </div>
                          </Card>
                        ))}

                        <div className="space-y-3 pt-4 border-t border-[#2a2a2a]">
                          <div>
                            <Label className="text-gray-300">Адрес доставки</Label>
                            <Input
                              placeholder="ул. Примерная, д. 123"
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              className="bg-[#0a0a0a] border-[#2a2a2a] text-white mt-1"
                            />
                          </div>

                          <div>
                            <Label className="text-gray-300">Промокод</Label>
                            <Input
                              placeholder="Введите промокод"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              className="bg-[#0a0a0a] border-[#2a2a2a] text-white mt-1"
                            />
                          </div>

                          <div>
                            <Label className="text-gray-300">Способ оплаты</Label>
                            <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'balance' | 'cash')} className="mt-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="balance" id="balance" />
                                <Label htmlFor="balance" className="text-white">С баланса</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="cash" id="cash" />
                                <Label htmlFor="cash" className="text-white">Наличными курьеру</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-gray-300">Чаевые курьеру</Label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={tipAmount}
                              onChange={(e) => setTipAmount(e.target.value)}
                              className="bg-[#0a0a0a] border-[#2a2a2a] text-white mt-1"
                            />
                          </div>

                          <div className="pt-4 space-y-2">
                            <div className="flex justify-between text-lg">
                              <span className="text-white">Итого:</span>
                              <span className="font-bold text-[#d4af37]">
                                {cartTotal + (parseInt(tipAmount) || 0)}₽
                              </span>
                            </div>
                            <Button
                              onClick={handleCheckout}
                              className="w-full bg-[#d4af37] text-black hover:bg-[#c4a037] text-lg py-6"
                            >
                              Оформить заказ
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto bg-[#1a1a1a] border border-[#2a2a2a] mb-8">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-black flex items-center gap-2"
              >
                <Icon name={cat.icon as any} size={18} />
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMenu.map((item) => (
                <Card
                  key={item.id}
                  className="bg-[#1a1a1a] border-[#2a2a2a] overflow-hidden hover:border-[#d4af37] transition-all duration-300 cursor-pointer group"
                  onClick={() => openItemDialog(item)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#d4af37]">{item.price}₽</span>
                      <Button
                        size="sm"
                        className="bg-[#d4af37] text-black hover:bg-[#c4a037]"
                        onClick={(e) => {
                          e.stopPropagation();
                          openItemDialog(item);
                        }}
                      >
                        <Icon name="Plus" size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="bg-[#1a1a1a] border-[#2a2a2a] max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-[#d4af37]">{selectedItem.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="w-full h-64 object-cover rounded-lg"
                />

                <div>
                  <p className="text-gray-300 mb-4">{selectedItem.description}</p>
                  <div className="flex gap-4 text-sm">
                    <div className="bg-[#0a0a0a] px-3 py-2 rounded">
                      <span className="text-gray-400">Б:</span>{' '}
                      <span className="text-white font-semibold">{selectedItem.protein}г</span>
                    </div>
                    <div className="bg-[#0a0a0a] px-3 py-2 rounded">
                      <span className="text-gray-400">Ж:</span>{' '}
                      <span className="text-white font-semibold">{selectedItem.fat}г</span>
                    </div>
                    <div className="bg-[#0a0a0a] px-3 py-2 rounded">
                      <span className="text-gray-400">У:</span>{' '}
                      <span className="text-white font-semibold">{selectedItem.carbs}г</span>
                    </div>
                  </div>
                </div>

                {selectedItem.options && selectedItem.options.length > 0 && (
                  <div className="space-y-4">
                    {selectedItem.options.map((optionGroup) => (
                      <div key={optionGroup.type}>
                        <Label className="text-gray-300 capitalize mb-2 block">
                          {optionGroup.type === 'size' && 'Размер'}
                          {optionGroup.type === 'type' && 'Тип'}
                          {optionGroup.type === 'flavor' && 'Вкус'}
                          {optionGroup.type === 'count' && 'Количество'}
                          {optionGroup.type === 'volume' && 'Объём'}
                          {optionGroup.type === 'container' && 'Тара'}
                          {optionGroup.type === 'filling' && 'Начинка'}
                        </Label>
                        <RadioGroup
                          value={customization.selectedOptions[optionGroup.type]}
                          onValueChange={(value) =>
                            setCustomization((prev) => ({
                              ...prev,
                              selectedOptions: { ...prev.selectedOptions, [optionGroup.type]: value },
                            }))
                          }
                        >
                          {optionGroup.choices.map((choice) => (
                            <div key={choice.label} className="flex items-center space-x-2">
                              <RadioGroupItem value={choice.label} id={choice.label} />
                              <Label htmlFor={choice.label} className="text-white flex-1 cursor-pointer">
                                {choice.label}
                                {choice.price > 0 && (
                                  <span className="text-[#d4af37] ml-2">{choice.price}₽</span>
                                )}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <Label className="text-gray-300 mb-2 block">Состав (можно убрать)</Label>
                  <div className="space-y-2">
                    {selectedItem.ingredients.map((ingredient) => (
                      <div key={ingredient} className="flex items-center space-x-2">
                        <Checkbox
                          id={ingredient}
                          checked={!customization.removedIngredients.includes(ingredient)}
                          onCheckedChange={() => toggleIngredient(ingredient)}
                        />
                        <Label htmlFor={ingredient} className="text-white cursor-pointer flex-1">
                          {ingredient}
                        </Label>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0 border-[#d4af37] text-[#d4af37]"
                            onClick={() => removeIngredient(ingredient)}
                          >
                            -
                          </Button>
                          <span className="text-white w-4 text-center">
                            {customization.addedIngredients[ingredient] || 0}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0 border-[#d4af37] text-[#d4af37]"
                            onClick={() => addIngredient(ingredient)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {Object.keys(customization.addedIngredients).length > 0 && (
                    <p className="text-xs text-gray-400 mt-2">
                      +{Object.values(customization.addedIngredients).reduce((a, b) => a + b, 0) * 30}₽ за доп. ингредиенты
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
                  <div className="text-3xl font-bold text-[#d4af37]">
                    {calculateItemPrice(selectedItem, customization.selectedOptions, customization.addedIngredients)}₽
                  </div>
                  <Button
                    onClick={addToCart}
                    className="bg-[#d4af37] text-black hover:bg-[#c4a037] text-lg px-8 py-6"
                  >
                    <Icon name="ShoppingCart" className="mr-2" size={20} />
                    В корзину
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <footer className="border-t border-[#2a2a2a] mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-[#d4af37] text-[#d4af37]">
                    <Icon name="MessageCircle" className="mr-2" size={18} />
                    Поддержка
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                  <DialogHeader>
                    <DialogTitle className="text-[#d4af37]">Техподдержка</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Опишите вашу проблему..."
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-white min-h-[120px]"
                    />
                    <Button
                      onClick={handleSupportMessage}
                      className="w-full bg-[#d4af37] text-black hover:bg-[#c4a037]"
                    >
                      Отправить
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-gray-500 hover:text-[#d4af37]">
                    <Icon name="Lock" className="mr-2" size={18} />
                    Админ
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                  <DialogHeader>
                    <DialogTitle className="text-[#d4af37]">Вход администратора</DialogTitle>
                  </DialogHeader>
                  {!isAdmin ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-300">Логин</Label>
                        <Input
                          value={adminLogin}
                          onChange={(e) => setAdminLogin(e.target.value)}
                          className="bg-[#0a0a0a] border-[#2a2a2a] text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Пароль</Label>
                        <Input
                          type="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="bg-[#0a0a0a] border-[#2a2a2a] text-white mt-1"
                        />
                      </div>
                      <Button
                        onClick={handleAdminLogin}
                        className="w-full bg-[#d4af37] text-black hover:bg-[#c4a037]"
                      >
                        Войти
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-green-400 mb-4">Вы вошли как администратор</p>
                      <p className="text-gray-400 text-sm">
                        Для полноценной админ-панели потребуется отдельная страница
                      </p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <p className="text-gray-500 text-sm">© 2024 FartBurger. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
