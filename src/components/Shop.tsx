import React, { useState } from 'react';
import { ShopItem, UserStats } from '../types';
import { shopItems } from '../data/shopItems';
import { Coins, ShoppingCart, Package, CheckCircle, Star } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface ShopProps {
  userStats: UserStats;
  onPurchaseItem: (itemId: string, price: number) => void;
  purchasedItems: string[];
}

const Shop: React.FC<ShopProps> = ({ 
  userStats, 
  onPurchaseItem,
  purchasedItems, 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Items', icon: Package },
    { id: 'themes', name: 'Themes', icon: Star },
    { id: 'power-ups', name: 'Power-ups', icon: LucideIcons.Zap },
    { id: 'rewards', name: 'Rewards', icon: LucideIcons.Award },
    { id: 'features', name: 'Features', icon: LucideIcons.Settings }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);

  const handlePurchase = (item: ShopItem) => {
    if (userStats.totalCoins >= item.price && !purchasedItems.includes(item.id)) {
      onPurchaseItem(item.id, item.price);
      setShowConfirm(null);
    }
  };

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon size={24} /> : <Package size={24} />;
  };

  return (
    <div className="p-6 pb-24 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Shop
        </h1>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-xl text-white">
          <Coins size={20} />
          <span className="font-bold">{userStats.totalCoins}</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon size={16} />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isPurchased = purchasedItems.includes(item.id);
          const canAfford = userStats.totalCoins >= item.price;
          
          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 ${
                isPurchased ? 'ring-2 ring-green-200 bg-green-50' : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${
                    isPurchased 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {getIconComponent(item.icon)}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      isPurchased ? 'text-green-800' : 'text-gray-800'
                    }`}>
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                </div>
                
                {isPurchased && (
                  <CheckCircle className="text-green-600" size={24} />
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins size={16} className="text-yellow-500" />
                  <span className="font-bold text-yellow-600">{item.price}</span>
                </div>
                
                {!isPurchased && (
                  <button
                    onClick={() => setShowConfirm(item.id)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      canAfford
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart size={16} className="inline mr-2" />
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Purchase Confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            {(() => {
              const item = shopItems.find(i => i.id === showConfirm);
              if (!item) return null;
              
              return (
                <>
                  <h2 className="text-xl font-semibold mb-4">Confirm Purchase</h2>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                      {getIconComponent(item.icon)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-gray-600">Price:</span>
                    <div className="flex items-center space-x-2">
                      <Coins size={16} className="text-yellow-500" />
                      <span className="font-bold text-yellow-600">{item.price}</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handlePurchase(item)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
                    >
                      Purchase
                    </button>
                    <button
                      onClick={() => setShowConfirm(null)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">No items found</h3>
          <p className="text-gray-400">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
};

export default Shop;