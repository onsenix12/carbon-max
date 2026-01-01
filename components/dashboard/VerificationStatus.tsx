'use client';

import { Clock, CheckCircle2, XCircle, FileText, ExternalLink } from 'lucide-react';

interface Verification {
  id: string;
  certificateId: string;
  provider: string;
  liters: number;
  status: 'pending' | 'verified' | 'rejected';
  timestamp: string;
  registry: string;
}

interface VerificationStatusProps {
  verifications: Verification[];
  pendingCount: number;
}

export default function VerificationStatus({
  verifications,
  pendingCount,
}: VerificationStatusProps) {
  const recentVerifications = verifications
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="w-4 h-4 text-carbon-leaf" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-changi-red" />;
      default:
        return <Clock className="w-4 h-4 text-changi-gray" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="px-2 py-1 bg-carbon-lime/20 text-carbon-leaf text-xs font-medium rounded-full">
            Verified
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 bg-red-50 text-changi-red text-xs font-medium rounded-full">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full">
            Pending
          </span>
        );
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-SG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-changi-gray/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-changi-navy mb-1">Book & Claim Verification</h3>
          <p className="text-sm text-changi-gray">Verification status and audit trail</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-lg">
            <Clock className="w-4 h-4 text-yellow-700" />
            <div>
              <p className="text-xs text-yellow-700 font-medium">Pending</p>
              <p className="text-lg font-bold text-yellow-700">{pendingCount}</p>
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-changi-cream rounded-lg p-4">
          <p className="text-xs text-changi-gray mb-1">Total Verifications</p>
          <p className="text-2xl font-bold text-changi-navy">
            {verifications.length}
          </p>
        </div>
        <div className="bg-carbon-lime/20 rounded-lg p-4">
          <p className="text-xs text-changi-gray mb-1">Verified</p>
          <p className="text-2xl font-bold text-carbon-forest">
            {verifications.filter((v) => v.status === 'verified').length}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-xs text-changi-gray mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
        </div>
      </div>

      {/* Recent Verifications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-changi-navy">Recent Verifications</h4>
          <button className="flex items-center gap-1 text-sm text-changi-purple hover:text-changi-navy hover:underline">
            <FileText className="w-4 h-4" />
            <span>View Audit Trail</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {recentVerifications.map((verification) => (
            <div
              key={verification.id}
              className="flex items-center justify-between p-3 rounded-lg border border-changi-gray/20 hover:bg-changi-cream transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                {getStatusIcon(verification.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-changi-navy truncate">
                    {verification.certificateId}
                  </p>
                  <p className="text-xs text-changi-gray">
                    {verification.provider} • {verification.liters.toLocaleString()} liters
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-changi-gray">{formatDate(verification.timestamp)}</p>
                  <p className="text-xs text-changi-gray">{verification.registry}</p>
                </div>
                {getStatusBadge(verification.status)}
              </div>
            </div>
          ))}
        </div>

        {recentVerifications.length === 0 && (
          <div className="text-center py-8 text-changi-gray">
            No verification records available
          </div>
        )}
      </div>
    </div>
  );
}

