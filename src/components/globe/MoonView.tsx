import { motion } from 'framer-motion';

export const MoonView = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      <motion.div
        className="relative"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="w-96 h-96 rounded-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 relative shadow-2xl">
          {/* Moon craters */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute top-20 left-20 w-16 h-16 rounded-full bg-gray-400/30 blur-sm" />
            <div className="absolute top-32 right-24 w-12 h-12 rounded-full bg-gray-500/30 blur-sm" />
            <div className="absolute bottom-24 left-32 w-20 h-20 rounded-full bg-gray-400/20 blur-sm" />
            <div className="absolute bottom-32 right-20 w-14 h-14 rounded-full bg-gray-500/30 blur-sm" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gray-400/20 blur-md" />
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl" />
        </div>

        {/* Stars background */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <h2 className="text-2xl font-bold mb-2">OpenMoonMic</h2>
        <p className="text-gray-400">Zoom in to see live users</p>
      </div>
    </div>
  );
};
