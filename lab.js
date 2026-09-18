import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjaaE-C8LzunKLjlULujL--0c_Cd1fA94",
  authDomain: "kosti-university-it.firebaseapp.com",
  databaseURL: "https://kosti-university-it-default-rtdb.firebaseio.com",
  projectId: "kosti-university-it",
  storageBucket: "kosti-university-it.firebasestorage.app",
  messagingSenderId: "364361272352",
  appId: "1:364361272352:web:56953086b49cb2e0a6c045"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    if (currentPath.includes('dashboard.html')) {
        const loggedUser = localStorage.getItem('it_logged_user');
        if (!loggedUser) {
            window.location.href = 'login.html';
            return;
        }
        loadDashboardData();
    }

    if (currentPath.includes('login.html')) {
        const loggedUser = localStorage.getItem('it_logged_user');
        if (loggedUser) {
            window.location.href = 'dashboard.html';
            return;
        }
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('هل أنت متأكد من رغبتك في تسجيل الخروج؟')) {
                localStorage.removeItem('it_logged_user');
                localStorage.removeItem('it_logged_id');
                localStorage.removeItem('it_logged_semester');
                window.location.href = 'login.html';
            }
        });
    }

    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
});

let isLogin = true;
let generatedOtp = "";
let recoveryTargetEmail = "";
let currentCaptchaCode = "";

function toggleMode() {
    isLogin = !isLogin;
    const signupFields = document.querySelectorAll('.signup-field');
    const loginExtras = document.getElementById('login-extras');

    signupFields.forEach(field => {
        if (isLogin) {
            field.classList.add('hidden-view');
        } else {
            field.classList.remove('hidden-view');
        }
    });

    if (isLogin) {
        if(loginExtras) loginExtras.classList.remove('hidden-view');
        document.getElementById('form-title').innerText = "بوابة تقانة المعلومات";
        document.getElementById('form-subtitle').innerText = "تسجيل الدخول الأكاديمي للطلاب.";
        document.getElementById('submit-btn').innerText = "تسجيل الدخول";
        document.getElementById('switch-text').innerText = "ليس لديك حساب؟";
        document.getElementById('switch-btn').innerText = "سجل الآن";
    } else {
        if(loginExtras) loginExtras.classList.add('hidden-view');
        document.getElementById('form-title').innerText = "إنشاء حساب جامعي جديد";
        document.getElementById('form-subtitle').innerText = "قم بتعبئة بياناتك للانضمام للمنصة.";
        document.getElementById('submit-btn').innerText = "إنشاء الحساب";
        document.getElementById('switch-text').innerText = "لديك حساب بالفعل؟";
        document.getElementById('switch-btn').innerText = "سجل دخولك";
    }
}

function showPassword(inputId) { const input = document.getElementById(inputId); if(input) input.type = 'text'; }
function hidePassword(inputId) { const input = document.getElementById(inputId); if(input) input.type = 'password'; }

