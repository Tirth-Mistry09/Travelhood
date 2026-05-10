const Loader = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="relative w-16 h-16 mb-4">
      <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
    </div>
    <p className="text-white/50 text-sm">{text}</p>
  </div>
);

export default Loader;