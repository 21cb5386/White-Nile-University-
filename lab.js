// استيراد مكتبات فايربيس المطلوبة
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// إعدادات الاتصال بقاعدة البيانات الخاصة بك
const firebaseConfig = {
  apiKey: "AIzaSyBjaaE-C8LzunKLjlULujL--0c_Cd1fA94",
  authDomain: "kosti-university-it.firebaseapp.com",
  databaseURL: "https://kosti-university-it-default-rtdb.firebaseio.com",
  projectId: "kosti-university-it",
  storageBucket: "kosti-university-it.firebasestorage.app",
  messagingSenderId: "364361272352",
  appId: "1:364361272352:web:56953086b49cb2e0a6c045"
};

// تهيئة Firebase و Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const loggedUser = localStorage.getItem('it_logged_user');
    if (loggedUser && window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
    }
    const savedTheme = localStorage.getItem('it_theme') || 'light';
    const savedLang = localStorage.getItem('it_lang') || 'ar';
    document.body.setAttribute('data-theme', savedTheme);
    
    const langSelect = document.getElementById('lang-select');
    if(langSelect) {
        langSelect.value = savedLang;
        changeLanguage();
    }
});

let isLogin = true;
let isCaptchaVerified = false;
let generatedOtp = "";
let recoveryTargetEmail = "";

const translationsLogin = {
    ar: {
        miniTitle: "جامعة النيل الأبيض",
        miniSub: "بوابة تقانة المعلومات",
        home: "الرئيسية",
        loginTitle: "بوابة تقانة المعلومات",
        loginSub: "تسجيل الدخول الأكاديمي للطلاب.",
        signupTitle: "إنشاء حساب جامعي جديد",
        signupSub: "قم بتعبئة بياناتك للانضمام للمنصة.",
        name: "الاسم الكامل",
        universityId: "الرقم الجامعي (ID)",
        semester: "السمستر الحالي",
        email: "البريد الإلكتروني الجامعي",
        password: "كلمة المرور",
        remember: "تذكرني",
        forgot: "نسيت كلمة المرور؟",
        btnIn: "تسجيل الدخول",
        btnUp: "إنشاء الحساب",
        switchInText: "ليس لديك حساب؟",
        switchUpText: "لديك حساب بالفعل؟",
        linkUp: "سجل الآن",
        linkIn: "سجل دخولك",
        errFields: "الرجاء ملء جميع الحقول المطلوبة!",
        errNotFound: "الحساب غير موجود، يرجى إنشاء حساب جديد!",
        errWrongPass: "كلمة المرور غير صحيحة!",
        errAlreadyExists: "هذا البريد مسجل مسبقاً!",
        errInvalidStudentId: "عذراً، الرقم الجامعي غير مسجل في قاعدة بيانات الجامعة الرسمية!",
        succSignup: "تم إنشاء الحساب الأكاديمي بنجاح!",
        loadLogin: "جاري التحقق من الاعتماد الأكاديمي...",
        loadRedirect: "تم بنجاح! جاري تحويلك لوحة التحكم...",
        loadSignup: "جاري التحقق من الرقم الجامعي وإنشاء الحساب..."
    },
    en: {
        miniTitle: "White Nile Univ",
        miniSub: "IT Portal",
        home: "Home",
        loginTitle: "IT Student Portal",
        loginSub: "Student Academic Sign In.",
        signupTitle: "Create University Account",
        signupSub: "Fill in your details to join the platform.",
        name: "Full Name",
        universityId: "University ID",
        semester: "Current Semester",
        email: "University Email",
        password: "Password",
        remember: "Remember me",
        forgot: "Forgot Password?",
        btnIn: "Sign In",
        btnUp: "Create Account",
        switchInText: "Don't have an account?",
        switchUpText: "Already have an account?",
        linkUp: "Sign Up",
        linkIn: "Sign In",
        errFields: "Please fill in all required fields!",
        errNotFound: "Account not found, please sign up!",
        errWrongPass: "Incorrect password!",
        errAlreadyExists: "This email is already registered!",
        errInvalidStudentId: "Sorry, this University ID is not registered in the official database!",
        succSignup: "Account created successfully!",
        loadLogin: "Verifying academic credentials...",
        loadRedirect: "Success! Redirecting to dashboard...",
        loadSignup: "Verifying student ID and creating account..."
    }
};

