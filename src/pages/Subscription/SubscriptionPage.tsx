import React from 'react';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import { Crown, Check, Calendar, CreditCard, Zap, Shield, Users, BarChart } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  const currentPlan = 'free'; // This would come from user context
  const expirationDate = '2024-12-31';

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Up to 50 transactions per month',
        'Basic reporting',
        '1 admin user',
        'Email support',
      ],
      limitations: [
        'Limited storage',
        'Basic charts only',
        'No advanced analytics',
      ],
      icon: Users,
      color: 'gray',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      period: 'month',
      description: 'For growing businesses',
      features: [
        'Unlimited transactions',
        'Advanced reporting & analytics',
        'Up to 10 team members',
        'Priority email support',
        'Data export functionality',
        'Custom categories',
      ],
      icon: BarChart,
      color: 'blue',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99,
      period: 'month',
      description: 'For large organizations',
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'Advanced security features',
        'Custom integrations',
        'Dedicated account manager',
        'Phone support',
        'Custom branding',
      ],
      icon: Crown,
      color: 'purple',
    },
  ];

  const handleUpgrade = (planId: string) => {
    // This would typically redirect to payment processor
    console.log(`Upgrading to ${planId}`);
  };

  const currentPlanData = plans.find(plan => plan.id === currentPlan);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Subscription</h1>
          <p className="text-white/80">Manage your subscription and billing</p>
        </div>
      </div>

      {/* Current Plan Status */}
      <Card className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-blue-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center">
              {currentPlanData && (
                <currentPlanData.icon className="w-6 h-6 text-blue-300" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Current Plan: {currentPlanData?.name}
              </h2>
              <p className="text-white/80">{currentPlanData?.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              ${currentPlanData?.price}
              <span className="text-sm font-normal text-white/70">
                /{currentPlanData?.period}
              </span>
            </div>
            {currentPlan !== 'free' && (
              <div className="flex items-center text-sm text-white/70 mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Expires {new Date(expirationDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {currentPlan !== 'free' && (
          <div className="mt-6 pt-6 border-t border-blue-400/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm text-white/80">Auto-renewal enabled</span>
              </div>
              <Button variant="secondary" size="sm">
                <CreditCard className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan;
            const IconComponent = plan.icon;
            
            return (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular
                    ? 'ring-2 ring-blue-500 shadow-lg'
                    : isCurrentPlan
                    ? 'ring-2 ring-green-500'
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 text-sm font-semibold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-3 py-1 text-sm font-semibold rounded-full">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                    plan.color === 'blue' ? 'bg-blue-100' :
                    plan.color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    <IconComponent className={`w-8 h-8 ${
                      plan.color === 'blue' ? 'text-blue-600' :
                      plan.color === 'purple' ? 'text-purple-600' : 'text-black'
                    }`} />
                  </div>
                  <h3 className="text-2xl font-bold text-black">{plan.name}</h3>
                  <p className="text-black mt-2">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-black">${plan.price}</span>
                    <span className="text-black">/{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-black">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  {isCurrentPlan ? (
                    <Button variant="secondary" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      variant={plan.popular ? 'primary' : 'secondary'}
                      className="w-full"
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      {plan.price === 0 ? 'Downgrade' : 'Upgrade'} to {plan.name}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Billing Information */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Billing Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-white mb-2">Payment Method</h4>
            <div className="flex items-center space-x-3 p-3 border border-white/30 rounded-lg bg-white/5">
              <CreditCard className="w-5 h-5 text-white/60" />
              <div>
                <p className="text-sm font-medium text-white">**** **** **** 4242</p>
                <p className="text-sm text-white/70">Expires 12/25</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Next Payment</h4>
            <div className="flex items-center space-x-3 p-3 border border-white/30 rounded-lg bg-white/5">
              <Calendar className="w-5 h-5 text-white/60" />
              <div>
                <p className="text-sm font-medium text-white">December 31, 2024</p>
                <p className="text-sm text-white/70">${currentPlanData?.price || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionPage;