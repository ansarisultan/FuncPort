const GlassPanel = ({ title, children }) => {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/[0.12] transition-colors">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">{title}</h3>
      {children}
    </div>
  )
}

export default GlassPanel
