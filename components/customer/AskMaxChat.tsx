'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Plane, ShoppingBag, Map, Recycle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useJourney } from '@/hooks/useJourney';
import { useGreenTier } from '@/hooks/useGreenTier';
import ImpactStory from './ImpactStory';
import { getCurrentDemoStepFromURL } from '@/lib/demo/demoScript';

interface Message {
  id: string;
  type: 'user' | 'max' | 'action' | 'impact-story';
  content?: string;
  actionCard?: {
    type: 'saf' | 'offset' | 'circularity';
    title: string;
    description: string;
    data?: any;
  };
  impactStory?: {
    title: string;
    narrative: string;
    details: {
      emissionsReduced: number;
      safContribution?: number;
      offsetContribution?: number;
      ecoPointsEarned: number;
      actions: string[];
    };
  };
  quickActions?: Array<{
    label: string;
    action: string;
    icon?: React.ReactNode;
  }>;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "Why is SAF better than offsets?",
  "How do you calculate my footprint?",
  "What's my Green Tier progress?",
  "Show me my impact story",
  "Find me sustainable shops",
];

export default function AskMaxChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { journey, totalEmissions, netEmissions, totalEcoPoints, totalWasteDiverted } = useJourney();
  const { tierInfo, progress } = useGreenTier();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Demo mode integration - send demo message automatically
  useEffect(() => {
    const demoStep = getCurrentDemoStepFromURL();
    if (!demoStep || messages.length > 0) return; // Only auto-send if no messages yet
    
    if (demoStep.action?.type === 'ask_max' && demoStep.action.params?.question) {
      // Auto-send the demo question
      const question = demoStep.action.params.question;
      setTimeout(() => {
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          type: 'user',
          content: question,
          timestamp: new Date(),
        };
        setMessages([userMessage]);
        // Trigger the response logic
        handleSendMessage(question);
      }, 1000);
    } else if (demoStep.action?.type === 'view_impact' && demoStep.action.params?.request) {
      // Auto-request impact story
      const request = demoStep.action.params.request;
      setTimeout(() => {
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          type: 'user',
          content: request,
          timestamp: new Date(),
        };
        setMessages([userMessage]);
        // Trigger the response logic
        handleSendMessage(request);
      }, 1000);
    }
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'contribute_saf':
        router.push('/calculator');
        break;
      case 'green_shops':
        router.push('/shop');
        break;
      case 'view_journey':
        router.push('/journey');
        break;
      case 'log_circularity':
        // Open circularity action sheet (could be a modal)
        addMaxMessage("I'd love to help you log a circularity action! You can find all available actions in the circularity section. Would you like me to show you what actions are available?", []);
        break;
      default:
        break;
    }
  };

  const addMaxMessage = (
    content: string,
    quickActions?: Array<{ label: string; action: string; icon?: React.ReactNode }>
  ) => {
    const message: Message = {
      id: `max-${Date.now()}`,
      type: 'max',
      content,
      quickActions,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
  };

  const generateImpactStory = (): Message['impactStory'] => {
    const contributions = journey.flight?.safContribution || journey.flight?.offsetPurchase;
    const actions: string[] = [];
    
    if (journey.flight?.safContribution) {
      actions.push('SAF Contribution');
    }
    if (journey.flight?.offsetPurchase) {
      actions.push('Carbon Offset');
    }
    if (journey.circularity.length > 0) {
      actions.push(`${journey.circularity.length} Circularity Action${journey.circularity.length > 1 ? 's' : ''}`);
    }
    if (journey.shopping.some(s => s.isGreenMerchant)) {
      actions.push('Green Shopping');
    }
    if (journey.dining.some(d => d.isPlantBased)) {
      actions.push('Plant-Based Dining');
    }

    const emissionsReduced = totalEmissions - netEmissions;
    const safContribution = journey.flight?.safContribution?.amount;
    const offsetContribution = journey.flight?.offsetPurchase?.amount;

    return {
      title: "Your Journey Towards Sustainable Travel",
      narrative: `Every action you take creates a ripple effect. By choosing to address your travel footprint through SAF contributions and sustainable choices, you're not just reducing emissions—you're supporting the transition to cleaner aviation fuels and demonstrating that responsible travel is possible.\n\nYour journey from ${journey.flight?.origin || 'your origin'} to ${journey.flight?.destination || 'your destination'} represents more than just a trip. It's a statement about the future you want to see—one where travel and sustainability go hand in hand.`,
      details: {
        emissionsReduced,
        safContribution,
        offsetContribution,
        ecoPointsEarned: totalEcoPoints,
        actions,
      },
    };
  };

  // Extract message handling logic to a separate function for demo mode
  // This must be defined before useEffect hooks that use it
  const handleSendMessage = async (messageText: string) => {
    setIsTyping(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const query = messageText.toLowerCase().trim();
    let response: string = '';
    let quickActions: Array<{ label: string; action: string; icon?: React.ReactNode }> = [];
    let impactStory: Message['impactStory'] | undefined;
    let actionCard: Message['actionCard'] | undefined;

    // Handle different queries
    if (query.includes('saf') && (query.includes('better') || query.includes('why') || query.includes('vs'))) {
      response = `Great question! SAF (Sustainable Aviation Fuel) is a direct replacement for conventional jet fuel, made from waste materials. It can reduce emissions by up to 90% compared to fossil fuels.\n\nUnlike offsets, which compensate for emissions elsewhere, SAF actually reduces emissions at the source—in the aircraft itself. This makes SAF a more direct and impactful way to address your travel footprint.\n\nWhen you contribute to SAF, you're supporting the production and scaling of cleaner fuels, which helps accelerate the aviation industry's transition to sustainable energy.`;
      quickActions = [
        { label: 'Contribute to SAF', action: 'contribute_saf', icon: <Plane className="w-4 h-4" /> },
        { label: 'View My Journey', action: 'view_journey', icon: <Map className="w-4 h-4" /> },
      ];
    } else if (query.includes('calculate') || query.includes('footprint') || query.includes('emission')) {
      response = `I calculate your footprint using internationally recognized methodologies:\n\n• **Flight emissions**: Distance, aircraft efficiency, fuel consumption, and radiative forcing effects\n• **Transport**: Mode of transport and distance traveled\n• **Shopping & Dining**: Transaction amounts and merchant sustainability scores\n\nAll calculations follow IATA and ICAO standards, and I always show uncertainty ranges so you understand the precision of the estimates.\n\nWould you like to see the detailed methodology for any specific calculation?`;
      quickActions = [
        { label: 'Calculate Flight', action: 'contribute_saf', icon: <Plane className="w-4 h-4" /> },
        { label: 'View My Journey', action: 'view_journey', icon: <Map className="w-4 h-4" /> },
      ];
    } else if (query.includes('tier') || query.includes('progress') || query.includes('level')) {
      response = `You're currently at the **${tierInfo.name}** tier with ${progress.currentPoints.toLocaleString()} Eco-Points!\n\n${progress.pointsToNextTier ? `You're ${progress.pointsToNextTier.toLocaleString()} points away from the next tier.` : "You've reached the highest tier—congratulations!"}\n\nYour current tier gives you a **${tierInfo.multiplier}x** points multiplier, which means you earn more points on every action. Keep up the great work!`;
      quickActions = [
        { label: 'View My Journey', action: 'view_journey', icon: <Map className="w-4 h-4" /> },
        { label: 'Contribute to SAF', action: 'contribute_saf', icon: <Plane className="w-4 h-4" /> },
      ];
    } else if (query.includes('impact story') || query.includes('story')) {
      impactStory = generateImpactStory();
      response = `Here's your personalized impact story!`;
    } else if (query.includes('shop') || query.includes('merchant') || query.includes('sustainable')) {
      response = `I can help you find sustainable shops at Changi! Green merchants are rated based on their carbon scores, sustainable materials usage, and circular economy initiatives.\n\nWhen you shop at green merchants, you earn bonus Eco-Points based on their sustainability rating. Some merchants offer up to 1.8x points multipliers!\n\nWould you like me to show you the available green shops?`;
      quickActions = [
        { label: 'See Green Shops', action: 'green_shops', icon: <ShoppingBag className="w-4 h-4" /> },
        { label: 'View My Journey', action: 'view_journey', icon: <Map className="w-4 h-4" /> },
      ];
    } else if (query.includes('circularity') || query.includes('waste') || query.includes('recycle')) {
      response = `Circularity actions help reduce waste at the airport! Every action you take—like using reusable cups, refusing bags, or choosing plant-based meals—diverts waste from landfills.\n\nYou've already taken ${journey.circularity.length} circularity action${journey.circularity.length !== 1 ? 's' : ''} and diverted ${(totalWasteDiverted / 1000).toFixed(2)} kg of waste!\n\nWould you like to log another circularity action?`;
      quickActions = [
        { label: 'Log Circularity Action', action: 'log_circularity', icon: <Recycle className="w-4 h-4" /> },
        { label: 'View My Journey', action: 'view_journey', icon: <Map className="w-4 h-4" /> },
      ];
    } else if (query.includes('hello') || query.includes('hi') || query.includes('help')) {
      response = `Hi! I'm Max, your sustainability assistant. I can help you:\n\n• Understand SAF and how it works\n• Calculate your carbon footprint\n• Track your Green Tier progress\n• Find sustainable shops\n• Log circularity actions\n• Generate your impact story\n\nWhat would you like to know?`;
      quickActions = [
        { label: 'View My Journey', action: 'view_journey', icon: <Map className="w-4 h-4" /> },
        { label: 'Contribute to SAF', action: 'contribute_saf', icon: <Plane className="w-4 h-4" /> },
      ];
    } else {
      response = `I'm here to help you with your sustainability journey! You can ask me about:\n\n• SAF contributions and how they work\n• Your carbon footprint calculations\n• Your Green Tier progress\n• Sustainable shopping options\n• Circularity actions\n• Your impact story\n\nWhat would you like to explore?`;
      quickActions = [
        { label: 'View My Journey', action: 'view_journey', icon: <Map className="w-4 h-4" /> },
        { label: 'Contribute to SAF', action: 'contribute_saf', icon: <Plane className="w-4 h-4" /> },
      ];
    }

    setIsTyping(false);

    const maxMessage: Message = {
      id: `max-${Date.now()}`,
      type: impactStory ? 'impact-story' : 'max',
      content: response,
      impactStory,
      actionCard,
      quickActions: quickActions.length > 0 ? quickActions : undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, maxMessage]);
  };

  const handleSend = async () => {
    if (!input.trim() && messages.length === 0) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = input.trim();
    setInput('');
    
    await handleSendMessage(messageText);
  };

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Demo mode integration - send demo message automatically
  useEffect(() => {
    const demoStep = getCurrentDemoStepFromURL();
    if (!demoStep || messages.length > 0) return; // Only auto-send if no messages yet
    
    if (demoStep.action?.type === 'ask_max' && demoStep.action.params?.question) {
      // Auto-send the demo question
      const question = demoStep.action.params.question;
      setTimeout(() => {
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          type: 'user',
          content: question,
          timestamp: new Date(),
        };
        setMessages([userMessage]);
        // Trigger the response logic
        handleSendMessage(question);
      }, 1000);
    } else if (demoStep.action?.type === 'view_impact' && demoStep.action.params?.request) {
      // Auto-request impact story
      const request = demoStep.action.params.request;
      setTimeout(() => {
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          type: 'user',
          content: request,
          timestamp: new Date(),
        };
        setMessages([userMessage]);
        // Trigger the response logic
        handleSendMessage(request);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px] bg-white rounded-xl shadow-lg border border-changi-gray/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-carbon-leaf to-carbon-forest text-white p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-2xl">
          🌿
        </div>
        <div>
          <h2 className="font-bold text-lg">Max</h2>
          <p className="text-xs text-white/80">Your Sustainability Assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-changi-cream/30">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-carbon-leaf to-carbon-forest rounded-full flex items-center justify-center text-xl flex-shrink-0">
                🌿
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm max-w-[80%]">
                <p className="text-changi-navy">
                  Hi! I'm Max, your sustainability assistant. I'm here to help you understand your carbon footprint, 
                  explore SAF contributions, and track your impact. What would you like to know?
                </p>
              </div>
            </div>

            {/* Suggested Questions */}
            <div className="space-y-2">
              <p className="text-sm text-changi-gray font-semibold px-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="bg-white border border-carbon-leaf/30 text-carbon-forest text-sm px-4 py-2 rounded-full hover:bg-carbon-lime/20 hover:border-carbon-leaf transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {message.type !== 'user' && (
                <div className="w-10 h-10 bg-gradient-to-br from-carbon-leaf to-carbon-forest rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  🌿
                </div>
              )}
              <div className={`${message.type === 'user' ? 'bg-carbon-leaf text-white' : 'bg-white'} rounded-lg p-4 shadow-sm max-w-[80%] ${message.type === 'user' ? 'ml-auto' : ''}`}>
                {message.content && (
                  <p className={`whitespace-pre-line ${message.type === 'user' ? 'text-white' : 'text-changi-navy'}`}>
                    {message.content}
                  </p>
                )}

                {message.impactStory && (
                  <div className="mt-4">
                    <ImpactStory story={message.impactStory} />
                  </div>
                )}

                {message.quickActions && message.quickActions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {message.quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.action)}
                        className="w-full bg-carbon-lime/20 border border-carbon-leaf/30 text-carbon-forest text-sm px-4 py-2 rounded-lg hover:bg-carbon-lime/30 transition-colors flex items-center justify-center gap-2"
                      >
                        {action.icon}
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {message.type === 'user' && (
                <div className="w-10 h-10 bg-changi-navy rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  You
                </div>
              )}
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-carbon-leaf to-carbon-forest rounded-full flex items-center justify-center text-xl flex-shrink-0">
              🌿
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-carbon-leaf rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-carbon-leaf rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-carbon-leaf rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-changi-gray/20 p-4 bg-white">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Max anything about sustainability..."
            className="flex-1 border border-changi-gray/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-carbon-leaf focus:border-transparent"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-carbon-leaf text-white px-6 py-2 rounded-lg hover:bg-carbon-forest transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isTyping ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

