import { 
  Zap, 
  Database, 
  Brain, 
  Users, 
  Network, 
  Target,
  Lightbulb,
  TrendingUp,
  MessageSquareText,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useState } from 'react'

export default function AboutPage() {
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          About RedMeters
        </h1>
        <p className="text-slate-400">
          Intelligent Smart Meter Analytics Platform
        </p>
      </div>

      {/* Vision Statement */}
      <div className="bg-gradient-to-br from-energy-red/20 to-energy-orange/10 rounded-2xl p-8 border border-energy-red/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-energy-red/30 flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-energy-red" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">Project Vision</h2>
            <p className="text-slate-300 leading-relaxed">
              RedMeters transforms raw smart meter data into actionable customer intelligence. 
              Energy retailers collect vast amounts of consumption data—readings every 15 minutes 
              for millions of customers—yet this incredible data trove often sits unused beyond 
              basic billing. Our platform unlocks this potential.
            </p>
          </div>
        </div>
      </div>

      {/* Key Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* The Data Opportunity */}
        <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white">The Data Opportunity</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Energy companies know exactly how much power each customer consumes every 15 minutes—a 
            massive numerical dataset spanning years. This represents one of the largest untapped 
            data sources in the utility sector, often stored but rarely mined for insights.
          </p>
        </div>

        {/* Customer Intelligence */}
        <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white">Customer Intelligence</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Without collecting personal data, consumption patterns reveal customer profiles. 
            Power spikes at 3:30 PM? Likely school-age children arriving home. Machine learning 
            can identify clear customer segments from pure numerical patterns, enabling 
            personalized services while respecting privacy.
          </p>
        </div>

        {/* ML-Powered Analytics */}
        <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white">ML-Powered Analytics</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Our platform applies machine learning to energy consumption data, crunching millions 
            of data points to uncover patterns invisible to traditional analysis. From demand 
            forecasting to anomaly detection, AI transforms raw readings into business intelligence.
          </p>
        </div>

        {/* Agentic Ecosystem */}
        <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Network className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-semibold text-white">Agentic Ecosystem</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Beyond standalone analytics, the platform vision extends to an agentic ecosystem—where 
            intelligent systems work together across departments and partners. Identified issues 
            can automatically package up actionable recommendations, streamlining workflows from 
            detection to resolution.
          </p>
        </div>
      </div>

      {/* The Challenge & Solution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-rose-400" />
            </div>
            <h3 className="font-semibold text-white">The Challenge</h3>
          </div>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 mt-1">•</span>
              <span>Energy retailers often store minimal customer data by design—just address and payment status</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 mt-1">•</span>
              <span>Massive smart meter datasets sit unused beyond billing calculations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 mt-1">•</span>
              <span>Knowledge bases suffer from data quality issues when AI is applied</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 mt-1">•</span>
              <span>Privacy constraints limit use of call recordings and personal data</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white">Our Solution</h3>
          </div>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">•</span>
              <span>Extract customer intelligence from consumption patterns without PII</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">•</span>
              <span>Apply ML models to identify customer segments and predict behavior</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">•</span>
              <span>Detect anomalies and predict equipment failures proactively</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">•</span>
              <span>Build an ecosystem where insights flow seamlessly to action</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Platform Capabilities */}
      <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="font-semibold text-white">Platform Capabilities</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Customer Segmentation', desc: 'ML-based profiling' },
            { label: 'Demand Forecasting', desc: 'Predictive modeling' },
            { label: 'Anomaly Detection', desc: 'Real-time alerts' },
            { label: 'Failure Prediction', desc: 'Proactive maintenance' },
          ].map((cap, idx) => (
            <div key={idx} className="bg-slate-800/50 rounded-lg p-4 text-center">
              <p className="text-white font-medium text-sm mb-1">{cap.label}</p>
              <p className="text-slate-500 text-xs">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Origin Story & Transcript Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        {/* Introduction Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <MessageSquareText className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">The Origin Story</h2>
              <p className="text-slate-300 leading-relaxed">
                This application was born from a brainstorming session between{' '}
                <span className="text-indigo-400 font-medium">Peter Hogg</span>,{' '}
                <span className="text-indigo-400 font-medium">Rima Yammouni</span>, and{' '}
                <span className="text-indigo-400 font-medium">Jim Freeman</span>. During this 
                discussion, the team explored the untapped potential of smart meter data and 
                identified a significant opportunity to transform raw energy consumption 
                readings into meaningful customer intelligence.
              </p>
            </div>
          </div>
        </div>

        {/* Transcript Section */}
        <div className="p-6">
          <button
            onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
            className="w-full flex items-center justify-between text-left mb-4 group"
          >
            <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
              Meeting Transcript Summary
            </h3>
            {isTranscriptExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            )}
          </button>

          {isTranscriptExpanded && (
            <div className="space-y-6 animate-fade-in">
              {/* Privacy-First Approach */}
              <div className="bg-slate-800/50 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wide mb-3">
                  Privacy-First Approach
                </h4>
                <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
                  <p>
                    <span className="text-white font-medium">Peter Hogg:</span> "From a customer 
                    perspective, they've taken a deliberate privacy-first approach. They've 
                    strategically partnered with Qantas for loyalty programmes, keeping their 
                    own data footprint minimal."
                  </p>
                  <p>
                    <span className="text-white font-medium">Rima Yammouni:</span> "That's by design, 
                    right? They've made a conscious decision to minimise PII handling—which is 
                    actually a very forward-thinking approach to data privacy."
                  </p>
                </div>
              </div>

              {/* The Rich Data Asset */}
              <div className="bg-slate-800/50 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-3">
                  The Rich Data Asset
                </h4>
                <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
                  <p>
                    <span className="text-white font-medium">Peter Hogg:</span> "What's remarkable 
                    is the energy consumption data they've collected—readings every 15 minutes. 
                    This is an incredible trove of information with enormous untapped potential."
                  </p>
                  <p>
                    "What we discussed was mining that data to create customer classifications. 
                    For example, if power consumption spikes at 3:30 PM, that pattern suggests 
                    school-age children arriving home. There's a huge opportunity here."
                  </p>
                </div>
              </div>

              {/* The Scale & Opportunity */}
              <div className="bg-slate-800/50 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wide mb-3">
                  The Scale & Opportunity
                </h4>
                <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
                  <p>
                    <span className="text-white font-medium">Peter Hogg:</span> "They've built an 
                    impressive data foundation—around 5 million customers with data points every 
                    15 minutes spanning 5-10 years. From a machine learning perspective, this 
                    represents an extraordinary opportunity to uncover customer patterns."
                  </p>
                  <p>
                    "This is their single largest data source—absolutely massive in scale. The 
                    opportunity now is to unlock additional value beyond the current billing and 
                    reporting use cases."
                  </p>
                </div>
              </div>

              {/* The Vision */}
              <div className="bg-slate-800/50 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-3">
                  The Vision
                </h4>
                <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
                  <p>
                    <span className="text-white font-medium">Peter Hogg:</span> "Our proposal 
                    centered on an analytics platform that respects their privacy-first philosophy. 
                    By analysing consumption patterns rather than personal data, we can help them 
                    understand their customers while maintaining their principled approach."
                  </p>
                  <p>
                    <span className="text-white font-medium">Jim Freeman:</span> "What was their 
                    response to the proposal?"
                  </p>
                  <p>
                    <span className="text-white font-medium">Peter Hogg:</span> "They were very 
                    receptive. They said, 'That's fantastic'—and wisely noted they wanted to 
                    establish their data governance framework first. They're taking a thoughtful, 
                    structured approach to this opportunity."
                  </p>
                </div>
              </div>

              {/* The Path Forward */}
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-5 border border-indigo-500/20">
                <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wide mb-3">
                  The Path Forward
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  This brainstorming session crystallized the vision for RedMeters: a platform 
                  that extracts customer intelligence from consumption patterns while honouring 
                  the client's privacy-first philosophy. By applying machine learning to their 
                  impressive smart meter data asset, we can help unlock new insights while 
                  respecting both customer privacy and the client's principled approach to 
                  data stewardship.
                </p>
              </div>
            </div>
          )}

          {!isTranscriptExpanded && (
            <p className="text-slate-500 text-sm">
              Click to expand the full meeting transcript summary...
            </p>
          )}
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center py-4">
        <p className="text-slate-500 text-sm">
          Built on insights from stakeholder discussions • Powered by Kyndryl
        </p>
      </div>
    </div>
  )
}

