import confetti from 'canvas-confetti';

const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const homeScreen = document.getElementById('home-screen');
const successScreen = document.getElementById('success-screen');
const restartBtn = document.getElementById('restart-btn');
const canvas = document.getElementById('heart-canvas');
const ctx = canvas.getContext('2d');
const mainMsg = document.querySelector('.message');

let audioStarted = false;
const bgMusic = new Audio('romantic_bg.mp3');
bgMusic.loop = true;
const yaySound = new Audio('yay.mp3');

let noCount = 0;
const noTexts = [
    "ไม่! (งอนต่อ)",
    "แน่ใจเหรอ??",
    "คิดอีกทีซิ...",
    "อย่าใจร้ายนักเลย",
    "เค้าสำนึกผิดแล้วนะ",
    "จะไม่ดื้อแล้วจริงๆ",
    "ยกโทษให้เถอะน้าาา",
    "จะร้องไห้แล้วนะ 😭",
    "ยอมแพ้แล้วใช่ไหม?"
];

// Resize canvas
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Floating Hearts Animation
const hearts = [];
class Heart {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 15 + 10;
        this.speed = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.wiggle = Math.random() * 2;
        this.wiggleSpeed = Math.random() * 0.05;
    }
    update() {
        this.y -= this.speed;
        this.x += Math.sin(Date.now() * this.wiggleSpeed) * this.wiggle;
        if (this.y < -20) this.reset();
    }
    draw() {
        ctx.fillStyle = `rgba(255, 133, 161, ${this.opacity})`;
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(this.x, this.y + topCurveHeight);
        ctx.bezierCurveTo(this.x, this.y, this.x - this.size / 2, this.y, this.x - this.size / 2, this.y + topCurveHeight);
        ctx.bezierCurveTo(this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x, this.y + (this.size + topCurveHeight) / 2, this.x, this.y + this.size);
        ctx.bezierCurveTo(this.x, this.y + (this.size + topCurveHeight) / 2, this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x + this.size / 2, this.y + topCurveHeight);
        ctx.bezierCurveTo(this.x + this.size / 2, this.y, this.x, this.y, this.x, this.y + topCurveHeight);
        ctx.fill();
    }
}

for (let i = 0; i < 20; i++) {
    hearts.push(new Heart());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(heart => {
        heart.update();
        heart.draw();
    });
    requestAnimationFrame(animate);
}
animate();

// Interaction Logic
function startAudio() {
    if (!audioStarted) {
        bgMusic.play().catch(() => {});
        audioStarted = true;
    }
}

const moveNoButton = () => {
    startAudio();
    noCount++;
    
    // Update button text
    if (noCount < noTexts.length) {
        noBtn.innerText = noTexts[noCount];
    }

    const btnRect = noBtn.getBoundingClientRect();
    const padding = 20;
    
    // Calculate safe boundaries
    const maxX = window.innerWidth - btnRect.width - padding;
    const maxY = window.innerHeight - btnRect.height - padding;
    
    let randomX = Math.random() * maxX;
    let randomY = Math.random() * maxY;

    // Ensure it's not exactly where the mouse/finger is
    // (Optional: simple offset logic)
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${Math.max(padding, randomX)}px`;
    noBtn.style.top = `${Math.max(padding, randomY)}px`;
    noBtn.style.zIndex = '1000';
    
    // Scale up the "Yes" button
    const scale = 1 + (noCount * 0.15);
    yesBtn.style.transform = `scale(${Math.min(scale, 2.5)})`;
    
    // If it gets too huge, change the main message
    if (noCount === 5) {
        mainMsg.innerText = "โห... ยังไม่อีกเหรอ? เค้าเสียใจนะเนี่ย 🥺";
    } else if (noCount === 8) {
        mainMsg.innerText = "กด 'ตกลง' เถอะนะ ขอร้องงงงง 🙏";
    }
};

noBtn.addEventListener('mouseover', (e) => {
    if (window.innerWidth > 768) moveNoButton();
});

noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});

// If they somehow click it (e.g. keyboard navigation)
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});

yesBtn.addEventListener('click', () => {
    startAudio();
    yaySound.play();
    homeScreen.classList.remove('active');
    successScreen.classList.add('active');
    
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ff85a1', '#fbb1bd', '#ffffff']
    });
});

restartBtn.addEventListener('click', () => {
    // Reset state
    noCount = 0;
    successScreen.classList.remove('active');
    homeScreen.classList.add('active');
    
    // Reset Yes Button
    yesBtn.style.transform = 'scale(1)';
    
    // Reset No Button
    noBtn.style.position = '';
    noBtn.style.left = '';
    noBtn.style.top = '';
    noBtn.style.bottom = '';
    noBtn.style.width = '';
    noBtn.innerText = noTexts[0];
    
    // Reset Message
    mainMsg.innerText = "ดีกันนะคนดี เค้าสัญญาจะเป็นเด็กดี ไม่ดื้อ ไม่ซนแล้วครับ ยกโทษให้เค้านะนะนะ ❤️";
});

// Start audio on first touch
document.body.addEventListener('touchstart', startAudio, { once: true });
document.body.addEventListener('click', startAudio, { once: true });