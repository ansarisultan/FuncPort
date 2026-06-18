const StatusBadge = ({ status, label }) => {
  const statusColors = {
    connected: 'bg-green-500/20 text-green-400 border-green-500/50',
    idle: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    error: 'bg-red-500/20 text-red-400 border-red-500/50',
  }

  return (
    <div className={`px-3 py-2 rounded border text-sm flex items-center gap-2 ${statusColors[status] || statusColors.idle}`}>
      <div className={`w-2 h-2 rounded-full ${
        status === 'connected' ? 'bg-green-400' : 
        status === 'error' ? 'bg-red-400' : 
        'bg-yellow-400'
      }`}></div>
      {label}
    </div>
  )
}

export default StatusBadge
