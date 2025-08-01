import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";
import { v4 as uuidv4 } from "uuid";

export default function ImageCropperModal({ imageSrc, visible, onClose, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleDone = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    const file = new File([croppedImage], `${uuidv4()}.jpeg`, {
      type: "image/jpeg",
    });
    onCropComplete(file);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 px-4">
      <div className="relative w-full max-w-md bg-base-100 rounded-xl p-4 shadow-2xl">
        {/* Cropper with fixed 4:3 ratio */}
        <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            cropShape="rect"
            showGrid={false}
          />
        </div>

        {/* Zoom Slider (hidden on mobile) */}
        <div className="hidden sm:block mt-4">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="range range-primary"
          />
          <div className="flex justify-between text-xs px-1 text-base-content/70">
            <span>Zoom: {zoom.toFixed(1)}x</span>
            <span>Max: 3x</span>
          </div>
        </div>

        <p className="block sm:hidden text-center text-sm text-base-content/60 mt-2">
          Pinch with two fingers to zoom
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button className="btn btn-outline btn-error" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleDone}>Crop & Save</button>
        </div>
      </div>
    </div>
  );
}
