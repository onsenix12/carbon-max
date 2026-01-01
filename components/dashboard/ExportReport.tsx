'use client';

import { Download, FileText } from 'lucide-react';
import { useRef } from 'react';

interface ExportReportProps {
  data: any;
  period: string;
  view: string;
}

export default function ExportReport({ data, period, view }: ExportReportProps) {
  const exportRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    if (!exportRef.current) return;

    // Create a print-friendly version
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Changi Airport Dashboard Report - ${view} (${period})</title>
          <style>
            @media print {
              @page { margin: 1cm; }
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              color: #0f1133;
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              border-bottom: 2px solid #2D8B4E;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #0f1133;
              margin: 0;
            }
            .header .meta {
              color: #5b5b5b;
              margin-top: 10px;
            }
            .section {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            .section h2 {
              color: #2D8B4E;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 10px;
            }
            .metrics {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin: 20px 0;
            }
            .metric {
              background: #f3efe9;
              padding: 15px;
              border-radius: 8px;
            }
            .metric-label {
              font-size: 12px;
              color: #5b5b5b;
              margin-bottom: 5px;
            }
            .metric-value {
              font-size: 24px;
              font-weight: bold;
              color: #0f1133;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
            }
            th {
              background: #f3efe9;
              font-weight: 600;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #5b5b5b;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Changi Airport Operations Dashboard</h1>
            <div class="meta">
              <p><strong>View:</strong> ${view.charAt(0).toUpperCase() + view.slice(1)}</p>
              <p><strong>Period:</strong> ${period.charAt(0).toUpperCase() + period.slice(1)}</p>
              <p><strong>Generated:</strong> ${new Date().toLocaleString('en-SG')}</p>
            </div>
          </div>
          
          ${exportRef.current.innerHTML}
          
          <div class="footer">
            <p>Changi Airport Group - Sustainability Operations Dashboard</p>
            <p>This report is generated from live operational data. For methodology details, visit the dashboard.</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <>
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 bg-changi-navy text-white rounded-lg hover:bg-changi-purple transition-colors"
        aria-label="Export dashboard report"
      >
        <Download className="w-4 h-4" />
        <span>Export Report</span>
      </button>
      
      {/* Hidden content for export */}
      <div ref={exportRef} className="hidden">
        {data && (
          <>
            <div className="section">
              <h2>Summary Metrics</h2>
              <div className="metrics">
                <div className="metric">
                  <div className="metric-label">Gross Emissions</div>
                  <div className="metric-value">{data.summary?.grossEmissions?.toFixed(1)} tCO₂e</div>
                </div>
                <div className="metric">
                  <div className="metric-label">SAF Contributed</div>
                  <div className="metric-value">{data.summary?.safContributed?.toLocaleString()} L</div>
                </div>
                <div className="metric">
                  <div className="metric-label">Net Emissions</div>
                  <div className="metric-value">{data.summary?.netEmissions?.toFixed(1)} tCO₂e</div>
                </div>
                <div className="metric">
                  <div className="metric-label">Waste Diverted</div>
                  <div className="metric-value">{data.summary?.wasteDiverted?.toFixed(1)} kg</div>
                </div>
              </div>
            </div>

            {data.safProgress && (
              <div className="section">
                <h2>SAF Progress</h2>
                <div className="metrics">
                  <div className="metric">
                    <div className="metric-label">Current Uptake</div>
                    <div className="metric-value">{data.safProgress.currentPercent?.toFixed(2)}%</div>
                  </div>
                  <div className="metric">
                    <div className="metric-label">Target (2026)</div>
                    <div className="metric-value">{data.safProgress.targetPercent}%</div>
                  </div>
                  <div className="metric">
                    <div className="metric-label">Forecast for 2026</div>
                    <div className="metric-value">{data.safProgress.forecastFor2026?.toFixed(2)}%</div>
                  </div>
                </div>
              </div>
            )}

            {data.topRoutes && data.topRoutes.length > 0 && (
              <div className="section">
                <h2>Top Routes</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Route</th>
                      <th>Emissions (tCO₂e)</th>
                      <th>SAF Coverage (%)</th>
                      <th>Passengers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topRoutes.map((route: any, i: number) => (
                      <tr key={i}>
                        <td>{route.route}</td>
                        <td>{route.emissions?.toFixed(1)}</td>
                        <td>{route.safCoverage?.toFixed(1)}</td>
                        <td>{route.passengers?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

