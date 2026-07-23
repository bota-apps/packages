/**
 * One-frame screen capture over the native Screen Capture API.
 *
 * Deliberately not a DOM-rasterization library (html2canvas & co): those
 * re-implement CSS painting and fail on modern color functions (oklch),
 * cross-origin images, and canvas/WebGL content. `getDisplayMedia` hands back
 * real compositor pixels, and its built-in picker lets the user choose the
 * current tab, another window, or a whole screen — which doubles as the
 * consent step.
 */

type DisplayMediaVideoConstraints = MediaTrackConstraints & {
  /** Hint the picker toward tab capture where supported. */
  displaySurface?: "browser" | "window" | "monitor";
};

type DisplayMediaOptions = {
  video?: DisplayMediaVideoConstraints | boolean;
  audio?: boolean;
  /** Chromium: preselect the calling tab in the picker. */
  preferCurrentTab?: boolean;
};

type DisplayMediaDevices = MediaDevices & {
  getDisplayMedia(options?: DisplayMediaOptions): Promise<MediaStream>;
};

export function isScreenCaptureSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    navigator.mediaDevices !== undefined &&
    "getDisplayMedia" in navigator.mediaDevices
  );
}

/**
 * Prompts the user to pick a surface and resolves with a single PNG frame of
 * it, or `null` when the user dismisses the picker. The stream stops as soon
 * as the frame is grabbed — no ongoing recording.
 */
export async function captureScreenFrame(fileName: string): Promise<File | null> {
  const mediaDevices: DisplayMediaDevices = navigator.mediaDevices;
  let stream: MediaStream;
  try {
    stream = await mediaDevices.getDisplayMedia({
      video: { displaySurface: "browser" },
      audio: false,
      preferCurrentTab: true,
    });
  } catch (error) {
    // Dismissing the picker is a normal outcome, not an error.
    if (
      error instanceof DOMException &&
      (error.name === "NotAllowedError" || error.name === "AbortError")
    ) {
      return null;
    }
    throw error;
  }

  try {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.muted = true;
    await video.play();
    // One paint tick so the first frame is decoded before we sample it.
    await new Promise(requestAnimationFrame);
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (context === null) {
      throw new Error("Canvas 2D context unavailable");
    }
    context.drawImage(video, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (blob === null) {
      throw new Error("Could not encode the captured frame");
    }
    return new File([blob], fileName, { type: "image/png" });
  } finally {
    for (const track of stream.getTracks()) {
      track.stop();
    }
  }
}