function changeLanguage() {
    const lang = document.getElementById('lang-select').value;
    localStorage.setItem('it_lang', lang);
    const container = document.getElementById('main-container');
    if(container) container.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    const t = translationsLogin[lang] || translationsLogin.ar;
    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    
    setTxt('form-title', isLogin ? t.loginTitle : t.signupTitle);
    setTxt('form-subtitle', isLogin ? t.loginSub : t.signupSub);
    setTxt('lbl-name', t.name);
    setTxt('lbl-id', t.universityId);
    setTxt('lbl-semester', t.semester);
    setTxt('lbl-email', t.email);
    setTxt('lbl-password', t.password);
    setTxt('lbl-remember', t.remember);
    setTxt('lnk-forgot', t.forgot);
    setTxt('submit-btn', isLogin ? t.btnIn : t.btnUp);
    setTxt('switch-text', isLogin ? t.switchInText : t.switchUpText);
    setTxt('switch-btn', isLogin ? t.linkUp : t.linkIn);
}

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
    } else {
        if(loginExtras) loginExtras.classList.add('hidden-view');
    }
    changeLanguage();
}

function showPassword(inputId, event) {
    event.preventDefault();
    const input = document.getElementById(inputId);
    if(input) input.type = 'text';
}

function hidePassword(inputId, event) {
    event.preventDefault();
    const input = document.getElementById(inputId);
    if(input) input.type = 'password';
}

function checkPasswordStrength(password) {
    const bars = [
        document.getElementById('s-bar-1'),
        document.getElementById('s-bar-2'),
        document.getElementById('s-bar-3'),
        document.getElementById('s-bar-4')
    ];
    const textEl = document.getElementById('strength-text');
    if (!bars[0]) return;

    let score = 0;
    if (password.length > 5) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
    const texts = ['ضعيفة جداً', 'ضعيفة', 'جيدة', 'قوية وممتازة'];

    bars.forEach((bar, index) => {
        if (index < score && password.length > 0) {
            bar.style.background = colors[score - 1];
        } else {
            bar.style.background = '#e0e0e0';
        }
    });

    if (password.length > 0) {
        textEl.innerText = texts[score - 1] || 'ضعيفة جداً';
        textEl.style.color = colors[score - 1] || '#ef4444';
    } else {
        textEl.innerText = 'قوة كلمة المرور';
        textEl.style.color = '#777';
    }
}

function checkPasswordMatch() {
    const pass = document.getElementById('pass-input').value;
    const confirmPass = document.getElementById('confirm-pass-input').value;
    const feedback = document.getElementById('match-feedback');
    
    if (!feedback) return;

    if (confirmPass.length === 0) {
        feedback.innerText = "";
        return;
    }

    if (pass === confirmPass) {
        feedback.innerText = "✓ كلمتا المرور متطابقتان";
        feedback.style.color = "#10b981";
    } else {
        feedback.innerText = "✗ كلمتا المرور غير متطابقتين";
        feedback.style.color = "#ef4444";
    }
}

const lottieElement = document.getElementById('lottie-animation');
if(lottieElement) {
    lottie.loadAnimation({
        container: lottieElement,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets2.lottiefiles.com/packages/lf20_jcikwtux.json'
    });
}

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
            <div style="width: 50px; height: 50px; border: 5px solid rgba(255,255,255,0.2); border-top: 5px solid #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
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

// دالة التحقق من الرقم الجامعي في فايربيس وإنشاء/تسجيل الدخول
async function handleSubmit() {
    const email = document.getElementById('email-input').value.trim();
    const pass = document.getElementById('pass-input').value;
    const lang = localStorage.getItem('it_lang') || 'ar';
    const t = translationsLogin[lang] || translationsLogin.ar;

    if (!email || !pass) {
        alert(t.errFields);
        return;
    }

    if (isLogin) {
        let users = JSON.parse(localStorage.getItem('it_platform_users') || '{}');
        if (!users[email]) {
            alert(t.errNotFound);
            return;
        }
        if (users[email].pass !== pass) {
            alert(t.errWrongPass);
            return;
        }

        showLoadingOverlay(t.loadLogin);
        setTimeout(() => {
            showLoadingOverlay(t.loadRedirect);
            localStorage.setItem('it_logged_user', users[email].name);
            localStorage.setItem('it_logged_id', users[email].studentId || 'IT-2026-039');
            localStorage.setItem('it_logged_semester', users[email].semester || 'السمستر الثالث');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 700);
        }, 800);

    } else {
        const name = document.getElementById('fullname').value.trim();
        const studentId = document.getElementById('studentid').value.trim();
        const semester = document.getElementById('semester').value.trim();
        const confirmPass = document.getElementById('confirm-pass-input').value;
        
        if (!name || !studentId || !semester || !confirmPass) { alert(t.errFields); return; }
        if (pass !== confirmPass) { alert("كلمتا المرور غير متطابقتين!"); return; }

        let users = JSON.parse(localStorage.getItem('it_platform_users') || '{}');
        if (users[email]) {
            alert(t.errAlreadyExists);
            return;
        }

        showLoadingOverlay(t.loadSignup);

        try {
            // التحقق مما إذا كان الرقم الجامعي موجوداً في مجموعة students بـ Firestore
            const studentDocRef = doc(db, "students", studentId);
            const studentSnap = await getDoc(studentDocRef);

            if (!studentSnap.exists()) {
                hideLoadingOverlay();
                alert(t.errInvalidStudentId);
                return;
            }

            // إذا كان الرقم موجوداً، نكمل عملية إنشاء الحساب بنجاح
            setTimeout(() => {
                users[email] = { name: name, studentId: studentId, semester: semester, pass: pass };
                localStorage.setItem('it_platform_users', JSON.stringify(users));
                hideLoadingOverlay();
                alert(t.succSignup);
                toggleMode();
            }, 1000);

        } catch (error) {
            hideLoadingOverlay();
            console.error("Firebase Error:", error);
            alert("حدث خطأ أثناء الاتصال بقاعدة البيانات، يرجى المحاولة لاحقاً.");
        }
    }
}

