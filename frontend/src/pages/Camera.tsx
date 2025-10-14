import { useState } from "react";

export default function Camera() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleLoadAndInit = () => {
    if (!scriptLoaded) {
      // Tải jQuery trước
      const jqueryScript = document.createElement("script");
      jqueryScript.src = "https://code.jquery.com/jquery-3.6.0.min.js";
      jqueryScript.async = true;

      jqueryScript.onload = () => {
        console.log("jQuery loaded successfully");
        
        // Sau đó tải API script
        const script = document.createElement("script");
        script.src =
          "https://api.1aie.com/?key=159c2d483212f618b7f3910190691675&active=aic";
        script.async = true;

        script.onload = () => {
          console.log("Script loaded successfully");
          setScriptLoaded(true);

          // Đợi một chút để script khởi tạo hoàn toàn
          setTimeout(() => {
            if (window.aie_aic) {
              console.log("Starting camera...");
              setIsCameraOpen(true);
              
              // Thử với cấu hình đơn giản hơn
              window.aie_aic("body", {
                type: "fa",
                option: {
                  confidence: 0.5,
                  draw_box: true,
                  data_uri: "https://api.1aie.com/sc/data/",
                  data_label: ["TEST"],
                  data_file: ["1.jpg"],
                  deep_scan: false,
                  max_scan: 1
                },
                brand: "test22",
                width: "100%",
                video: "all",
                exit: () => {
                  console.log("Camera closed");
                  setIsCameraOpen(false);
                }
              },
              function (res, location) {
                console.log("Result:", res);
                console.log("Location:", location);
                alert("API hoạt động! Kết quả: " + JSON.stringify(res));
              });
            } else {
              console.error("aie_aic function not found");
              alert("Không thể tải camera API!");
            }
          }, 2000); // Tăng thời gian chờ lên 2 giây
        };

        script.onerror = () => {
          console.error("Failed to load script");
          alert("Không thể tải script API!");
        };

        document.body.appendChild(script);
      };

      jqueryScript.onerror = () => {
        console.error("Failed to load jQuery");
        alert("Không thể tải jQuery!");
      };

      document.body.appendChild(jqueryScript);
    } else {
      console.log("Script already loaded");
      if (window.aie_aic) {
        console.log("Starting camera again...");
        setIsCameraOpen(true);
        
        // Thử với cấu hình đơn giản hơn
        window.aie_aic("body", {
          type: "fa",
          option: {
            confidence: 0.5,
            draw_box: true,
            data_uri: "https://api.1aie.com/sc/data/",
            data_label: ["TEST"],
            data_file: ["1.jpg"],
            deep_scan: false,
            max_scan: 1
          },
          brand: "test",
          width: "100%",
          video: "all",
          exit: () => {
            console.log("Camera closed");
            setIsCameraOpen(false);
          }
        },
        function (res, location) {
          console.log("Result:", res);
          console.log("Location:", location);
          alert("API hoạt động! Kết quả: " + JSON.stringify(res));
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            🔐 Xác thực Danh tính Trước Livestream
          </h1>
          
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-4">
              Sử dụng camera từ API 1aie.com để xác thực danh tính và phát hiện deepfake
            </p>
          </div>

          {/* Debug info */}
          <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">🔧 Debug Info:</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>Script Loaded: {scriptLoaded ? '✅' : '❌'}</p>
              <p>Camera Open: {isCameraOpen ? '✅' : '❌'}</p>
              <p>window.aie_aic: {typeof window.aie_aic !== 'undefined' ? '✅' : '❌'}</p>
              <p>jQuery: {typeof window.$ !== 'undefined' ? '✅' : '❌'}</p>
            </div>
          </div>

          {/* Container cho camera từ API */}
          <div className="mb-8">
            <div 
              className="w-full max-w-2xl mx-auto bg-gray-100 rounded-lg overflow-hidden"
              style={{ minHeight: '400px', border: '2px dashed #d1d5db' }}
            >
              {!isCameraOpen && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4">📷</div>
                    <p>Camera từ API chưa được kích hoạt</p>
                    <p className="text-sm">Nhấn nút bên dưới để bắt đầu xác thực</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nút điều khiển */}
          <div className="flex justify-center">
            <button 
              onClick={handleLoadAndInit}
              disabled={isCameraOpen}
              className={`
                px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300
                ${isCameraOpen
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                }
              `}
            >
              {isCameraOpen ? (
                <span className="flex items-center">
                  <span className="mr-2">✅</span>
                  Camera API đã kích hoạt
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="mr-2">🔐</span>
                  Bắt đầu Xác thực với Camera API
                </span>
              )}
            </button>
          </div>

          {/* Hướng dẫn sử dụng */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">📋 Hướng dẫn sử dụng Camera API:</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-700">
              <li>Nhấn &quot;Bắt đầu Xác thực với Camera API&quot; để kích hoạt camera</li>
              <li>Cho phép truy cập camera khi API yêu cầu</li>
              <li>Đặt khuôn mặt vào khung hình và làm theo hướng dẫn từ API</li>
              <li>Chờ hệ thống API xác thực danh tính và phát hiện deepfake</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
