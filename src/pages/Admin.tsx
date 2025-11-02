import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface SupportMessage {
  id: number;
  user_name: string;
  message: string;
  admin_response: string | null;
  status: 'pending' | 'answered';
  created_at: string;
  responded_at: string | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 1,
      user_name: 'Иван',
      message: 'Не могу оформить заказ, выдает ошибку при оплате',
      admin_response: null,
      status: 'pending',
      created_at: '2024-11-02T10:30:00',
      responded_at: null,
    },
    {
      id: 2,
      user_name: 'Мария',
      message: 'Как долго доставка обычно занимает?',
      admin_response: 'Обычно доставка занимает 30-45 минут в пределах города',
      status: 'answered',
      created_at: '2024-11-02T09:15:00',
      responded_at: '2024-11-02T09:20:00',
    },
    {
      id: 3,
      user_name: 'Гость',
      message: 'Можно ли использовать несколько промокодов одновременно?',
      admin_response: null,
      status: 'pending',
      created_at: '2024-11-02T11:00:00',
      responded_at: null,
    },
  ]);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    if (login === 'XeX' && password === '18181818') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      toast.success('Вход выполнен');
    } else {
      toast.error('Неверный логин или пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    navigate('/');
    toast.success('Вы вышли из системы');
  };

  const handleSelectMessage = (msg: SupportMessage) => {
    setSelectedMessage(msg);
    setResponse(msg.admin_response || '');
  };

  const handleSendResponse = () => {
    if (!selectedMessage || !response.trim()) {
      toast.error('Введите ответ');
      return;
    }

    const updatedMessages = messages.map((msg) =>
      msg.id === selectedMessage.id
        ? {
            ...msg,
            admin_response: response,
            status: 'answered' as const,
            responded_at: new Date().toISOString(),
          }
        : msg
    );

    setMessages(updatedMessages);
    toast.success('Ответ отправлен');
    setSelectedMessage(null);
    setResponse('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <Card className="bg-[#1a1a1a] border-[#2a2a2a] p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#d4af37] mb-2">Админ-панель</h1>
            <p className="text-gray-400">Войдите для доступа к системе</p>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Логин</Label>
              <Input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white mt-1"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div>
              <Label className="text-gray-300">Пароль</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white mt-1"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button
              onClick={handleLogin}
              className="w-full bg-[#d4af37] text-black hover:bg-[#c4a037]"
            >
              Войти
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full border-[#2a2a2a] text-gray-400 hover:bg-[#0a0a0a]"
            >
              Вернуться на главную
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const pendingMessages = messages.filter((msg) => msg.status === 'pending');
  const answeredMessages = messages.filter((msg) => msg.status === 'answered');

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-[#2a2a2a] bg-[#1a1a1a]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🍔</div>
              <div>
                <h1 className="text-2xl font-bold text-[#d4af37]">FartBurger</h1>
                <p className="text-sm text-gray-400">Админ-панель</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black"
              >
                <Icon name="Home" className="mr-2" size={18} />
                На главную
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <Icon name="LogOut" className="mr-2" size={18} />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-[#1a1a1a] border-[#2a2a2a] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Новые сообщения</h2>
                <Badge className="bg-red-500 text-white">{pendingMessages.length}</Badge>
              </div>
              <div className="space-y-3">
                {pendingMessages.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">Нет новых сообщений</p>
                ) : (
                  pendingMessages.map((msg) => (
                    <Card
                      key={msg.id}
                      className={`bg-[#0a0a0a] border-[#2a2a2a] p-4 cursor-pointer hover:border-[#d4af37] transition-all ${
                        selectedMessage?.id === msg.id ? 'border-[#d4af37]' : ''
                      }`}
                      onClick={() => handleSelectMessage(msg)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-white">{msg.user_name}</p>
                        <Badge className="bg-yellow-500 text-black text-xs">Новое</Badge>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">{msg.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(msg.created_at).toLocaleString('ru-RU')}
                      </p>
                    </Card>
                  ))
                )}
              </div>
            </Card>

            <Card className="bg-[#1a1a1a] border-[#2a2a2a] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Отвеченные</h2>
                <Badge className="bg-green-500 text-white">{answeredMessages.length}</Badge>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {answeredMessages.map((msg) => (
                  <Card
                    key={msg.id}
                    className={`bg-[#0a0a0a] border-[#2a2a2a] p-4 cursor-pointer hover:border-[#d4af37] transition-all ${
                      selectedMessage?.id === msg.id ? 'border-[#d4af37]' : ''
                    }`}
                    onClick={() => handleSelectMessage(msg)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-white">{msg.user_name}</p>
                      <Badge className="bg-green-500 text-white text-xs">Отвечено</Badge>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">{msg.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(msg.created_at).toLocaleString('ru-RU')}
                    </p>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card className="bg-[#1a1a1a] border-[#2a2a2a] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">
                      Сообщение от {selectedMessage.user_name}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {new Date(selectedMessage.created_at).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <Badge className={selectedMessage.status === 'pending' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}>
                    {selectedMessage.status === 'pending' ? 'Новое' : 'Отвечено'}
                  </Badge>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-gray-300 mb-2 block">Сообщение пользователя</Label>
                    <Card className="bg-[#0a0a0a] border-[#2a2a2a] p-4">
                      <p className="text-white">{selectedMessage.message}</p>
                    </Card>
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2 block">Ваш ответ</Label>
                    <Textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Введите ответ для пользователя..."
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-white min-h-[200px]"
                    />
                  </div>

                  {selectedMessage.admin_response && selectedMessage.status === 'answered' && (
                    <div>
                      <Label className="text-gray-300 mb-2 block">Предыдущий ответ</Label>
                      <Card className="bg-[#0a0a0a] border-green-500/30 p-4">
                        <p className="text-white mb-2">{selectedMessage.admin_response}</p>
                        <p className="text-xs text-gray-500">
                          Отправлено: {selectedMessage.responded_at && new Date(selectedMessage.responded_at).toLocaleString('ru-RU')}
                        </p>
                      </Card>
                    </div>
                  )}

                  <Button
                    onClick={handleSendResponse}
                    className="w-full bg-[#d4af37] text-black hover:bg-[#c4a037] text-lg py-6"
                  >
                    <Icon name="Send" className="mr-2" size={20} />
                    {selectedMessage.status === 'pending' ? 'Отправить ответ' : 'Обновить ответ'}
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="bg-[#1a1a1a] border-[#2a2a2a] p-12">
                <div className="text-center text-gray-400">
                  <Icon name="MessageCircle" size={64} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Выберите сообщение для ответа</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
