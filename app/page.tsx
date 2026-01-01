'use client';

import { useRouter } from 'next/navigation';
import { 
  Leaf, 
  Award, 
  Recycle, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  Calendar,
  FileText,
  ExternalLink,
  QrCode,
  Globe,
  Play
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  
  // Handle demo mode navigation
  const handleDemoStart = () => {
    router.push('/?demo=true&step=1');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-carbon-lime/10 via-white to-carbon-leaf/5 py-20 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-carbon-leaf/10 rounded-full mb-6">
              <Leaf className="w-5 h-5 text-carbon-leaf" />
              <span className="text-sm font-semibold text-carbon-forest">
                2026 SAF Mandate Ready
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-changi-navy mb-4">
              Changi Sustainable Loyalty Ecosystem
            </h1>
            <p className="text-xl lg:text-2xl text-changi-gray mb-8 max-w-3xl mx-auto">
              From calculator to compliance. Ready for Singapore's 2026 SAF mandate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/calculator')}
                className="px-8 py-4 bg-carbon-leaf text-white rounded-lg font-semibold text-lg hover:bg-carbon-forest transition-colors flex items-center justify-center gap-2 shadow-lg"
                aria-label="Experience as Passenger"
              >
                Experience as Passenger
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-8 py-4 bg-changi-navy text-white rounded-lg font-semibold text-lg hover:bg-changi-purple transition-colors flex items-center justify-center gap-2 shadow-lg"
                aria-label="View Operations Dashboard"
              >
                View Operations Dashboard
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDemoStart}
                className="px-8 py-4 bg-carbon-sage text-white rounded-lg font-semibold text-lg hover:bg-carbon-forest transition-colors flex items-center justify-center gap-2 shadow-lg"
                aria-label="Start Demo"
              >
                Start Demo
                <Play className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 px-4 lg:px-8 bg-changi-cream">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-changi-navy mb-4">
              The offset era is ending. The SAF era begins in 2026.
            </h2>
            <p className="text-lg text-changi-gray max-w-3xl mx-auto">
              Singapore's Sustainable Air Hub Blueprint mandates 1% SAF blend by 2026, 
              scaling to 3-5% by 2030. Changi needs a compliance-ready system, not just 
              a carbon calculator.
            </p>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-changi-gray/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-carbon-leaf rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-changi-navy mb-2">2024 (Now)</h3>
                <p className="text-changi-gray">
                  Current state: ACA Level 3
                  <br />
                  <span className="text-sm">Competitors at Level 4-5</span>
                </p>
              </div>
              
              <ArrowRight className="w-8 h-8 text-carbon-leaf hidden md:block" />
              
              <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-carbon-leaf rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-changi-navy mb-2">2026</h3>
                <p className="text-changi-gray">
                  <strong className="text-carbon-forest">1% SAF Mandate</strong>
                  <br />
                  <span className="text-sm">Compliance requirement</span>
                </p>
              </div>
              
              <ArrowRight className="w-8 h-8 text-carbon-leaf hidden md:block" />
              
              <div className="flex-1 text-center">
                <div className="w-16 h-16 bg-carbon-forest rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-changi-navy mb-2">2030</h3>
                <p className="text-changi-gray">
                  <strong className="text-carbon-forest">3-5% SAF Target</strong>
                  <br />
                  <span className="text-sm">Net-zero pathway</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
            <p className="text-changi-navy">
              <strong>Current Gap:</strong> Changi is at ACA Level 3, while leading competitors 
              (HKIA, Schiphol) operate at Level 4-5. This system bridges that gap with 
              real-time tracking, SAF-first contributions, and compliance automation.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Overview */}
      <section className="py-16 px-4 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-changi-navy mb-4">Four-Pillar Solution</h2>
            <p className="text-lg text-changi-gray max-w-3xl mx-auto">
              A comprehensive ecosystem designed for compliance, transparency, and measurable impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pillar 1: SAF-First */}
            <div className="bg-gradient-to-br from-carbon-lime/20 to-carbon-leaf/10 rounded-xl p-8 border-2 border-carbon-leaf shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-carbon-leaf rounded-full flex items-center justify-center">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-changi-navy">SAF-First Contributions</h3>
              </div>
              <p className="text-changi-gray mb-4">
                Book-and-claim SAF attribution system with real-time tracking toward 2026 mandate. 
                Every contribution is verified, certified, and counted toward compliance.
              </p>
              <ul className="space-y-2 text-sm text-changi-gray">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-carbon-leaf" />
                  IATA Book-and-Claim Registry integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-carbon-leaf" />
                  Real-time progress tracking to 2026 mandate
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-carbon-leaf" />
                  Provider certification (Neste, Shell SAF)
                </li>
              </ul>
            </div>

            {/* Pillar 2: Green Tier */}
            <div className="bg-gradient-to-br from-carbon-sage/20 to-carbon-mint/10 rounded-xl p-8 border-2 border-carbon-sage shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-carbon-sage rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-changi-navy">Green Tier Loyalty</h3>
              </div>
              <p className="text-changi-gray mb-4">
                Gamified sustainability program that rewards passengers for sustainable choices. 
                Tiers from Seedling to Guardian, with meaningful perks and recognition.
              </p>
              <ul className="space-y-2 text-sm text-changi-gray">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-carbon-sage" />
                  Five-tier progression system
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-carbon-sage" />
                  Eco-Points for all sustainable actions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-carbon-sage" />
                  Social signaling and badges
                </li>
              </ul>
            </div>

            {/* Pillar 3: Circularity */}
            <div className="bg-gradient-to-br from-carbon-mint/20 to-carbon-sage/10 rounded-xl p-8 border-2 border-carbon-mint shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-carbon-mint rounded-full flex items-center justify-center">
                  <Recycle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-changi-navy">Circularity Tracking</h3>
              </div>
              <p className="text-changi-gray mb-4">
                Beyond carbon: tracking waste diversion, single-use reduction, and circular economy 
                actions. Addresses the "Novel Entities" planetary boundary.
              </p>
              <ul className="space-y-2 text-sm text-changi-gray">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-carbon-mint" />
                  Cup-as-a-Service program
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-carbon-mint" />
                  Terminal-level waste tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-carbon-mint" />
                  Participant engagement metrics
                </li>
              </ul>
            </div>

            {/* Pillar 4: Dashboard */}
            <div className="bg-gradient-to-br from-changi-purple/20 to-changi-navy/10 rounded-xl p-8 border-2 border-changi-purple shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-changi-purple rounded-full flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-changi-navy">Real-Time Dashboard</h3>
              </div>
              <p className="text-changi-gray mb-4">
                Operations command center for sustainability teams. Real-time metrics, 
                compliance tracking, and scenario planning for 2026 readiness.
              </p>
              <ul className="space-y-2 text-sm text-changi-gray">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-changi-purple" />
                  Live SAF progress tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-changi-purple" />
                  Route-level emissions analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-changi-purple" />
                  Export-ready compliance reports
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Framework Alignment */}
      <section className="py-16 px-4 lg:px-8 bg-changi-cream">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-changi-gray/20">
            <h2 className="text-3xl font-bold text-changi-navy mb-4">
              Beyond Carbon: Planetary Boundaries Framework
            </h2>
            <p className="text-lg text-changi-gray mb-6">
              True sustainability goes beyond CO₂. This system addresses multiple planetary boundaries:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-carbon-lime/10 rounded-lg">
                <h3 className="font-semibold text-changi-navy mb-2">Climate Change</h3>
                <p className="text-sm text-changi-gray">
                  SAF contributions, carbon offsets, and emissions tracking
                </p>
              </div>
              <div className="p-4 bg-carbon-sage/10 rounded-lg">
                <h3 className="font-semibold text-changi-navy mb-2">Novel Entities</h3>
                <p className="text-sm text-changi-gray">
                  Waste diversion, single-use reduction, circularity actions
                </p>
              </div>
              <div className="p-4 bg-carbon-mint/10 rounded-lg">
                <h3 className="font-semibold text-changi-navy mb-2">Biodiversity</h3>
                <p className="text-sm text-changi-gray">
                  Plant-based meal tracking, sustainable merchant support
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-changi-cream rounded-lg border-l-4 border-carbon-leaf">
              <p className="text-sm text-changi-navy">
                <strong>Methodology Transparency:</strong> Every metric includes data sources, 
                calculation methods, and estimation acknowledgments. No greenwashing—just 
                verified, auditable data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Instructions */}
      <section className="py-16 px-4 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-changi-navy mb-8 text-center">
            Try the Demo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-changi-cream rounded-xl p-6">
              <h3 className="text-xl font-bold text-changi-navy mb-4 flex items-center gap-2">
                <QrCode className="w-6 h-6" />
                Telegram Bot
              </h3>
              <p className="text-changi-gray mb-4">
                Scan the QR code to interact with the Changi sustainability bot. 
                Calculate flights, contribute to SAF, and log circularity actions.
              </p>
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-changi-gray/30 text-center">
                <QrCode className="w-32 h-32 mx-auto text-changi-gray/50 mb-2" />
                <p className="text-xs text-changi-gray italic">
                  QR code integration coming soon
                </p>
              </div>
            </div>

            <div className="bg-carbon-lime/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-changi-navy mb-4">
                What to Try First
              </h3>
              <ol className="space-y-3 text-changi-gray">
                <li className="flex items-start gap-3">
                  <span className="font-bold text-carbon-leaf">1.</span>
                  <span>
                    <strong>Calculate a flight:</strong> Use the calculator to see 
                    aircraft-specific emissions with SAF attribution options.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-carbon-leaf">2.</span>
                  <span>
                    <strong>Contribute to SAF:</strong> See how book-and-claim works 
                    and track progress toward 2026 mandate.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-carbon-leaf">3.</span>
                  <span>
                    <strong>Log circularity actions:</strong> Try Cup-as-a-Service 
                    or refuse a bag to see waste diversion tracking.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-bold text-carbon-leaf">4.</span>
                  <span>
                    <strong>View dashboard:</strong> See real-time metrics and 
                    compliance tracking in the operations dashboard.
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Readiness */}
      <section className="py-16 px-4 lg:px-8 bg-gradient-to-br from-changi-navy to-changi-purple text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Built for Compliance
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Ready for CSRD, ISSB, and Singapore's Sustainable Air Hub Blueprint
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <FileText className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-bold mb-2">CSRD Ready</h3>
              <p className="text-sm opacity-90">
                European Sustainability Reporting Standards compliant data structure 
                and audit trails.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <CheckCircle2 className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-bold mb-2">ISSB Aligned</h3>
              <p className="text-sm opacity-90">
                Climate-related disclosures aligned with IFRS S2 standards for 
                aviation sector.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Globe className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-bold mb-2">Singapore Blueprint</h3>
              <p className="text-sm opacity-90">
                Directly supports CAAS Sustainable Air Hub Blueprint requirements 
                and 2026 SAF mandate.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold mb-3">Methodology Transparency</h3>
            <p className="text-sm opacity-90 mb-4">
              Every metric includes:
            </p>
            <ul className="space-y-2 text-sm opacity-90">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Data source citations (IATA, DEFRA, CAAS)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Calculation methodology documentation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Estimation acknowledgments where applicable
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Audit trail for all transactions
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-changi-navy text-white py-12 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Changi Sustainable Loyalty Ecosystem</h3>
              <p className="text-white/70 mb-4">
                A comprehensive sustainability platform designed for compliance, 
                transparency, and measurable impact.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => router.push('/calculator')}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Passenger Calculator
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Operations Dashboard
                  </button>
                </li>
                <li>
                  <a
                    href="/doc/CARBON_Framework.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    CARBON Framework
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/70 text-sm">
                Built with the{' '}
                <a
                  href="/doc/CARBON_Framework.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-carbon-lime hover:text-carbon-leaf font-semibold inline-flex items-center gap-1"
                >
                  CARBON Framework
                  <ExternalLink className="w-4 h-4" />
                </a>
              </p>
              <p className="text-white/70 text-sm">
                Changi Airport Group © 2024
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

