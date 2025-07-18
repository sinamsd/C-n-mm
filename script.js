const noButton = document.querySelector('.no');
const yesButton = document.querySelector('.yes');

let escapeCount = 0;
let locked = false;

noButton.addEventListener('mouseenter', () => {
  if (locked) return;

  if (escapeCount < 3) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const btnWidth = noButton.offsetWidth;
    const btnHeight = noButton.offsetHeight;

    const randomX = Math.floor(Math.random() * (width - btnWidth));
    const randomY = Math.floor(Math.random() * (height - btnHeight));

    noButton.style.position = 'fixed';
    noButton.style.left = `${randomX}px`;
    noButton.style.top = `${randomY}px`;

    escapeCount++;
  } else {
    locked = true;

    // Sabit pozisyon sağ alt
    noButton.style.position = 'fixed';
    noButton.style.left = 'calc(100% + 330px)';
    noButton.style.top = 'calc(100% - 90px)';
    noButton.style.transition = 'left 0.5s ease, top 0.5s ease';

    // Animasyon zinciri başlasın:
    walkMemeFromRight('img/kedi.PNG', 10)
    .then(() => flashMemes(['img/kedi.PNG', 'img/ham.PNG'], 0, 150, 3000))
    .then(() => {
      noButton.style.display = 'none'; // Hayır butonu kalkar
      return showMeme3ThenWalk('img/gidiom.PNG', 10);
    });
  }

  // Evet butonu büyüsün
  const currentScale = yesButton.style.transform.match(/scale\(([^)]+)\)/);
  let scale = currentScale ? parseFloat(currentScale[1]) : 1;
  scale += 0.1;
  yesButton.style.transform = `scale(${scale})`;
});

// Meme1 sağdan yürüyerek gelme
function walkMemeFromRight(src, stepsCount) {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'meme-img';
    img.style.position = 'fixed';
    img.style.bottom = '70px';
    img.style.right = '-120px';
    document.body.appendChild(img);

    let x = -120;
    let y = 70;
    let direction = -1;
    let steps = 0;

    const interval = setInterval(() => {
      x += 10;
      y += direction * 5;
      direction *= -1;

      img.style.right = `${x}px`;
      img.style.bottom = `${y}px`;

      steps++;
      if (steps >= stepsCount) {
        clearInterval(interval);
        img.remove();
        resolve();
      }
    }, 200);
  });
}

// Meme1 ve meme2 hızlı dönüşümlü animasyon (döngü)
function flashMemes(sources, times, intervalMs, totalDurationMs) {
  return new Promise((resolve) => {
    let count = 0;
    let index = 0;

    const img = document.createElement('img');
    img.className = 'meme-img';
    img.style.position = 'fixed';
    img.style.bottom = '70px';
    img.style.right = `${-120 + 10 * 10}px`;
    img.src = sources[0];
    document.body.appendChild(img);

    const maxCycles = times > 0 ? times * sources.length : Infinity;

    const interval = setInterval(() => {
      img.src = sources[index];
      index = (index + 1) % sources.length;
      count++;

      if (count >= maxCycles) {
        clearInterval(interval);
        img.remove();
        resolve();
      }
    }, intervalMs);

    if (totalDurationMs) {
      setTimeout(() => {
        clearInterval(interval);
        img.remove();
        resolve();
      }, totalDurationMs);
    }
  });
}

// Meme3 göster ve sağa doğru yürüt
function showMeme3ThenWalk(src, stepsCount) {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'meme-img';
    img.style.position = 'fixed';
    img.style.bottom = '70px';
    img.style.right = `${-120 + 10 * 10}px`;
    document.body.appendChild(img);

    // Kısa bekleme (örneğin 200ms) sonrası yürüyüş
    setTimeout(() => {
      walkMemeRightward(img, stepsCount).then(() => {
        img.remove();
        resolve();
      });
    }, 200);
  });
}

// Meme3 sağa doğru yürüyüş
function walkMemeRightward(img, stepsCount) {
  return new Promise((resolve) => {
    let x = -120 + 10 * 10;
    let y = 70;
    let direction = -1;
    let steps = 0;

    img.style.right = `${x}px`;

    const interval = setInterval(() => {
      x -= 10;  // sağa yürüyüş için right azalıyor
      y += direction * 5;
      direction *= -1;

      img.style.right = `${x}px`;
      img.style.bottom = `${y}px`;

      steps++;
      if (steps >= stepsCount) {
        clearInterval(interval);
        resolve();
      }
    }, 200);
  });
}
