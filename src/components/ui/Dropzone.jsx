import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import clsx from "clsx";

export default function Dropzone({ preview, onFile }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  function handleFiles(files) {
    const file = files?.[0];
    if (file) onFile(file);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={clsx(
          "flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed px-6 py-8 text-center transition-colors duration-200",
          dragOver ? "border-teal bg-teal-light/40" : "border-mist bg-paper hover:border-teal/50"
        )}
      >
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Profile preview" className="h-20 w-20 rounded-full object-cover" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFile(null);
              }}
              aria-label="Remove photo"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-paper"
            >
              <X size={12} strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud size={22} strokeWidth={1.5} className="text-slate" />
            <p className="text-sm text-slate">
              <span className="font-medium text-teal">Upload a photo</span> or drag and drop
            </p>
            <p className="text-xs text-slate/70">Optional — PNG or JPG</p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
