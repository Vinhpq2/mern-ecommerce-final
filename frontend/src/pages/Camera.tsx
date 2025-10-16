// 📁 Camera.tsx
import { useState } from "react";

// 👇 Khai báo global type cho aie_aic
declare global {
  interface Window {
    aie_aic?: (
      selector: string,
      config: Record<string, string>,
      callback: (res: string, location: string) => void,
      exit : () => void
    ) => void;
    $?: string; // jQuery
  }
}

export default function Camera() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Hàm load script động
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

  // Hàm khởi chạy camera API
  const startCamera = () => {
    if (window?.aie_aic) {
      console.log("✅ aie_aic found, starting camera...");
      setIsCameraOpen(true);

      window.aie_aic(
        "body",
        {
          type: "fa",
          option: {
            confidence: 0.5,
            draw_box: true,
            data_uri: "https://api.1aie.com/sc/data/",
            data_label: ["TEST"],
            data_file: ["1.jpg"],
            deep_scan: false,
            max_scan: 1,
          },
          brand: "test-react",
          width: "100%",
          video: "all",
          exit: () => {
            console.log("Camera closed");
            setIsCameraOpen(false);
          },
        },
        (res, location) => {
          console.log("Result:", res);
          console.log("Location:", location);
          alert("API hoạt động! Kết quả: " + JSON.stringify(res));
        }
      );
    } else {
      console.error("❌ aie_aic not found");
      alert("Không thể khởi chạy camera API!");
    }
  };

  // Hàm tải script và khởi động camera
  const handleLoadAndInit = async () => {
    if (!scriptLoaded) {
      try {
        // 1️⃣ Load jQuery trước
        await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
        console.log("jQuery loaded ✅");

        // 2️⃣ Sau đó load API
        await loadScript(
          "https://api.1aie.com/?key=159c2d483212f618b7f3910190691675&active=aic"
        );
        console.log("API script loaded ✅");

        setScriptLoaded(true);
        startCamera();
      } catch (error) {
        console.error("Failed to load scripts ❌", error);
        alert("Không thể tải script cần thiết!");
      }
    } else {
      startCamera();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            🔐 Xác thực Danh tính với Camera API
          </h1>

          {/* Thông tin debug */}
          <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">🧠 Trạng thái:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>Script Loaded: {scriptLoaded ? "✅" : "❌"}</li>
              <li>Camera Open: {isCameraOpen ? "✅" : "❌"}</li>
              <li>
                window.aie_aic:{" "}
                {typeof window.aie_aic !== "undefined" ? "✅" : "❌"}
              </li>
              <li>jQuery: {typeof window.$ !== "undefined" ? "✅" : "❌"}</li>
            </ul>
          </div>

          {/* Vùng chứa camera */}
          <div className="mb-6 border-2 border-dashed border-gray-300 rounded-lg h-[400px] flex items-center justify-center bg-gray-100">
            {!isCameraOpen && (
              <div className="text-center text-gray-500">
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
              className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
                isCameraOpen
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              {isCameraOpen
                ? "✅ Camera API đã kích hoạt"
                : "🔐 Bắt đầu Xác thực"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
