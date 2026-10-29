/* ════════════════════════════════════════════════════════════════
   THIỆP CƯỚI ONLINE — Cấu hình & tương tác
   ════════════════════════════════════════════════════════════════ */

/* ┌──────────────────────────────────────────────────────────────┐
   │  👇 CHỈNH SỬA CÁC THÔNG TIN QUAN TRỌNG Ở ĐÂY                   │
   └──────────────────────────────────────────────────────────────┘ */
const CONFIG = {
  // Ngày & giờ cưới — dùng cho đồng hồ đếm ngược
  // Định dạng: "NĂM-THÁNG-NGÀYTGiờ:Phút:Giây"
  weddingDate: "2026-11-14T18:00:00",

  // Nơi nhận xác nhận tham dự (RSVP) — lưu vào Google Sheet.
  // Dán "URL ứng dụng web" của Google Apps Script vào đây (kết thúc bằng /exec).
  //   Ví dụ: "https://script.google.com/macros/s/AKfycb.../exec"
  // Hướng dẫn: xem README.md, mục "Lưu xác nhận vào Google Sheet".
  // Để trống "" thì form vẫn chạy (hiện lời cảm ơn) nhưng KHÔNG lưu lại.
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbzMKlnoIbjilDAZHJbM87_TeKlIPaPgKFDnepkzNHEQ2LbDdxgqmnWgZKX9QSIhQfSkRg/exec",

  // Nhạc nền lấy từ YouTube — dán ID video vào đây (phần sau "watch?v=").
  // Hiện tại là bài "I Do" (911): https://www.youtube.com/watch?v=pBTp2RWxq-s
  // ⚠️ LƯU Ý: nhiều video (gồm cả ID này) bị chủ kênh TẮT NHÚNG nên KHÔNG phát được
  //    trong web. Khi đó trang sẽ tự chuyển sang phát file "musicFile" bên dưới.
  //    Muốn chắc chắn có nhạc: tải bài hát ra file assets/music.mp3.
  //    Để youtubeId = "" nếu chỉ muốn dùng file mp3.
  youtubeId: "pBTp2RWxq-s",

  // Nhạc dự phòng (phát khi không có/không nhúng được YouTube). Bỏ file vào đúng đường dẫn này.
  musicFile: "assets/music.mp3",
};

/* ════════════════════ Dưới đây là phần xử lý, không cần sửa ════════════════════ */

/* ── 1. Đồng hồ đếm ngược ── */
(function countdown() {
  const target = new Date(CONFIG.weddingDate).getTime();
  const el = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins: document.getElementById("cd-mins"),
    secs: document.getElementById("cd-secs"),
  };
  const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      el.days.textContent = el.hours.textContent = el.mins.textContent = el.secs.textContent = "00";
      const sub = document.querySelector(".countdown-sub");
      if (sub) sub.textContent = "Chúng mình đã chính thức về chung một nhà! 💍";
      return;
    }
    el.days.textContent = pad(Math.floor(diff / 86400000));
    el.hours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    el.mins.textContent = pad(Math.floor((diff % 3600000) / 60000));
    el.secs.textContent = pad(Math.floor((diff % 60000) / 1000));
  }
  tick();
  setInterval(tick, 1000);
})();

/* ── 2. Hiệu ứng xuất hiện khi cuộn ── */
(function reveals() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((i) => i.classList.add("visible"));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((i) => obs.observe(i));
})();

/* ── 3. Thanh điều hướng ── */
(function navbar() {
  const bar = document.getElementById("navbar");
  const toggle = document.getElementById("navToggle");
  const links = document.querySelector(".nav-links");

  const onScroll = () => bar.classList.toggle("scrolled", window.scrollY > 60);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }
})();

