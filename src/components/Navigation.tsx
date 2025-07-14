import React from 'react';
import { Home, Target, ShoppingBag, Heart, Download, User, Bug, Sparkles } from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, setCurrentTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'habits', label: 'Habits', icon: Sparkles },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'mood', label: 'Mood', icon: Heart },
    { id: 'export', label: 'Export', icon: Download },
    { id: 'report', label: 'Report', icon: Bug },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t-2 border-cute-pink-200 px-4 py-3 z-50 shadow-cute">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center px-3 py-2 rounded-cute transition-all duration-300 ${
                isActive 
                  ? 'text-cute-pink-600 bg-gradient-to-t from-cute-pink-100 to-cute-purple-100 scale-110 shadow-cute' 
                  : 'text-gray-500 hover:text-cute-purple-600 hover:bg-cute-pink-50'
              }`}
            >
              <Icon size={22} className="mb-1" />
              <span className="text-xs font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;