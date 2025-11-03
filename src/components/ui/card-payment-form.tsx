import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface CardPaymentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
  amount: string;
}

export const CardPaymentForm = ({ open, onClose, onSuccess, amount }: CardPaymentFormProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace('/', '').length <= 4) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const validateForm = () => {
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    const cleanExpiryDate = expiryDate.replace('/', '');
    
    if (cleanCardNumber.length !== 16 || !cleanCardNumber.startsWith('2202')) {
      return 'Номер карты должен начинаться с 2202 и содержать 16 цифр';
    }

    if (cleanExpiryDate.length !== 4) {
      return 'Введите срок действия в формате ММ/ГГ';
    }

    const month = parseInt(cleanExpiryDate.slice(0, 2));
    if (month < 1 || month > 12) {
      return 'Месяц должен быть от 01 до 12';
    }

    if (cvv.length !== 3) {
      return 'CVV должен содержать 3 цифры';
    }

    return null;
  };

  const handleSubmit = () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    const value = parseInt(amount);
    if (value > 0) {
      onSuccess(value);
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle className="text-[#d4af37]">Данные карты для пополнения</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-gray-300">Номер карты</Label>
            <Input
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="2202 XXXX XXXX XXXX"
              className="bg-[#0a0a0a] border-[#2a2a2a] text-white mt-1 font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Срок действия</Label>
              <Input
                value={expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="ММ/ГГ"
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white mt-1 font-mono"
              />
            </div>
            <div>
              <Label className="text-gray-300">CVV код</Label>
              <Input
                value={cvv}
                onChange={handleCvvChange}
                placeholder="XXX"
                type="password"
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white mt-1 font-mono"
              />
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#d4af37] text-black hover:bg-[#c4a037]"
          >
            Пополнить на {amount}₽
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