function showLoadingOverlay(message) {
    let overlay = document.getElementById('loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 44, 89, 0.88); backdrop-filter: blur(8px);
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            z-index: 9999; color: white; font-family: 'Cairo', sans-serif;
        `;
        overlay.innerHTML = `
            <div style="width: 50px; height: 50px; border: 5px solid rgba(255,255,255,0.2); border-top: 5px solid #14b8a6; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            <p id="loading-text" style="margin-top: 15px; font-size: 1.05rem; font-weight: 700;">${message}</p>
        `;
        document.body.appendChild(overlay);
    } else {
        document.getElementById('loading-text').innerText = message;
        overlay.style.display = 'flex';
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if(overlay) overlay.style.display = 'none';
}

async function handleSubmit() {
    const emailInput = document.getElementById('email-input');
    const passInput = document.getElementById('pass-input');
    
    const email = emailInput ? emailInput.value.trim() : '';
    const pass = passInput ? passInput.value : '';

    if (!email || !pass) { alert("الرجاء ملء جميع الحقول المطلوبة!"); return; }

    if (isLogin) {
        let users = JSON.parse(localStorage.getItem('it_platform_users') || '{}');
        if (!users[email]) { alert("الحساب غير موجود، يرجى إنشاء حساب جديد!"); return; }
        if (users[email].pass !== pass) { alert("كلمة المرور غير صحيحة!"); return; }

        showLoadingOverlay("جاري التحقق وتسجيل الدخول...");
        setTimeout(() => {
            localStorage.setItem('it_logged_user', users[email].name);
            localStorage.setItem('it_logged_id', users[email].studentId || '11086250-24');
            localStorage.setItem('it_logged_semester', users[email].semester || 'السمستر الثاني');
            window.location.href = 'dashboard.html';
        }, 800);

    } else {
        const nameInput = document.getElementById('fullname');
        const studentIdInput = document.getElementById('studentid');
        const semesterInput = document.getElementById('semester');
        const confirmPassInput = document.getElementById('confirm-pass-input');

        const name = nameInput ? nameInput.value.trim() : '';
        const studentId = studentIdInput ? studentIdInput.value.trim() : '';
        const semester = semesterInput ? semesterInput.value.trim() : '';
        const confirmPass = confirmPassInput ? confirmPassInput.value : '';
        
        if (!name || !studentId || !semester || !confirmPass) { 
            alert("الرجاء ملء جميع الحقول المطلوبة!"); 
            return; 
        }

        // فحص قوة كلمة المرور (أقل شي 6 أحرف)
        if (pass.length < 6) { 
            alert("كلمة المرور ضعيفة جداً! يجب ألا تقل عن 6 أحرف."); 
            return; 
        }

        // فحص تطابق كلمتي المرور بدقة وإيقاف التسجيل لو غير متطابقتين
        if (pass !== confirmPass) { 
            alert("عذراً، كلمتا المرور غير متطابقتين! يرجى التحقق وإعادة الإدخال."); 
            return; 
        }

        let users = JSON.parse(localStorage.getItem('it_platform_users') || '{}');
        if (users[email]) { alert("هذا البريد مسجل مسبقاً!"); return; }

        showLoadingOverlay("جاري التحقق من الرقم الجامعي عبر قاعدة البيانات...");

        try {
            const studentDocRef = doc(db, "students", studentId);
            const studentSnap = await getDoc(studentDocRef);

            if (!studentSnap.exists()) {
                hideLoadingOverlay();
                alert("عذراً، الرقم الجامعي غير مسجل في قاعدة بيانات الجامعة الرسمية!");
                return;
            }

            users[email] = { name: name, studentId: studentId, semester: semester, pass: pass };
            localStorage.setItem('it_platform_users', JSON.stringify(users));
            hideLoadingOverlay();
            alert("تم إنشاء الحساب الأكاديمي بنجاح!");
            toggleMode();

        } catch (error) {
            hideLoadingOverlay();
            users[email] = { name: name, studentId: studentId, semester: semester, pass: pass };
            localStorage.setItem('it_platform_users', JSON.stringify(users));
            alert("تم إنشاء الحساب الأكاديمي بنجاح!");
            toggleMode();
        }
    }
}

// === نظام استعادة كلمة المرور والكابتشا الحقيقية ===
function startForgotPassword() {
    document.getElementById('auth-form-container').classList.add('hidden-view');
    document.getElementById('forgot-flow-container').classList.remove('hidden-view');
    generateCaptcha();
}

function generateCaptcha() {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    currentCaptchaCode = "";
    for (let i = 0; i < 5; i++) {
        currentCaptchaCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    let captchaBox = document.getElementById('captcha-display-box');
    if (!captchaBox) {
        const stepCaptcha = document.getElementById('step-captcha');
        captchaBox = document.createElement('div');
        captchaBox.id = 'captcha-display-box';
        captchaBox.style.cssText = `
            background: #e2e8f0; color: #0f766e; font-size: 1.4rem; font-weight: 900;
            letter-spacing: 5px; text-align: center; padding: 12px; border-radius: 8px;
            margin-bottom: 12px; user-select: none; text-decoration: line-through;
        `;
        stepCaptcha.insertBefore(captchaBox, stepCaptcha.firstChild);
        
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.id = 'captcha-input';
        inputField.placeholder = 'أدخل الرمز الظاهر بالأعلى';
        inputField.style.cssText = 'width:100%; padding:12px; border-radius:8px; border:1px solid var(--border); margin-bottom:10px; font-weight:700; background:var(--bg); color:var(--text);';
        stepCaptcha.insertBefore(inputField, stepCaptcha.children[1]);
    }
    captchaBox.innerText = currentCaptchaCode;
}

function triggerRealCaptcha() {
    const userInput = document.getElementById('captcha-input');
    if (!userInput || !userInput.value.trim()) {
        alert("الرجاء إدخال رمز التحقق (الكابتشا) أولاً!");
        return;
    }

    if (userInput.value.trim() !== currentCaptchaCode) {
        alert("رمز التحقق غير صحيح! حاول مرة أخرى.");
        generateCaptcha();
        userInput.value = "";
        return;
    }

    showLoadingOverlay("جاري التحقق الأمني من أنك لست روبوت...");
    setTimeout(() => {
        hideLoadingOverlay();
        document.getElementById('step-captcha').classList.add('hidden-view');
        document.getElementById('step-email').classList.remove('hidden-view');
    }, 1000);
}

function sendVerificationCode() {
    const email = document.getElementById('recovery-email-input').value.trim();
    let users = JSON.parse(localStorage.getItem('it_platform_users') || '{}');
    if (!email || !users[email]) { alert("هذا البريد غير مسجل في النظام!"); return; }
    
    recoveryTargetEmail = email;
    generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    
    showLoadingOverlay("جاري إرسال رمز التحقق إلى بريدك الإلكتروني...");
    setTimeout(() => {
        hideLoadingOverlay();
        alert("تم إرسال رمز التحقق بنجاح. رمز الـ OTP التجريبي الخاص بك هو: " + generatedOtp);
        document.getElementById('step-email').classList.add('hidden-view');
        document.getElementById('step-otp').classList.remove('hidden-view');
    }, 1000);
}

function verifyOtpCode() {
    const userOtp = document.getElementById('otp-input').value.trim();
    if (userOtp === generatedOtp) {
        showLoadingOverlay("جاري مطابقة الرمز...");
        setTimeout(() => {
            hideLoadingOverlay();
            document.getElementById('step-otp').classList.add('hidden-view');
            document.getElementById('step-newpass').classList.remove('hidden-view');
        }, 800);
    } else {
        alert("رمز التحقق غير صحيح!");
    }
}

function saveNewPassword() {
    const newPass = document.getElementById('new-pass-input').value;
    const confirmNewPass = document.getElementById('confirm-new-pass-input').value;
    
    if (newPass.length < 6) { alert("يجب ألا تقل كلمة المرور الجديدة عن 6 أحرف!"); return; }
    if (newPass !== confirmNewPass) { alert("كلمتا المرور غير متطابقتين!"); return; }

    let users = JSON.parse(localStorage.getItem('it_platform_users') || '{}');
    if (users[recoveryTargetEmail]) {
        users[recoveryTargetEmail].pass = newPass;
        localStorage.setItem('it_platform_users', JSON.stringify(users));
        showLoadingOverlay("جاري تحديث كلمة المرور...");
        setTimeout(() => {
            hideLoadingOverlay();
            alert("تم تغيير كلمة المرور بنجاح! يمكنك تسجيل الدخول الآن.");
            backToLogin();
        }, 1000);
    }
}

function backToLogin() {
    document.getElementById('forgot-flow-container').classList.add('hidden-view');
    document.getElementById('auth-form-container').classList.remove('hidden-view');
}

function loadDashboardData() {
    const userName = localStorage.getItem('it_logged_user') || 'محمود عبدالله ادم محمد';
    const userId = localStorage.getItem('it_logged_id') || '11086250-24';

    const waBtn = document.querySelector('.whatsapp-action-btn');
    if (waBtn) {
        const waMessage = encodeURIComponent(`مرحباً إدارة تقانة المعلومات، أنا الطالب ${userName} (الرقم الجامعي: ${userId})، وأحتاج إلى مساعدة أكاديمية.`);
        waBtn.href = `https://wa.me/249900623733?text=${waMessage}`;
    }
}

// تصدير الدوال للنطاق العام
window.handleSubmit = handleSubmit;
window.toggleMode = toggleMode;
window.showPassword = showPassword;
window.hidePassword = hidePassword;
window.startForgotPassword = startForgotPassword;
window.triggerRealCaptcha = triggerRealCaptcha;
window.sendVerificationCode = sendVerificationCode;
window.verifyOtpCode = verifyOtpCode;
window.saveNewPassword = saveNewPassword;
window.backToLogin = backToLogin;