/* ── 4. Cánh hoa rơi ── */
(function petals() {
  const container = document.querySelector(".petals");
  if (!container) return;
  const chars = ["🍃", "🌿", "🍀", "❀", "🤍"];
  const COUNT = window.innerWidth < 760 ? 10 : 18;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.textContent = chars[Math.floor(Math.random() * chars.length)];
    p.style.left = Math.random() * 100 + "vw";
    p.style.fontSize = 12 + Math.random() * 16 + "px";
    p.style.animationDuration = 8 + Math.random() * 9 + "s";
    p.style.animationDelay = Math.random() * 10 + "s";
    container.appendChild(p);
  }
})();

/* ── 5. Nhạc nền (YouTube, tự chuyển mp3 nếu bị chặn nhúng) + mở phong thư ── */
(function music() {
  const btn = document.getElementById("musicToggle");
  const intro = document.getElementById("envelopeIntro");
  const openBtn = document.getElementById("envelopeOpen");
  const audio = document.getElementById("bgMusic"); // nhạc dự phòng (mp3)

  let player = null;     // trình phát YouTube
  let ready = false;     // YouTube đã sẵn sàng chưa
  let ytFailed = false;  // YouTube lỗi/chặn nhúng → dùng mp3
  let playing = false;   // đang phát hay không
  let wantPlay = false;  // người dùng đã yêu cầu phát
  let source = null;     // "yt" hoặc "file"

  // Khoá cuộn trang khi màn phong thư còn hiển thị
  if (intro) document.body.style.overflow = "hidden";

  function setPlaying(on) {
    playing = on;
    if (btn) btn.classList.toggle("playing", on);
  }

  // Phát file mp3 dự phòng
  function playFile() {
    if (!audio) return;
    source = "file";
    audio.play().then(() => setPlaying(true)).catch(() => {
      // Chưa có assets/music.mp3 hoặc trình duyệt chặn — bỏ qua êm ái
    });
  }

  // Nạp YouTube IFrame API (nếu có cấu hình ID)
  if (CONFIG.youtubeId) {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player("ytPlayer", {
        videoId: CONFIG.youtubeId,
        playerVars: {
          autoplay: 0, controls: 0, loop: 1, playlist: CONFIG.youtubeId,
          playsinline: 1, modestbranding: 1, rel: 0,
        },
        events: {
          onReady: () => { ready = true; if (wantPlay && !ytFailed) player.playVideo(); },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) { source = "yt"; setPlaying(true); }
            else if ((e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) && source === "yt") setPlaying(false);
          },
          // Video bị tắt nhúng (lỗi 101/150) hoặc lỗi khác → chuyển sang mp3
          onError: () => { ytFailed = true; if (wantPlay) playFile(); },
        },
      });
    };
  }

  // Bắt đầu phát (ưu tiên YouTube, không được thì mp3)
  function startPlay() {
    wantPlay = true;
    if (ytFailed || !CONFIG.youtubeId) { playFile(); return; }
    if (player && ready) player.playVideo();
    // chưa ready: đợi onReady; nếu lỗi: onError sẽ gọi playFile()
  }

  // Nút nhạc góc màn hình: bật/tắt
  if (btn) {
    btn.addEventListener("click", () => {
      if (source === "file" || ytFailed) {
        if (playing) { audio.pause(); setPlaying(false); }
        else playFile();
        return;
      }
      if (player && ready) {
        if (playing) player.pauseVideo();
        else player.playVideo();
      } else {
        startPlay();
      }
    });
  }

  // Mở phong thư → vào thiệp + phát nhạc (cử chỉ người dùng nên trình duyệt cho phát)
  function openEnvelope() {
    if (!intro || intro.classList.contains("open")) return;
    intro.classList.add("open"); // chạy animation mở nắp + lộ lá thư
    startPlay();
    // Nhịp: nắp mở (~.62s) → lá thư trồi lên (xong ~1.32s) → giữ một nhịp → mờ dần
    setTimeout(() => {
      intro.classList.add("hide");
      document.body.style.overflow = ""; // trả lại cuộn trang
    }, 1700);
    setTimeout(() => { intro.style.display = "none"; }, 2750);
  }
  if (openBtn) openBtn.addEventListener("click", openEnvelope);
})();

