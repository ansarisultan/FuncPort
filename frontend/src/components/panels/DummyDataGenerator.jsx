import { Download, RefreshCw, Copy, Check, Database } from 'lucide-react';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';
import { useState } from 'react';

export function DummyDataGeneratorConfig() {
  const {
    generatorType, setGeneratorType,
    generatorFormat, setGeneratorFormat,
    generatorCount, setGeneratorCount,
    generatorData, setGeneratorData
  } = useStore();

  const [copied, setCopied] = useState(false);

  // Generate data logic
  const generateData = () => {
    let dataList = [];
    
    // Sample arrays for randomized generation
    const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'];
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'funclexa.com', 'example.com', 'company.org'];
    const roles = ['Admin', 'Developer', 'User', 'Manager', 'Analyst', 'Guest'];
    const statuses = ['Active', 'Inactive', 'Suspended', 'Pending'];
    const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'India', 'Japan', 'Australia', 'Brazil'];
    
    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Automotive'];
    const productNames = {
      Electronics: ['Smartphone X', 'Noise-Canceling Headphones', 'Smart Watch Pro', 'Ultra-Wide Monitor', 'Wireless Charger'],
      Clothing: ['Classic Leather Jacket', 'Premium Cotton Tee', 'Running Shoes', 'Slim Fit Denim', 'Wool Blend Scarf'],
      'Home & Kitchen': ['Air Fryer XL', 'Espresso Machine', 'Robot Vacuum', 'Non-Stick Cookware Set', 'Memory Foam Pillow'],
      Books: ['The Coding Paradigm', 'Architecture Patterns', 'History of Computers', 'Data Science Blueprint', 'UX/UI Foundations'],
      Sports: ['Yoga Mat', 'Adjustable Dumbbells', 'Waterproof Tent', 'Mountain Bicycle', 'Tennis Racket'],
      Beauty: ['Moisturizing Cream', 'Organic Shampoo', 'Sunscreen SPF 50', 'Matte Lipstick', 'Facial Cleanser'],
      Automotive: ['Car Dash Cam', 'Portable Air Compressor', 'LED Headlights', 'Leather Seat Covers', 'GPS Tracker']
    };

    const logMessages = [
      'Database connection established successfully',
      'Failed to resolve API gateway endpoint',
      'User login request authenticated',
      'Resource utilization exceeded warning limit',
      'Background sync worker successfully completed batch job',
      'Unauthorized request token rejected',
      'Timeout reached waiting for downstream microservice response',
      'File asset uploaded successfully to S3 bucket'
    ];
    const logLevels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
    const services = ['auth-service', 'payment-gateway', 'proxy-router', 'user-database', 'notification-engine'];

    const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'FTP', 'SSH'];

    for (let i = 1; i <= generatorCount; i++) {
      if (generatorType === 'users') {
        const first = firstNames[Math.floor(Math.random() * firstNames.length)];
        const last = lastNames[Math.floor(Math.random() * lastNames.length)];
        const email = `${first.toLowerCase()}.${last.toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]}`;
        dataList.push({
          id: i,
          name: `${first} ${last}`,
          email,
          role: roles[Math.floor(Math.random() * roles.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          country: countries[Math.floor(Math.random() * countries.length)],
        });
      } else if (generatorType === 'products') {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const names = productNames[category];
        const name = names[Math.floor(Math.random() * names.length)];
        dataList.push({
          id: 1000 + i,
          title: name,
          price: parseFloat((15 + Math.random() * 980).toFixed(2)),
          category,
          stock: Math.floor(Math.random() * 500) + 5,
          rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
        });
      } else if (generatorType === 'logs') {
        const level = logLevels[Math.floor(Math.random() * logLevels.length)];
        let status = 200;
        if (level === 'ERROR') {
          status = [400, 401, 403, 404, 500, 503][Math.floor(Math.random() * 6)];
        } else if (level === 'WARN') {
          status = 429;
        }
        dataList.push({
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
          level,
          service: services[Math.floor(Math.random() * services.length)],
          message: logMessages[Math.floor(Math.random() * logMessages.length)],
          latency_ms: Math.floor(20 + Math.random() * 800),
          status_code: status
        });
      } else if (generatorType === 'traffic') {
        dataList.push({
          id: `flow-${Math.floor(Math.random() * 100000)}`,
          source_ip: `10.0.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 254) + 1}`,
          destination_ip: `10.0.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 254) + 1}`,
          protocol: protocols[Math.floor(Math.random() * protocols.length)],
          port: [80, 443, 22, 8080, 5432, 27017][Math.floor(Math.random() * 6)],
          bytes_sent: Math.floor(500 + Math.random() * 10000000),
          duration_ms: Math.floor(10 + Math.random() * 5000),
        });
      }
    }

    if (generatorFormat === 'json') {
      setGeneratorData(JSON.stringify(dataList, null, 2));
    } else {
      const headers = Object.keys(dataList[0]);
      const csvRows = [headers.join(',')];
      for (const row of dataList) {
        const values = headers.map(header => {
          const val = row[header];
          if (typeof val === 'string') {
            const escaped = val.replace(/"/g, '""');
            return escaped.includes(',') || escaped.includes('\n') || escaped.includes('"') 
              ? `"${escaped}"` 
              : escaped;
          }
          return val;
        });
        csvRows.push(values.join(','));
      }
      setGeneratorData(csvRows.join('\n'));
    }
    toast.success(`Generated ${generatorCount} dummy ${generatorType} records!`);
  };

  const handleDownload = () => {
    if (!generatorData) return;
    const blob = new Blob([generatorData], { type: generatorFormat === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dummy_${generatorType}_data.${generatorFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File download started successfully!');
  };

  const handleCopy = () => {
    if (!generatorData) return;
    navigator.clipboard.writeText(generatorData);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate automatically if there is nothing currently
  if (!generatorData) {
    generateData();
  }

  return (
    <div className="panel-3d p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-[#1E293B]/60 pb-2">
        <Database className="w-4 h-4 text-[#06B6D4]" />
        <h4 className="text-sm font-semibold text-white">Generator Setup</h4>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider font-semibold">Data Schema</label>
          <select
            value={generatorType}
            onChange={(e) => setGeneratorType(e.target.value)}
            className="input-premium w-full text-xs"
          >
            <option value="users">User Profiles</option>
            <option value="products">Product Catalog</option>
            <option value="logs">Server Logs</option>
            <option value="traffic">Network Flows</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider font-semibold">Output Format</label>
          <select
            value={generatorFormat}
            onChange={(e) => setGeneratorFormat(e.target.value)}
            className="input-premium w-full text-xs"
          >
            <option value="json">JSON Array</option>
            <option value="csv">CSV (Comma Separated)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider font-semibold">Record Count</label>
          <select
            value={generatorCount}
            onChange={(e) => setGeneratorCount(parseInt(e.target.value))}
            className="input-premium w-full text-xs"
          >
            <option value="10">10 Rows</option>
            <option value="50">50 Rows</option>
            <option value="100">100 Rows</option>
            <option value="500">500 Rows</option>
            <option value="1000">1000 Rows</option>
          </select>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-[#1E293B]/60">
        <button
          onClick={generateData}
          className="w-full btn-3d text-xs py-2 flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Generate Schema
        </button>

        <button
          onClick={handleDownload}
          disabled={!generatorData}
          className="w-full btn-3d text-xs py-2 flex items-center justify-center gap-2 bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20 hover:bg-[#22C55E]/20 disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5 text-[#22C55E]" />
          Download Data File
        </button>

        <button
          onClick={handleCopy}
          disabled={!generatorData}
          className="w-full btn-3d text-xs py-2 flex items-center justify-center gap-2 bg-white/5 border-white/5 hover:bg-white/10 disabled:opacity-50"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
          Copy Clipboard
        </button>
      </div>
    </div>
  );
}

export function DummyDataGeneratorPreview() {
  const { generatorFormat, generatorData } = useStore();

  return (
    <div className="panel-3d p-6 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#1E293B]/60 pb-2 mb-3">
        <h4 className="text-sm font-semibold text-white">Schema Preview</h4>
        <span className="text-[10px] text-[#06B6D4] font-mono font-semibold uppercase">{generatorFormat}</span>
      </div>
      <div className="flex-1 min-h-0 bg-[#050816]/70 rounded-lg border border-[#1E293B]/40 overflow-hidden flex flex-col">
        <textarea
          readOnly
          value={generatorData || '// Click "Generate Schema" in setup to view dummy data'}
          className="w-full flex-1 p-3 bg-transparent font-mono text-xs text-slate-300 resize-none outline-none leading-relaxed overflow-y-auto"
        />
      </div>
    </div>
  );
}
