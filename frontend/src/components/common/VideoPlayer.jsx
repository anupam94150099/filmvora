import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Tv,
  Loader2,
  Server,
} from "lucide-react";

const defaultStreamingMirrors = [
  { name: "⚡ High-Speed CDN", url: "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4", type: "video" },
  { name: "🎬 4K Cinema Stream", url: "https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4", type: "video" },
  { name: "🔄 Backup Mirror", url: "https://archive.org/download/Sintel/sintel-2048-surround.mp4", type: "video" },
];

const VideoPlayer = ({ src, poster, title, mirrors }) => {
  const activeMirrors = mirrors && mirrors.length > 0 ? mirrors : defaultStreamingMirrors;
  const [currentMirror, setCurrentMirror] = useState(activeMirrors[0]);
  const [currentSrc, setCurrentSrc] = useState(src || activeMirrors[0]?.url);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showServerMenu, setShowServerMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEmbed = currentMirror?.type === "embed" || (currentSrc && (currentSrc.includes("embed") || currentSrc.includes("vidsrc") || currentSrc.includes("multiembed")));

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    if (mirrors && mirrors.length > 0) {
      setCurrentMirror(mirrors[0]);
      setCurrentSrc(mirrors[0].url);
    } else if (src) {
      setCurrentSrc(src);
    }
  }, [src, mirrors]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.warn("Play error:", e);
          setIsPlaying(false);
        });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds === Infinity) return "00:00";
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    if (videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      if (duration > 0) {
        setBuffered((bufferedEnd / duration) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsLoading(false);
  };

  const handleSeek = (e) => {
    if (!videoRef.current || !duration) return;
    const seekTime = (Number(e.target.value) / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const skipTime = (seconds) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume > 0 ? volume : 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleSpeedChange = (speed) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackRate(speed);
    setShowSettings(false);
  };

  const switchServer = (url) => {
    setCurrentSrc(url);
    setShowServerMenu(false);
    setIsLoading(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
      setIsLoading(false);
    }, 200);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.error("PiP error:", err);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSettings(false);
        setShowServerMenu(false);
      }, 3500);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.code === "Space" || e.key === "k") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "f") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "m") {
        e.preventDefault();
        toggleMute();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        skipTime(10);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        skipTime(-10);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay]);

  if (isEmbed) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {/* Streaming Server Switcher Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "var(--bg-card)",
            padding: "0.6rem 1rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700 }}>
            <Server size={14} color="var(--primary)" /> STREAMING MIRRORS:
          </span>
          {activeMirrors.map((m, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentMirror(m);
                setCurrentSrc(m.url);
              }}
              className={`btn btn-sm ${currentSrc === m.url ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem" }}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Responsive iFrame Player */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            background: "#000",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            boxShadow: "0 20px 50px rgba(0,0,0,0.9)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <iframe
            src={currentSrc}
            title={title || "FILMVORA Stream Player"}
            style={{ width: "100%", height: "100%", border: "none" }}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        background: "#000",
        borderRadius: isFullscreen ? 0 : "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(0,0,0,0.9)",
        border: "1px solid var(--border-subtle)",
        cursor: showControls ? "default" : "none",
      }}
    >
      {/* Native Direct HTML5 Video */}
      <video
        ref={videoRef}
        src={currentSrc}
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
          background: "#000",
        }}
        playsInline
      />

      {/* Buffering Loader Spinner */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.4)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <Loader2 size={48} className="animate-spin" color="var(--primary)" />
        </div>
      )}

      {/* Big Center Play Overlay (when paused) */}
      {!isPlaying && !isLoading && (
        <div
          onClick={togglePlay}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.4)",
            cursor: "pointer",
            zIndex: 5,
          }}
        >
          <div
            style={{
              width: "76px",
              height: "76px",
              borderRadius: "50%",
              background: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 35px rgba(229,9,20,0.85)",
              transition: "transform 0.2s ease",
            }}
          >
            <Play size={34} fill="#fff" color="#fff" style={{ marginLeft: "4px" }} />
          </div>
        </div>
      )}

      {/* Top Header info */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "1.25rem 1.75rem",
          background: "linear-gradient(180deg, rgba(0,0,0,0.85) 0%, transparent 100%)",
          opacity: showControls ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: showControls ? "auto" : "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 20,
        }}
      >
        <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
          {title}
        </span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <span className="badge badge-red">4K ULTRA HD</span>
          <span className="badge badge-glass">NATIVE STREAM</span>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "2.5rem 1.5rem 1rem",
          background: "linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)",
          opacity: showControls ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: showControls ? "auto" : "none",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          zIndex: 20,
        }}
      >
        {/* Progress Bar with Buffered Fill */}
        <div style={{ position: "relative", width: "100%", height: "6px", display: "flex", alignItems: "center" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "3px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: `${buffered}%`,
              background: "rgba(255, 255, 255, 0.4)",
              borderRadius: "3px",
              transition: "width 0.2s ease",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              background: "var(--primary)",
              borderRadius: "3px",
            }}
          />
          <input
            type="range"
            min={0}
            max={100}
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleSeek}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
              margin: 0,
            }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex-between">
          {/* Left Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={togglePlay}
              className="btn-icon"
              style={{ background: "transparent", color: "#fff" }}
              title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            >
              {isPlaying ? <Pause size={22} fill="#fff" /> : <Play size={22} fill="#fff" />}
            </button>

            <button
              onClick={() => skipTime(-10)}
              className="btn-icon"
              style={{ background: "transparent", color: "#fff" }}
              title="Rewind 10s"
            >
              <RotateCcw size={18} />
            </button>

            <button
              onClick={() => skipTime(10)}
              className="btn-icon"
              style={{ background: "transparent", color: "#fff" }}
              title="Forward 10s"
            >
              <RotateCw size={18} />
            </button>

            {/* Volume Control */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <button
                onClick={toggleMute}
                className="btn-icon"
                style={{ background: "transparent", color: "#fff" }}
                title={isMuted ? "Unmute (M)" : "Mute (M)"}
              >
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                style={{
                  width: "70px",
                  accentColor: "var(--primary)",
                  cursor: "pointer",
                  height: "4px",
                }}
              />
            </div>

            {/* Time Display */}
            <span style={{ fontSize: "0.85rem", color: "#e2e8f0", fontWeight: 500 }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", position: "relative" }}>
            {/* Stream Mirror Switcher */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowServerMenu((p) => !p)}
                className="btn-icon"
                style={{
                  background: showServerMenu ? "rgba(255,255,255,0.2)" : "transparent",
                  color: "#fff",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  width: "auto",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
                title="Change Streaming Mirror"
              >
                <Server size={14} />
                <span>Stream Mirror</span>
              </button>

              {showServerMenu && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "45px",
                    right: 0,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem",
                    minWidth: "190px",
                    boxShadow: "var(--shadow-lg)",
                    zIndex: 30,
                  }}
                >
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", padding: "0.2rem 0.5rem" }}>
                    Select Fast CDN Mirror
                  </span>
                  {streamingMirrors.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => switchServer(m.url)}
                      style={{
                        padding: "0.4rem 0.6rem",
                        textAlign: "left",
                        fontSize: "0.8rem",
                        borderRadius: "var(--radius-xs)",
                        background: currentSrc === m.url ? "var(--primary)" : "transparent",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Playback Speed */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowSettings((prev) => !prev)}
                className="btn-icon"
                style={{
                  background: showSettings ? "rgba(255,255,255,0.2)" : "transparent",
                  color: "#fff",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  width: "auto",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "var(--radius-sm)",
                }}
                title="Playback Speed"
              >
                <span>{playbackRate}x</span>
              </button>

              {showSettings && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "45px",
                    right: 0,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                    minWidth: "110px",
                    boxShadow: "var(--shadow-md)",
                    zIndex: 30,
                  }}
                >
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", padding: "0.2rem 0.5rem" }}>
                    Playback Speed
                  </span>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      style={{
                        padding: "0.35rem 0.6rem",
                        textAlign: "left",
                        fontSize: "0.85rem",
                        borderRadius: "var(--radius-xs)",
                        background: playbackRate === speed ? "var(--primary)" : "transparent",
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      {speed === 1 ? "1x (Normal)" : `${speed}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={togglePiP}
              className="btn-icon"
              style={{ background: "transparent", color: "#fff" }}
              title="Picture in Picture"
            >
              <Tv size={19} />
            </button>

            <button
              onClick={toggleFullscreen}
              className="btn-icon"
              style={{ background: "transparent", color: "#fff" }}
              title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
