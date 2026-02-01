import { useGlobeNavigation } from '../../hooks/useGlobeNavigation';

export const GlobeControls = () => {
  const { zoom, zoomIn, zoomOut, autoMode, toggleAutoMode } = useGlobeNavigation();

  return (
    <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 space-y-3 border border-gray-700">
      <div className="flex items-center gap-2">
        <button
          onClick={zoomOut}
          className="w-10 h-10 rounded bg-gray-800 hover:bg-gray-700 flex items-center justify-center"
          aria-label="Zoom out"
        >
          <span className="text-xl">−</span>
        </button>
        
        <div className="w-24 h-2 bg-gray-800 rounded-full relative">
          <div
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${(zoom / 3) * 100}%` }}
          />
        </div>
        
        <button
          onClick={zoomIn}
          className="w-10 h-10 rounded bg-gray-800 hover:bg-gray-700 flex items-center justify-center"
          aria-label="Zoom in"
        >
          <span className="text-xl">+</span>
        </button>
      </div>

      <button
        onClick={toggleAutoMode}
        className={`w-full py-2 px-4 rounded ${
          autoMode
            ? 'bg-blue-600 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        {autoMode ? 'Auto Mode: ON' : 'Auto Mode: OFF'}
      </button>

      <div className="text-xs text-gray-400 text-center">
        Zoom: {zoom.toFixed(1)}x
      </div>
    </div>
  );
};