/* ── 6. Hộp quà — nhấn để hiện QR ── */
(function giftBox() {
  const box = document.getElementById("giftBox");
  const reveal = document.getElementById("giftReveal");
  if (!box || !reveal) return;
  box.addEventListener("click", () => {
    const open = reveal.classList.toggle("open");
    box.classList.toggle("opened", open);
    box.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      setTimeout(
        () => reveal.scrollIntoView({ behavior: "smooth", block: "center" }),
        350
      );
    }
  });
})();

/* ── 7. Xác nhận tham dự (RSVP) ── */
(function rsvp() {
  const form = document.getElementById("rsvpForm");
  const status = document.getElementById("formStatus");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector(".btn-submit");
    const data = Object.fromEntries(new FormData(form).entries());

    status.className = "form-status";
    status.textContent = "Đang gửi...";
    btn.disabled = true;

    try {
      if (CONFIG.rsvpEndpoint) {
        // Gửi dạng form thường (không header tuỳ chỉnh) để Google Apps Script nhận được
        // mà không bị chặn CORS. "no-cors" nên không đọc được phản hồi — nếu mạng lỗi
        // thì fetch sẽ báo lỗi và hiện thông báo bên dưới.
        await fetch(CONFIG.rsvpEndpoint, {
          method: "POST",
          mode: "no-cors",
          body: new URLSearchParams(data),
        });
      } else {
        // Chưa cấu hình nơi lưu — mô phỏng gửi thành công
        await new Promise((r) => setTimeout(r, 600));
        console.log("RSVP (chưa cấu hình nơi lưu):", data);
      }
      form.reset();
      status.className = "form-status success";
      status.textContent = "Cảm ơn bạn! Chúng mình đã nhận được xác nhận 💕";
    } catch (err) {
      status.className = "form-status error";
      status.textContent = "Có lỗi khi gửi. Bạn thử lại hoặc liên hệ trực tiếp giúp mình nhé!";
    } finally {
      btn.disabled = false;
    }
  });
})();

/* ── 8. Album — nhấn vào ảnh để xem phóng to ── */
(function lightbox() {
  const imgs = Array.from(document.querySelectorAll(".gallery-item img"));
  if (!imgs.length) return;

  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Xem ảnh");
  box.innerHTML = `
    <button class="lb-btn lb-close" aria-label="Đóng">✕</button>
    <button class="lb-btn lb-prev" aria-label="Ảnh trước">‹</button>
    <img class="lb-img" alt="" />
    <button class="lb-btn lb-next" aria-label="Ảnh sau">›</button>
    <div class="lb-count"></div>`;
  document.body.appendChild(box);

  const view = box.querySelector(".lb-img");
  const count = box.querySelector(".lb-count");
  let index = 0;

  function show(i) {
    index = (i + imgs.length) % imgs.length;
    view.src = imgs[index].currentSrc || imgs[index].src;
    view.alt = imgs[index].alt;
    count.textContent = `${index + 1} / ${imgs.length}`;
  }
  function open(i) {
    show(i);
    box.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    box.classList.remove("open");
    document.body.style.overflow = "";
  }

  imgs.forEach((img, i) => {
    img.parentElement.style.cursor = "zoom-in";
    img.parentElement.addEventListener("click", () => open(i));
  });
  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", (e) => { e.stopPropagation(); show(index - 1); });
  box.querySelector(".lb-next").addEventListener("click", (e) => { e.stopPropagation(); show(index + 1); });
  box.addEventListener("click", (e) => { if (e.target === box) close(); }); // nhấn ra ngoài ảnh để đóng

  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  // Vuốt trái/phải trên điện thoại để chuyển ảnh
  let startX = null;
  box.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
