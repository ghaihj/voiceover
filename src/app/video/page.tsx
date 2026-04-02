export default function video() {
  return (
    <div>
      <video
        loop
        // Required for autoplay in most browsers
        playsInline // Required for iOS
        controls // Optional: adds play/pause controls
      >
        <source src="/video_2026-03-09_17-22-18.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
