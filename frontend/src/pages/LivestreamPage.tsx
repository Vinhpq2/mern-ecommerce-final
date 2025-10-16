import { useRef, useState, useEffect } from "react";
import axios from "../lib/axios";
import { useUserStore } from "../stores/useUserStore";
import {useLanguageStore} from "../stores/useLanguageStore";
import { toast } from "react-hot-toast";
export const LivestreamPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timer | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useUserStore();
  const { t } = useLanguageStore();
  const streamRef = useRef<MediaStream | null>(null);

  // Timer
  useEffect(() => {
    if (recording) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setSeconds(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [recording]);

  // Start recording
  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Camera not supported!");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    streamRef.current = stream;
    if (videoRef.current) videoRef.current.srcObject = stream;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setVideoChunks(chunks);
      const url = URL.createObjectURL(blob);
      setPreviewVideo(url);

      // Stop camera stream
      stream.getTracks().forEach((track) => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      streamRef.current = null;
    };

    mediaRecorder.start();
    setRecording(true);
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // Toggle mic
  const toggleMic = () => { 
    if (!streamRef.current) return;
    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setMicOn(audioTrack.enabled);
  };

  // Upload video
  const uploadVideo = async () => {
    if (!videoChunks.length || !title.trim()) {
      alert(t.missingTitle);
      return;
    }

    const blob = new Blob(videoChunks, { type: "video/webm" });
    const formData = new FormData();
    formData.append("video", blob);
    formData.append("userId", user?._id || "unknown");
    formData.append("title", title || "title");
    formData.append("description", description || "description");

    try {
      const res = await axios.post("/video/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload success:", res.data);
      setPreviewVideo(null);
      setVideoChunks([]);
      setTitle("");
      setDescription("");
      toast.success(t.uploadSuccess);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Discard video
  const discardVideo = () => {
    if (confirm(t.alertDiscardVideo)) {
      setPreviewVideo(null);
      setVideoChunks([]);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-4">{t.liveStreamTitle}</h1>
      <p className="mb-4 text-lg">
        {t.liveStreamTime}: {Math.floor(seconds / 60)}:{("0" + (seconds % 60)).slice(-2)}
      </p>

      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-[800px] h-[600px] bg-black mb-4"
      ></video>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={startRecording}
          disabled={recording}
          className="px-4 py-2 bg-green-600 rounded"
        >
          {t.startRecord}
        </button>
        <button
          onClick={stopRecording}
          disabled={!recording}
          className="px-4 py-2 bg-red-600 rounded"
        >
          {t.stopRecord}
        </button>
        <button
          onClick={toggleMic}
          className={`px-4 py-2 rounded ${micOn ? "bg-green-500" : "bg-red-500"}`}
        >
          {micOn ? t.micOn : t.micOff}
        </button>
      </div>

      {/* Modal preview */}
      {previewVideo && (
        <div className="fixed inset-0 bg-black  flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex flex-col items-center space-y-4 w-[650px]">
            <h2 className="text-2xl font-bold mb-2 text-black">🎬 {t.previewVideo}</h2>
            <video src={previewVideo} controls className="w-full h-[400px] bg-black mb-2"></video>

            <input
              type="text"
              placeholder={t.titleVideo}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded text-black"
            />
            <textarea
              placeholder={t.descriptionVideo}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded text-black"
            ></textarea>

            <div className="flex space-x-4">
  <button
    onClick={uploadVideo}
    className="px-4 py-2 bg-blue-600 rounded transition transform hover:bg-blue-500 hover:scale-105"
  >
    {t.uploadVideo}
  </button>
  <button
    onClick={discardVideo}
    className="px-4 py-2 bg-gray-500 rounded transition transform hover:bg-gray-400 hover:scale-105"
  >
    {t.discardVideo}
  </button>
</div>

          </div>
        </div>
      )}
    </div>
  );
};

export default LivestreamPage;