function startForgotPassword() {
    document.getElementById('auth-form-container').classList.add('hidden-view');
    document.getElementById('forgot-flow-container').classList.remove('hidden-view');
}

function triggerRealCaptcha() {
    const spinner = document.getElementById('captcha-spinner');
    const check = document.getElementById('captcha-check');
    if(spinner) spinner.style.display = 'block';
    setTimeout(() => {
        if(spinner) spinner.style.display = 'none';
        if(check) check.style.display = 'block';
        isCaptchaVerified = true;
        setTimeout(() => {
            document.getElementById('step-captcha').classList.add('hidden-view');
            document.getElementById('step-email').classList.remove('hidden-view');
        }, 500);
    }, 1000);
}

function sendVerificationCode() {
    const email = document.getElementById('recovery-email-input').value.trim();
    let users = JSON.parse(localStorage.getItem('it_platform_users') || '{}');

    if (!email || !users[email]) {
        alert("هذا البريد غير مسجل في النظام!");
        return;
    }

    showLoadingOverlay("جاري إرسال رمز الـ OTP لبريدك...");
    setTimeout(() => {
        hideLoadingOverlay();
        recoveryTargetEmail = email;
        generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
        alert("رمز التحقق التجريبي الخاص بك هو: " + generatedOtp);
        document.getElementById('step-email').classList.add('hidden-view');
        document.getElementById('step-otp').classList.remove('hidden-view');
    }, 1000);
}

function verifyOtpCode() {
    const enteredOtp = document.getElementById('otp-input').value.trim();
    if (enteredOtp === generatedOtp) {
        document.getElementById('step-otp').classList.add('hidden-view');
        document.getElementById('step-newpass').classList.remove('hidden-view');
    } else {
        alert("رمز التحقق غير صحيح!");
    }
}

function saveNewPassword() {
    const newPass = document.getElementById('new-pass-input').value;
    const confirmNewPass = document.getElementById('confirm-new-pass-input').value;

    if (newPass.length < 6) { alert("يجب ألا تقل كلمة المرور عن 6 أحرف!"); return; }
    if (newPass !== confirmNewPass) { alert("كلمتا المرور غير متطابقتين!"); return; }

    showLoadingOverlay("جاري تحديث كلمة المرور...");
    setTimeout(() => {
        let users = JSON.parse(localStorage.getItem('it_platform_users') || '{}');
        if (users[recoveryTargetEmail]) {
            users[recoveryTargetEmail].pass = newPass;
            localStorage.setItem('it_platform_users', JSON.stringify(users));
            hideLoadingOverlay();
            alert("تم تغيير كلمة المرور بنجاح! يمكنك تسجيل الدخول الآن.");
            backToLogin();
        }
    }, 1000);
}

function backToLogin() {
    document.getElementById('forgot-flow-container').classList.add('hidden-view');
    document.getElementById('auth-form-container').classList.remove('hidden-view');
    isCaptchaVerified = false;
    const check = document.getElementById('captcha-check');
    if(check) check.style.display = 'none';
}

// ربط دالة التسجيل بالنافذة العامة لضمان عملها مع الـ HTML
window.handleSubmit = handleSubmit;
window.toggleMode = toggleMode;
window.changeLanguage = changeLanguage;
window.showPassword = showPassword;
window.hidePassword = hidePassword;
window.checkPasswordStrength = checkPasswordStrength;
window.checkPasswordMatch = checkPasswordMatch;
window.startForgotPassword = startForgotPassword;
window.triggerRealCaptcha = triggerRealCaptcha;
window.sendVerificationCode = sendVerificationCode;
window.verifyOtpCode = verifyOtpCode;
window.saveNewPassword = saveNewPassword;
window.backToLogin = backToLogin;
