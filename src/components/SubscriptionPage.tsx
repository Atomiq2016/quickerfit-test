import React, { useState } from 'react';
import { ArrowLeft, Check, Crown, Home, CreditCard } from 'lucide-react';

interface SubscriptionPageProps {
  onBack: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setSubscriptionActive(true);
      setIsProcessing(false);
    }, 2000);
  };

  if (subscriptionActive) {
    return (
      <div className="min-h-screen text-gray-900 relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://i.ibb.co/6cgL50K4/QfitBG.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
          }}
        />
        
        {/* Color Overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.3) 0%, rgba(148, 163, 184, 0.2) 50%, rgba(31, 41, 55, 0.1) 100%)',
            mixBlendMode: 'overlay'
          }}
        />
        
        <div className="max-w-sm mx-auto px-4 pt-12 pb-4 relative z-20" style={{ maxWidth: '375px' }}>
          {/* Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img 
              src="https://i.ibb.co/5g5PZBP7/QfitLogo.png" 
              alt="QuickFit Logo" 
              className="mx-auto"
              style={{ height: '50px' }}
            />
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-emerald-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Pro!</h2>
            <p className="text-gray-600">Your subscription is now active</p>
          </div>

          {/* Pro Features */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-center mb-4">
              <Crown className="w-6 h-6 text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Pro Features</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center mr-3">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700">Unlimited sessions</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center mr-3">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700">Custom timers</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center mr-3">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-700">Cloud sync</span>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-2">Subscription</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Plan: QuickFit Pro Monthly</p>
              <p>Price: $4.99/month</p>
              <p className="flex items-center">
                Status: 
                <span className="ml-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs">
                  Active
                </span>
              </p>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex gap-2">
            <button 
              onClick={onBack}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 px-3 rounded-full transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 text-sm font-medium"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button className="flex-1 bg-emerald-400 hover:bg-emerald-500 text-gray-800 py-2.5 px-3 rounded-full transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 text-sm font-medium">
              <CreditCard className="w-4 h-4" />
              <span>Subscription</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-900 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://i.ibb.co/6cgL50K4/QfitBG.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Color Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.3) 0%, rgba(148, 163, 184, 0.2) 50%, rgba(31, 41, 55, 0.1) 100%)',
          mixBlendMode: 'overlay'
        }}
      />
      
      <div className="max-w-sm mx-auto px-4 py-4 relative z-20" style={{ maxWidth: '375px' }}>
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img 
            src="https://i.ibb.co/5g5PZBP7/QfitLogo.png" 
            alt="QuickFit Logo" 
            className="mx-auto"
            style={{ height: '50px' }}
          />
        </div>

        {/* Upgrade Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Upgrade to Pro</h2>
          <p className="text-gray-600">Unlock premium features</p>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border-2 border-emerald-400">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-800">$4.99</div>
            <div className="text-gray-600">per month</div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-emerald-500 mr-3" />
              <span className="text-gray-700">Unlimited workout sessions</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 text-emerald-500 mr-3" />
              <span className="text-gray-700">Custom timer settings</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 text-emerald-500 mr-3" />
              <span className="text-gray-700">Cloud backup & sync</span>
            </div>
          </div>

          {/* Subscribe Button */}
          <button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className={`w-full py-3 px-6 rounded-full font-semibold text-white transition-all duration-200 active:scale-95 ${
              isProcessing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-emerald-400 hover:bg-emerald-500'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </div>
            ) : (
              'Subscribe Now'
            )}
          </button>

          <div className="text-center mt-3">
            <p className="text-xs text-gray-500">Cancel anytime</p>
          </div>
        </div>

        {/* Free Features */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-3">Free Version:</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-gray-400 mr-2" />
              Basic timers
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-gray-400 mr-2" />
              Session history
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex gap-2">
          <button 
            onClick={onBack}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 px-3 rounded-full transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button className="flex-1 bg-emerald-400 hover:bg-emerald-500 text-gray-800 py-2.5 px-3 rounded-full transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 text-sm font-medium">
            <CreditCard className="w-4 h-4" />
            <span>Subscription</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;