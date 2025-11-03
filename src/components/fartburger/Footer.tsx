import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

const SUPPORT_API_URL = 'https://functions.poehali.dev/a18e01da-bb75-405c-82b6-c91fd6bd9f01';

interface FooterProps {
  supportMessage: string;
  setSupportMessage: (message: string) => void;
  handleSupportMessage: () => void;
  adminLogin: string;
  setAdminLogin: (login: string) => void;
  adminPassword: string;
  setAdminPassword: (password: string) => void;
  isAdmin: boolean;
  handleAdminLogin: () => void;
}

const Footer = ({
  supportMessage,
  setSupportMessage,
  handleSupportMessage,
  adminLogin,
  setAdminLogin,
  adminPassword,
  setAdminPassword,
  isAdmin,
  handleAdminLogin,
}: FooterProps) => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAdminClick = () => {
    if (adminLogin === 'XeX' && adminPassword === '18181818') {
      navigate('/admin');
    } else {
      handleAdminLogin();
    }
  };

  const handleSendSupportMessage = async () => {
    if (!supportMessage.trim()) {
      toast.error('Введите сообщение');
      return;
    }

    try {
      const response = await fetch(SUPPORT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: 'Пользователь',
          message: supportMessage
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Сообщение отправлено! Скоро с вами свяжутся.');
        setSupportMessage('');
        setDialogOpen(false);
      } else {
        toast.error('Ошибка при отправке сообщения');
      }
    } catch (error) {
      toast.error('Не удалось отправить сообщение');
      console.error('Support message error:', error);
    }
  };

  return (
    <footer className="border-t border-[#2a2a2a] mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                    onClick={handleSendSupportMessage}
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
                      onClick={handleAdminClick}
                      className="w-full bg-[#d4af37] text-black hover:bg-[#c4a037]"
                    >
                      Войти в админ-панель
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <p className="text-green-400 mb-4">Вы вошли как администратор</p>
                    <Button
                      onClick={() => navigate('/admin')}
                      className="w-full bg-[#d4af37] text-black hover:bg-[#c4a037]"
                    >
                      Открыть админ-панель
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          <p className="text-gray-500 text-sm">© 2024 FartBurger. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;