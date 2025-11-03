import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import { CartItem } from './types';
import { CardPaymentForm } from '@/components/ui/card-payment-form';

const PROMO_API_URL = 'https://functions.poehali.dev/80d8017d-9b41-4d04-aac4-f57f07d23ee9';

interface HeaderProps {
  balance: number;
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  topUpAmount: string;
  setTopUpAmount: (amount: string) => void;
  handleTopUp: (amount?: number) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  paymentMethod: 'balance' | 'cash';
  setPaymentMethod: (method: 'balance' | 'cash') => void;
  tipAmount: string;
  setTipAmount: (amount: string) => void;
  cartTotal: number;
  handleCheckout: () => void;
  discount: number;
  setDiscount: (discount: number) => void;
}

const Header = ({
  balance,
  cart,
  cartOpen,
  setCartOpen,
  topUpAmount,
  setTopUpAmount,
  handleTopUp,
  deliveryAddress,
  setDeliveryAddress,
  promoCode,
  setPromoCode,
  paymentMethod,
  setPaymentMethod,
  tipAmount,
  setTipAmount,
  cartTotal,
  handleCheckout,
  discount,
  setDiscount,
}: HeaderProps) => {
  const [cardFormOpen, setCardFormOpen] = useState(false);
  const [pendingAmount, setPendingAmount] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const handleQuickTopUp = (amount: number) => {
    setPendingAmount(amount.toString());
    setCardFormOpen(true);
  };

  const handleCustomTopUp = () => {
    if (topUpAmount && parseInt(topUpAmount) > 0) {
      setPendingAmount(topUpAmount);
      setCardFormOpen(true);
    }
  };

  const handleCardPaymentSuccess = (amount: number) => {
    handleTopUp(amount);
    setTopUpAmount('');
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error('Введите промокод');
      return;
    }

    try {
      const response = await fetch(`${PROMO_API_URL}?code=${encodeURIComponent(promoCode)}`);
      const data = await response.json();

      if (data.valid) {
        setDiscount(data.discount_percent);
        setPromoApplied(true);
        toast.success(`Промокод применён! Скидка ${data.discount_percent}%`);
      } else {
        toast.error(data.error || 'Промокод не найден');
        setDiscount(0);
        setPromoApplied(false);
      }
    } catch (error) {
      toast.error('Ошибка при проверке промокода');
      console.error('Promo code error:', error);
    }
  };

  const discountedTotal = cartTotal - Math.round(cartTotal * discount / 100);
  const finalTotal = discountedTotal + (parseInt(tipAmount) || 0);

  return (
    <>
      <CardPaymentForm
        open={cardFormOpen}
        onClose={() => setCardFormOpen(false)}
        onSuccess={handleCardPaymentSuccess}
        amount={pendingAmount}
      />
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
                    <Button onClick={() => handleQuickTopUp(100)} variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black">
                      +100₽
                    </Button>
                    <Button onClick={() => handleQuickTopUp(500)} variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black">
                      +500₽
                    </Button>
                    <Button onClick={() => handleQuickTopUp(1000)} variant="outline" className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black">
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
                    <Button onClick={handleCustomTopUp} className="bg-[#d4af37] text-black hover:bg-[#c4a037]">
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
                          <div className="flex gap-2 mt-1">
                            <Input
                              placeholder="Введите промокод"
                              value={promoCode}
                              onChange={(e) => {
                                setPromoCode(e.target.value);
                                setPromoApplied(false);
                                setDiscount(0);
                              }}
                              className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
                            />
                            <Button
                              onClick={handleApplyPromo}
                              variant="outline"
                              className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black"
                              disabled={promoApplied}
                            >
                              {promoApplied ? '✓' : 'Применить'}
                            </Button>
                          </div>
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
                          {discount > 0 && (
                            <div className="flex justify-between text-sm text-gray-400">
                              <span>Сумма заказа:</span>
                              <span>{cartTotal}₽</span>
                            </div>
                          )}
                          {discount > 0 && (
                            <div className="flex justify-between text-sm text-green-400">
                              <span>Скидка ({discount}%):</span>
                              <span>-{Math.round(cartTotal * discount / 100)}₽</span>
                            </div>
                          )}
                          {parseInt(tipAmount) > 0 && (
                            <div className="flex justify-between text-sm text-gray-400">
                              <span>Чаевые:</span>
                              <span>+{tipAmount}₽</span>
                            </div>
                          )}
                          <div className="flex justify-between text-lg border-t border-[#2a2a2a] pt-2">
                            <span className="text-white">Итого:</span>
                            <span className="font-bold text-[#d4af37]">
                              {finalTotal}₽
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
    </>
  );
};

export default Header;