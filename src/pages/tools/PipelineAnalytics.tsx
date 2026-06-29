import { useEffect, useState } from 'react';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';

interface PipelineData {
  pipeline: {
    leads: number;
    prospects: number;
    paid: number;
    activeClients: number;
  };
  conversionRates: {
    leadToProspect: string;
    prospectToPayment: string;
    paymentToClient: string;
    overallConversion: string;
  };
  metrics: {
    totalPipeline: number;
    closedDeals: number;
    averageValuePerLead: string;
  };
}

const PipelineAnalytics = () => {
  const [data, setData] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/.netlify/functions/get-pipeline-analytics');
        const result = await res.json();
        if (result.success) {
          setData(result);
        }
      } catch (err) {
        console.error('[PipelineAnalytics] Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 py-8 px-4 flex items-center justify-center">
        <p className="text-stone-600">Loading pipeline...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-stone-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-stone-900 mb-4">Pipeline Analytics</h1>
          <p className="text-stone-600">No data yet. Start capturing leads and bookings.</p>
        </div>
      </div>
    );
  }

  const { pipeline, conversionRates, metrics } = data;

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-stone-900 mb-8">Pipeline Analytics</h1>

        {/* Funnel */}
        <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-8 mb-8">
          <h2 className="text-xl font-bold text-stone-900 mb-6">Sales Funnel</h2>

          <div className="space-y-4">
            {[
              { label: 'Leads', value: pipeline.leads, icon: Users, color: 'bg-blue-50 border-blue-200' },
              { label: 'Prospects (Booked)', value: pipeline.prospects, icon: Target, color: 'bg-amber-50 border-amber-200' },
              { label: 'Paid Bookings', value: pipeline.paid, icon: DollarSign, color: 'bg-emerald-50 border-emerald-200' },
              { label: 'Active Clients', value: pipeline.activeClients, icon: TrendingUp, color: 'bg-green-50 border-green-200' },
            ].map((stage, idx) => {
              const Icon = stage.icon;
              const percentage = pipeline.leads > 0 ? ((stage.value / pipeline.leads) * 100).toFixed(0) : 0;
              return (
                <div key={idx} className={`border rounded-lg p-4 ${stage.color}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon size={24} className="text-stone-600" />
                      <div>
                        <p className="text-sm font-medium text-stone-600">{stage.label}</p>
                        <p className="text-2xl font-bold text-stone-900">{stage.value}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-stone-900">{percentage}%</p>
                      <p className="text-xs text-stone-600">of leads</p>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-stone-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        idx === 0
                          ? 'bg-blue-500'
                          : idx === 1
                            ? 'bg-amber-500'
                            : idx === 2
                              ? 'bg-emerald-500'
                              : 'bg-green-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversion Rates */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3">Conversion Rates</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-stone-600">Lead → Prospect</span>
                <span className="font-bold text-stone-900">{conversionRates.leadToProspect}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-stone-600">Prospect → Payment</span>
                <span className="font-bold text-stone-900">{conversionRates.prospectToPayment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-stone-600">Payment → Client</span>
                <span className="font-bold text-stone-900">{conversionRates.paymentToClient}</span>
              </div>
              <div className="border-t border-stone-200 pt-3 mt-3 flex justify-between">
                <span className="text-sm font-medium text-stone-900">Overall</span>
                <span className="text-lg font-bold text-emerald-600">{conversionRates.overallConversion}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3">Key Metrics</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-stone-600 mb-1">Total Pipeline Value</p>
                <p className="text-2xl font-bold text-stone-900">{metrics.totalPipeline}</p>
              </div>
              <div>
                <p className="text-xs text-stone-600 mb-1">Closed Deals</p>
                <p className="text-2xl font-bold text-emerald-600">{metrics.closedDeals}</p>
              </div>
              <div className="border-t border-stone-200 pt-3 mt-3">
                <p className="text-xs text-stone-600 mb-1">Avg Value per Lead</p>
                <p className="text-xl font-bold text-stone-900">{metrics.averageValuePerLead}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">How to Use</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Leads:</strong> Email signups from website (landing page, sidebar, etc.)</li>
            <li>• <strong>Prospects:</strong> Booked a call via Doxa booking form</li>
            <li>• <strong>Paid:</strong> Completed payment via Stripe checkout</li>
            <li>• <strong>Active Clients:</strong> Have portal access in ClarityHub</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PipelineAnalytics;
