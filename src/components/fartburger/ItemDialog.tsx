import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { MenuItem } from './types';

interface ItemDialogProps {
  selectedItem: MenuItem | null;
  setSelectedItem: (item: MenuItem | null) => void;
  customization: {
    selectedOptions: Record<string, string>;
    removedIngredients: string[];
    addedIngredients: Record<string, number>;
  };
  setCustomization: (customization: {
    selectedOptions: Record<string, string>;
    removedIngredients: string[];
    addedIngredients: Record<string, number>;
  }) => void;
  toggleIngredient: (ingredient: string) => void;
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  calculateItemPrice: (item: MenuItem, options?: Record<string, string>, addedIngredients?: Record<string, number>) => number;
  addToCart: () => void;
}

const ItemDialog = ({
  selectedItem,
  setSelectedItem,
  customization,
  setCustomization,
  toggleIngredient,
  addIngredient,
  removeIngredient,
  calculateItemPrice,
  addToCart,
}: ItemDialogProps) => {
  return (
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
                          setCustomization({
                            ...customization,
                            selectedOptions: { ...customization.selectedOptions, [optionGroup.type]: value },
                          })
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
  );
};

export default ItemDialog;
