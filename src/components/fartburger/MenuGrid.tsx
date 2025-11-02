import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { MenuItem, Category } from './types';

interface MenuGridProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: Category[];
  filteredMenu: MenuItem[];
  openItemDialog: (item: MenuItem) => void;
}

const MenuGrid = ({
  selectedCategory,
  setSelectedCategory,
  categories,
  filteredMenu,
  openItemDialog,
}: MenuGridProps) => {
  return (
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
  );
};

export default MenuGrid;
