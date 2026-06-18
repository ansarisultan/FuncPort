const Terminal = ({ data }) => {
  return (
    <div className="font-mono text-xs text-slate-300 max-h-64 overflow-y-auto">
      {data && data.length > 0 ? (
        data.map((entry, index) => (
          <div key={index} className="py-1 border-b border-slate-800 last:border-0">
            <span className="text-green-400">&gt;</span>
            <span className="ml-2">
              {typeof entry === 'string'
                ? entry
                : JSON.stringify(entry).slice(0, 100) + '...'}
            </span>
          </div>
        ))
      ) : (
        <div className="text-slate-500">No data captured yet...</div>
      )}
    </div>
  )
}

export default Terminal
