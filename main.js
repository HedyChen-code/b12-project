import './assets/scss/all.scss';
import 'bootstrap/dist/js/bootstrap.min.js';

    AOS.init(
      {
        duration: 800, // 持續時間，值從 0 到 3000，步長為 50ms | 預設：400
        easing: 'ease', // AOS 動畫的默認緩動 | 預設：'ease'
        once: false, // 動畫是否應該只發生一次（向下滾動時） | 預設：false
        mirror: true, // 元素在滾動經過時是否應該反向動畫 | 預設：false
      }
    );
// 🔧 修正：分別初始化兩個輪播，避免衝突
// 分類選單輪播
const headSwiper = new Swiper('.headSwiper', {
  autoplay: {
    delay: 2500,
    disableOnInteraction: false
  },
  spaceBetween: 16,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  slidesPerView: 4.5,
  breakpoints: {
    576: { // >576px (手機)
      slidesPerView: 6.5,
    },
  },
  // 🔧 加入循環功能
  loop: false, // 分類選單通常不需要循環
  // 🔧 加入拖拽功能
  allowTouchMove: true,
});

// 主視覺輪播 (保持不變，這部分是正確的)
const mainSwiper = new Swiper(".mainSwiper", {
  loop: true, // ✅ 循環功能
  autoplay: {
    delay: 2500,
    disableOnInteraction: false
  },
  slidesPerView: 1,
  pagination: {
    el: '.custom-pagination-wrapper .swiper-pagination',
    clickable: true,
  },
  // 新增：導航按鈕設定
  navigation: {
    nextEl: '.custom-pagination-wrapper .swiper-button-next',
    prevEl: '.custom-pagination-wrapper .swiper-button-prev',
  },
  // 🔧 加入淡入淡出效果 (可選)
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  
});

// 商品詳情頁
// 下單數量
const input = document.getElementById('orderNum');
const btnIncrease = document.querySelector('.btn-increase');
const btnDecrease = document.querySelector('.btn-decrease');

btnIncrease.addEventListener('click', () => {
  if (input.value < input.max) {
    input.value = parseInt(input.value) + 1;
  }
});

btnDecrease.addEventListener('click', () => {
  if (input.value > input.min) {
    input.value = parseInt(input.value) - 1;
  }
});

// 收藏按鈕 .iconFav 的 .active ( 商品詳情頁 )
document.querySelectorAll(".btn-ghost").forEach(icon => {
  icon.addEventListener("click", () => icon.classList.toggle("active"));
});

// 商品輪播縮列圖中的 .active ( 商品詳情頁 )
// 1) 取到所有縮圖按鈕
const carouselEl = document.querySelector('#prodCarousel');
const thumbs = document.querySelectorAll('.carousel-indicators.smallImg [data-bs-slide-to]');

// 2) 依索引設定 active（只保留一個）
function setActiveByIndex(i){
  thumbs.forEach(b => {
    const idx = Number(b.dataset.bsSlideTo);
    b.classList.toggle('active', idx === i);
  });
}

// 3) 點縮圖就先切外觀
thumbs.forEach(b => {
  b.addEventListener('click', () => {
    const i = Number(b.dataset.bsSlideTo);
    setActiveByIndex(i);
  });
});

// 4) 輪播真正完成切換（含左右箭頭/滑動/自動）再同步一次
carouselEl.addEventListener('slid.bs.carousel', e => {
  setActiveByIndex(e.to);   // Bootstrap 事件物件會帶 from/to
});


// 結帳頁
// 🔧 除錯用的控制台輸出
console.log('Head Swiper initialized:', headSwiper);
console.log('Main Swiper initialized:', mainSwiper);

// 購物流程區塊判斷在哪頁該如何顯示(數字+文字+虛線)
function setActiveStep(stepNumber) {
  const steps = document.querySelectorAll('.process-number');
  const texts = document.querySelectorAll('.process-text');
  const lines = document.querySelectorAll('.process-line');
  steps.forEach((step, index) => {
    if (index < stepNumber - 1) {
      step.classList.add('done');
    } else if (index === stepNumber - 1) {
      step.classList.add('inProgress'); 
    } else if (index > stepNumber - 1) {
      step.classList.add('next'); 
    }
  });
  texts.forEach((text, index) => {
    if (index < stepNumber - 1) {
      text.classList.add('done');
    } else if (index === stepNumber - 1) {
      text.classList.add('inProgress'); 
    } else if (index > stepNumber - 1) {
      text.classList.add('next'); 
    }
  });
  lines.forEach((line, index) => {
    if (stepNumber == 1) {
      line.classList.add('dashed');
    }else if( stepNumber == 2 & index == 1) {
      line.classList.add('dashed');
    }
  });
}

// 購物流程區塊 根據 URL 判斷目前在哪一頁後執行setActiveStep()
const url = window.location.pathname;
if (url.includes('cart.html')) {
  setActiveStep(1);
} else if (url.includes('checkout.html')) {
  setActiveStep(2);
} else if (url.includes('order-complete.html')) {
  setActiveStep(3);
}

