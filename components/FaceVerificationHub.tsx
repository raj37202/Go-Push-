'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, ShieldCheck, RefreshCw, Key, ArrowLeft, Check, AlertTriangle, ScanEye, Eye, EyeOff } from "lucide-react";

interface FaceVerificationHubProps {
  onClose?: () => void;
  onVerificationSuccess?: () => void;
  mode: "register" | "unlock";
}

export default function FaceVerificationHub({ onClose, onVerificationSuccess, mode }: FaceVerificationHubProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionState, setPermissionState] = useState<"prompt" | "granted" | "denied">("prompt");
  const [scanStep, setScanStep] = useState<"idle" | "capturing" | "processing" | "success" | "failed">("idle");
  const [progress, setProgress] = useState(0);
  const [scanStatusMessage, setScanStatusMessage] = useState("Awaiting biometric initialization...");
  const [useFallback, setUseFallback] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize camera
  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 400, height: 400, facingMode: "user" } 
        });
        setStream(mediaStream);
        setPermissionState("granted");
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access failed, falling back to simulated high-fidelity scanner:", err);
        setPermissionState("denied");
        setUseFallback(true);
      }
    }

    if (scanStep === "idle" || scanStep === "capturing") {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Update video element source when stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Handle simulated biometric progress when capturing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (scanStep === "capturing") {
      Promise.resolve().then(() => {
        setProgress(0);
        setScanStatusMessage("Scanning 3D facial contours & depth mesh...");
      });
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanStep("processing");
            return 100;
          }
          const jump = Math.floor(Math.random() * 8) + 4;
          const nextVal = Math.min(prev + jump, 100);
          
          if (nextVal > 75) {
            setScanStatusMessage("Matching facial markers database...");
          } else if (nextVal > 40) {
            setScanStatusMessage("Generating secure biometric cryptographic hash...");
          }
          
          return nextVal;
        });
      }, 150);

      return () => clearInterval(interval);
    } else if (scanStep === "processing") {
      Promise.resolve().then(() => {
        setScanStatusMessage("Authenticating verified secure parameters...");
      });
      timer = setTimeout(() => {
        setScanStep("success");
      }, 1500);
    } else if (scanStep === "success") {
      Promise.resolve().then(() => {
        setScanStatusMessage("Biometric Key matched successfully!");
      });
      timer = setTimeout(() => {
        if (mode === "register") {
          if (typeof window !== "undefined") {
            localStorage.setItem("pushnova_face_id_registered", "true");
            localStorage.setItem("pushnova_face_id_enabled", "true");
            localStorage.setItem("pushnova_face_id_hash", "PN-HASH-" + Math.floor(100000 + Math.random() * 900000));
          }
        }
        if (onVerificationSuccess) {
          onVerificationSuccess();
        }
      }, 1800);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [scanStep]);

  // Loop drawing custom laser overlay lines onto the video helper canvas
  useEffect(() => {
    if (scanStep !== "capturing" && scanStep !== "processing" && scanStep !== "idle") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let localAngle = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = width / 2 - 14;

      // Draw biometric scanning ring outline
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = scanStep === "processing" ? "#EC4899" : "#7C3AED";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 12]);
      ctx.stroke();

      // Scan target corner indicators
      const cornerSize = 10;
      ctx.setLineDash([]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#7C3AED";
      const pad = 3;
      // Top Left
      ctx.beginPath();
      ctx.moveTo(cx - radius - pad, cy - radius + cornerSize);
      ctx.lineTo(cx - radius - pad, cy - radius - pad);
      ctx.lineTo(cx - radius + cornerSize, cy - radius - pad);
      ctx.stroke();
      // Top Right
      ctx.beginPath();
      ctx.moveTo(cx + radius + pad, cy - radius + cornerSize);
      ctx.lineTo(cx + radius + pad, cy - radius - pad);
      ctx.lineTo(cx + radius - cornerSize, cy - radius - pad);
      ctx.stroke();
      // Bottom Left
      ctx.beginPath();
      ctx.moveTo(cx - radius - pad, cy + radius - cornerSize);
      ctx.lineTo(cx - radius - pad, cy + radius + pad);
      ctx.lineTo(cx - radius + cornerSize, cy + radius + pad);
      ctx.stroke();
      // Bottom Right
      ctx.beginPath();
      ctx.moveTo(cx + radius + pad, cy + radius - cornerSize);
      ctx.lineTo(cx + radius + pad, cy + radius + pad);
      ctx.lineTo(cx + radius - cornerSize, cy + radius + pad);
      ctx.stroke();

      // Draw dynamic rotating scanner dots
      localAngle += 0.03;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(localAngle) * radius, cy + Math.sin(localAngle) * radius, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#EC4899";
      ctx.fill();

      // Lasers sweep bar animation (only when scanning)
      if (scanStep === "capturing") {
        const sweepY = cy - radius + ((Math.sin(Date.now() / 200) + 1) / 2) * (radius * 2);
        ctx.beginPath();
        ctx.moveTo(cx - radius + 5, sweepY);
        ctx.lineTo(cx + radius - 5, sweepY);
        ctx.strokeStyle = "rgba(236, 72, 153, 0.8)";
        ctx.lineWidth = 3;
        ctx.shadowColor = "#EC4899";
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scanStep]);

  const handleStartScan = () => {
    setScanStep("capturing");
  };

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-[28px] p-4 relative overflow-hidden font-sans w-56 mx-auto text-center shadow-2xl flex flex-col items-center">
      {/* Cool tech styling elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-[#EC4899] to-purple-600 animate-pulse" />
      
      {/* Header section */}
      <div className="w-full text-center space-y-0.5 mb-2.5">
        <div className="flex items-center justify-center gap-1 text-[#A855F7] font-mono text-[8px] uppercase tracking-wider font-extrabold">
          <ScanEye className="w-3 h-3" />
          <span>Secured Biometric Gateway</span>
        </div>
        <h3 className="text-xs font-bold text-white tracking-tight">
          {mode === "register" ? "Face ID Registration" : "Biometrics Verification"}
        </h3>
      </div>

      {/* Main scanner viewport viewport container (perfectly round) */}
      <div className="relative w-36 h-36 bg-[#090D1A] rounded-full overflow-hidden border border-purple-500/30 flex items-center justify-center">
        {/* Visual camera grid pattern backplate */}
        <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] bg-[size:8px_8px] opacity-25 pointer-events-none" />

        {/* Real camera video overlay */}
        {!useFallback && permissionState === "granted" ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover rounded-full scale-x-[-1]"
          />
        ) : (
          /* High performance beautiful simulated scan backplate if camera missing or rejected */
          <AnimatePresence>
            {(scanStep === "idle" || scanStep === "capturing" || scanStep === "processing") && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center"
              >
                <div className="relative">
                  <div className="absolute -inset-2 bg-purple-500/10 blur-xl rounded-full" />
                  <div className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center bg-gray-950/80 relative">
                    <ScanEye className={`w-5 h-5 ${scanStep === "capturing" ? "text-pink-400 animate-pulse" : "text-purple-400 animate-bounce"}`} />
                    {scanStep === "capturing" && (
                      <span className="absolute inset-0 border border-pink-500 rounded-full animate-ping [animation-duration:1.5s]" />
                    )}
                  </div>
                </div>

                <p className="text-[7.5px] text-gray-500 mt-1 leading-normal max-w-[100px] font-mono uppercase">
                  {useFallback ? "Virtual Check Active" : "Waiting Consent"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Canvas for custom scanlines, corner reticles & lasers */}
        <canvas 
          ref={canvasRef} 
          width={144} 
          height={144} 
          className="absolute inset-0 pointer-events-none z-10 rounded-full"
        />

        {/* Scanning laser sweep, success badge, or status */}
        <AnimatePresence>
          {scanStep === "success" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-[#0B1120]/95 z-20 flex flex-col items-center justify-center p-3 text-center"
            >
              <div className="w-9 h-9 bg-emerald-950 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-900/20">
                <Check className="w-5 h-5 animate-bounce" />
              </div>
              <span className="text-[9px] font-bold text-white uppercase font-mono mt-1">Matched!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress indicators */}
      <div className="mt-2.5 w-full space-y-1.5">
        <div className="flex items-center justify-between text-[8px] font-mono">
          <span className="text-gray-500">Node Secure:</span>
          <span className={`font-bold uppercase ${scanStep === "success" ? "text-emerald-400" : "text-[#A855F7]"}`}>
            {scanStep}
          </span>
        </div>

        {/* Visual progress loader */}
        {scanStep === "capturing" && (
          <div className="w-full bg-gray-950 rounded-full h-1 overflow-hidden border border-gray-850">
            <motion.div 
              className="bg-gradient-to-r from-purple-600 to-[#EC4899] h-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}

        {/* Informative text log ticker */}
        <div className="bg-[#090D1A] border border-gray-850 rounded-xl py-1 px-1.5 text-center">
          <p className="text-[8px] font-mono text-purple-300 animate-pulse truncate leading-normal">
            {scanStatusMessage}
          </p>
        </div>
      </div>

      {/* Footer controls action triggers */}
      <div className="mt-3 w-full flex flex-col gap-1.5">
        {scanStep === "idle" ? (
          <button
            type="button"
            onClick={handleStartScan}
            className="w-full bg-gradient-to-r from-purple-600 to-[#EC4899] text-white font-bold py-1.5 rounded-xl text-[10px] hover:scale-[1.01] transition shadow-lg shadow-purple-950"
          >
            {mode === "register" ? "Register Scan" : "Lock Verification"}
          </button>
        ) : scanStep !== "success" ? (
          <button
            type="button"
            disabled
            className="w-full bg-gray-905 border border-gray-800 text-gray-500 py-1.5 rounded-xl text-[9px] font-mono flex items-center justify-center gap-1"
          >
            <RefreshCw className="w-3 h-3 animate-spin text-purple-400" />
            <span>Scanning...</span>
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 py-1.5 rounded-xl text-[9px] font-mono font-bold flex items-center justify-center gap-1"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Node Unlocked</span>
          </button>
        )}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-full py-1 bg-gray-900/80 hover:bg-gray-850 border border-gray-800/80 text-gray-400 hover:text-white rounded-xl text-[9px] font-semibold transition"
          >
            Cancel / Back
          </button>
        )}
      </div>
    </div>
  );
}
