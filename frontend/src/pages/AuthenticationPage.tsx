import { useState, useEffect } from "react";

// 👇 Khai báo global type cho API aie_aic
declare global {
  interface Window {
    aie_aic?: (
      selector: string,
      config: {
        type: string;
        option: {
          confidence: number;
          draw_box: boolean;
          data_uri: string;
          data_label: string[];
          data_file: string[];
          deep_scan: boolean;
          deep_scan_button?: boolean;
          max_scan: number;
          block_time?: number;
          liveness_block_time?: number;
          scan_level?: number;
          kyc?: { collect?: "manual" | "auto" | "false" };
          scan_speed?: number;
          reset_time?: number;
        };
        brand: string;
        width: string;
        video: string;
        mirror?: boolean;
        ratio?: number;
        mode?: boolean;
        border?: boolean;
        control?: boolean;
        torch?: boolean;
        zoom?: { start: number; step: number };
        exit: boolean | (() => void);
        location?: boolean;
        align?: string;
        opacity?: number;
        opacity_bg?: string;
        zindex?: number;
        lang?: { show: boolean; set: "en" | "vi" };
      },
      callback?: (res: string, location: string) => void
    ) => void;

    $?: string;
  }
}

export default function CameraAuthentication() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // 🧠 Hàm load script động
  const loadScript = (src: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });
  };

  // 🧹 Hàm dừng tất cả camera stream
  const stopAllCameras = () => {
    const videos = document.querySelectorAll("video");
    videos.forEach((video: any) => {
      if (video.srcObject) {
        const tracks = (video.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    });
    console.log("🛑 Camera stopped completely");
  };

  // 🚀 Hàm khởi động camera
  const startCamera = () => {
    if (isCameraOpen) {
      console.warn("⚠️ Camera already open. Skipping re-init.");
      return;
    }

    if (!window?.aie_aic) {
      console.error("❌ aie_aic not found!");
      alert("Không thể khởi chạy camera API!");
      return;
    }

    console.log("✅ aie_aic found, starting camera...");
    setIsCameraOpen(true);

    // ✅ Gọi API camera
    window.aie_aic(
      "body",
      {
        type: "fa",
        option: {
          confidence: 0.5,
          draw_box: true,
          data_uri: "https://api.1aie.com/sc/data/",
          data_label: ["ELON MUSH", "TRUMP", "MARK ZB"],
          data_file: ["1.jpg"],
          deep_scan: true,
          deep_scan_button: true,
          max_scan: 0,
          block_time: 10,
          liveness_block_time: 5,
          scan_level: 0.45,
          kyc: { collect: "manual" },
          scan_speed: 0,
          reset_time: 30,
        },
        brand: "default",
        width: "100%",
        video: "all",
        mirror: false,
        ratio: 0,
        mode: true,
        border: false,
        control: true,
        torch: true,
        zoom: { start: 1, step: 0.5 },

        // 🧩 Hàm thoát camera
        exit: () => {
          console.log("Camera exited");
          stopAllCameras();
          setIsCameraOpen(false);
          window.location.href = "/success";
        },

        location: true,
        align: "top",
        opacity: 1,
        opacity_bg: "#222",
        zindex: 1999999999,
        lang: { show: true, set: "en" },
      },
      (res, location) => {
        console.log("✅ Result:", res);
        console.log("📍 Location:", location);
        stopAllCameras();
        setIsCameraOpen(false);
        // window.location.href = "/success";
      }
    );

    // ⏱️ Tự động tắt camera sau 2 phút nếu vẫn mở
    setTimeout(() => {
      if (isCameraOpen) {
        console.log("⏰ 2 phút trôi qua - tự động tắt camera!");
        stopAllCameras();
        setIsCameraOpen(false);
        // window.location.href = "/livestream";
      }
    }, 2 * 60 * 1000);
  };

  // 🧩 Hàm tải script và khởi chạy camera
  const handleLoadAndInit = async () => {
    if (!scriptLoaded) {
      try {
        await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
        console.log("✅ jQuery loaded");

        await loadScript(
          "https://api.1aie.com/?key=59cde78504be0739fd21450bfc55363c&active=cross-domain-features"
        );
        console.log("✅ aie_aic script loaded");

        setScriptLoaded(true);
        startCamera();
      } catch (error) {
        console.error("❌ Failed to load scripts", error);
        alert("Không thể tải script cần thiết!");
      }
    } else {
      startCamera();
    }
  };

  // 🧹 Cleanup khi rời khỏi trang (unmount)
  useEffect(() => {
    return () => {
      console.log("🧹 Cleanup on unmount");
      stopAllCameras();
    };
  }, []);

  // ===================== JSX =====================
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden py-8">
      {/* Nền gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4">
        <div className="bg-gray-800/70 rounded-lg shadow-lg p-8 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-center text-green-400 mb-8">
            🔐 Xác thực Danh tính với Camera API
          </h1>

          {/* Debug info */}
          <div className="mb-6 bg-gray-700/50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-300 mb-2">🧠 Trạng thái:</h3>
            <ul className="text-sm text-white/80 space-y-1">
              <li>Script Loaded: {scriptLoaded ? "✅" : "❌"}</li>
              <li>Camera Open: {isCameraOpen ? "✅" : "❌"}</li>
              <li>window.aie_aic: {typeof window.aie_aic !== "undefined" ? "✅" : "❌"}</li>
              <li>jQuery: {typeof window.$ !== "undefined" ? "✅" : "❌"}</li>
            </ul>
          </div>

          {/* Khung hiển thị camera */}
          <div className="mb-6 border-2 border-dashed border-green-500 rounded-lg h-[400px] flex items-center justify-center bg-gray-700/40">
            {!isCameraOpen && (
              <div className="text-center text-white/70">
                <div className="text-6xl mb-2">📷</div>
                <p>Camera chưa được kích hoạt</p>
              </div>
            )}
          </div>

          {/* Nút kích hoạt */}
          <div className="text-center">
            <button
              onClick={handleLoadAndInit}
              disabled={isCameraOpen}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                isCameraOpen
                  ? "bg-gray-600 cursor-not-allowed text-white"
                  : "bg-green-500 hover:bg-green-600 shadow-md hover:shadow-lg text-white"
              }`}
            >
              {isCameraOpen ? "✅ Camera API đã kích hoạt" : "🔐 Bắt đầu Xác thực"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
