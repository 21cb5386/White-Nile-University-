// التحقق الذكي: لو الطالب مسجل دخول أساساً، يتم تحويله للوحة التحكم مباشرة
document.addEventListener('DOMContentLoaded', () => {
    const loggedUser = localStorage.getItem('it_logged_user');
    if (loggedUser && window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
    }
});

let isLogin = true;
let isCaptchaVerified = false;
let generatedOtp = "";
let recoveryTargetEmail = "";

const translations = {
    ar: {
        loginTitle: "بوابة تقانة المعلومات - جامعة النيل الأبيض",
        loginSub: "تسجيل الدخول الأكاديمي للطلاب.",
        signupTitle: "إنشاء حساب جامعي جديد",
        signupSub: "قم بتعبئة بياناتك للانضمام للمنصة.",
        name: "الاسم الكامل",
        email: "البريد الإلكتروني الجامعي",
        password: "كلمة المرور",
        confirm: "تأكيد كلمة المرور",
        remember: "تذكرني",
        forgot: "نسيت كلمة المرور؟",
        btnIn: "تسجيل الدخول",
        btnUp: "إنشاء الحساب",
        switchInText: "ليس لديك حساب؟",
        switchUpText: "لديك حساب بالفعل؟",
        linkUp: "سجل الآن",
        linkIn: "سجل دخولك",
        robotLabel: "أنا لست روبوت",
        sendCodeBtn: "إرسال رمز التحقق",
        verifyCodeBtn: "التحقق من الرمز",
        resetBtn: "إعادة تعيين كلمة المرور",
        backLogin: "العودة لتسجيل الدخول",
        lblRecEmail: "أدخل بريدك الإلكتروني المسجل",
        lblOtpText: "أدخل رمز التحقق (4 أرقام)",
        lblNewPass: "كلمة المرور الجديدة",
        lblConfirmNewPass: "تأكيد كلمة المرور الجديدة",
        strengthWeak: "ضعيفة",
        strengthFair: "مقبولة",
        strengthGood: "جيدة",
        strengthStrong: "قوية جداً",
        matchError: "كلمتا المرور غير متطابقتين",
        matchSuccess: "كلمتا المرور متطابقتان ✓",
        errFields: "الرجاء ملء جميع الحقول المطلوبة!",
        errEmail: "الرجاء إدخال بريد صالح!",
        errName: "الرجاء إدخال الاسم الكامل!",
        errPasswordLen: "يجب ألا تقل كلمة المرور عن 6 أحرف!",
        errMismatch: "كلمتا المرور غير متطابقتين!",
        errAlreadyExists: "هذا البريد مسجل مسبقاً!",
        errNotFound: "الحساب غير موجود، يرجى إنشاء حساب جديد!",
        errWrongPass: "كلمة المرور غير صحيحة!",
        errEmailNotRegistered: "هذا البريد غير مسجل في النظام!",
        errInvalidOtp: "رمز التحقق غير صحيح!",
        succSignup: "تم إنشاء الحساب الأكاديمي بنجاح!",
        succLogin: "تم تسجيل الدخول بنجاح، جاري تحويلك لوحة التحكم..."
    }
};

function changeLanguage() {
    const lang = document.getElementById('lang-select').value;
    const container = document.getElementById('main-container');
    if(container) container.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    const t = translations[lang] || translations.ar;
    const titleEl = document.getElementById('form-title');
    const subEl = document.getElementById('form-subtitle');
    if(titleEl) titleEl.innerText = isLogin ? t.loginTitle : t.signupTitle;
    if(subEl) subEl.innerText = isLogin ? t.loginSub : t.signupSub;
    
    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setTxt('lbl-name', t.name);
    setTxt('lbl-email', t.email);
    setTxt('lbl-password', t.password);
    setTxt('lbl-confirm', t.confirm);
    setTxt('lbl-remember', t.remember);
    setTxt('lnk-forgot', t.forgot);
    setTxt('submit-btn', isLogin ? t.btnIn : t.btnUp);
    setTxt('switch-text', isLogin ? t.switchInText : t.switchUpText);
    setTxt('switch-btn', isLogin ? t.linkUp : t.linkIn);
    setTxt('lbl-robot', t.robotLabel);
    setTxt('btn-send-code', t.sendCodeBtn);
    setTxt('btn-verify-otp', t.verifyCodeBtn);
    setTxt('btn-save-pass', t.resetBtn);
    setTxt('back-to-login', t.backLogin);
    setTxt('lbl-recovery-email', t.lblRecEmail);
    setTxt('lbl-otp', t.lblOtpText);
    setTxt('lbl-new-pass', t.lblNewPass);
    setTxt('lbl-confirm-new-pass', t.lblConfirmNewPass);
}

function toggleMode() {
    isLogin = !isLogin;
    const nameGroup = document.getElementById('name-group');
    const confirmGroup = document.getElementById('confirm-pass-group');
    const loginExtras = document.getElementById('login-extras');
    const strengthContainer = document.getElementById('strength-container');
    const t = translations.ar;

    if (isLogin) {
        if(nameGroup) nameGroup.classList.add('hidden-view');
        if(confirmGroup) confirmGroup.classList.add('hidden-view');
        if(loginExtras) loginExtras.classList.remove('hidden-view');
        if(strengthContainer) strengthContainer.classList.add('hidden-view');
        document.getElementById('form-title').innerText = t.loginTitle;
        document.getElementById('form-subtitle').innerText = t.loginSub;
        document.getElementById('submit-btn').innerText = t.btnIn;
        document.getElementById('switch-text').innerText = t.switchInText;
        document.getElementById('switch-btn').innerText = t.linkUp;
    } else {
        if(nameGroup) nameGroup.classList.remove('hidden-view');
        if(confirmGroup) confirmGroup.classList.remove('hidden-view');
        if(loginExtras) loginExtras.classList.add('hidden-view');
        if(strengthContainer) strengthContainer.classList.remove('hidden-view');
        document.getElementById('form-title').innerText = t.signupTitle;
        document.getElementById('form-subtitle').innerText = t.signupSub;
        document.getElementById('submit-btn').innerText = t.btnUp;
        document.getElementById('switch-text').innerText = t.switchUpText;
        document.getElementById('switch-btn').innerText = t.linkIn;
    }
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
    const strengthContainer = document.getElementById('strength-container');
    const strengthLabel = document.getElementById('strength-label');
    if (!password) {
        if(strengthContainer) strengthContainer.classList.add('hidden-view');
        return;
    }
    if(strengthContainer) strengthContainer.classList.remove('hidden-view');
    
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const bars = [document.getElementById('bar-1'), document.getElementById('bar-2'), document.getElementById('bar-3'), document.getElementById('bar-4')];
    const colors = ['#e53935', '#ffa726', '#ffeb3b', '#10b981'];
    const t = translations.ar;
    const texts = [t.strengthWeak, t.strengthFair, t.strengthGood, t.strengthStrong];

    bars.forEach((bar, index) => {
        if(bar) bar.style.background = index < score ? colors[score - 1] : '#e0e0e0';
    });
    if(strengthLabel) {
        strengthLabel.innerText = texts[score - 1] || t.strengthWeak;
        strengthLabel.style.color = colors[score - 1] || '#777';
    }
}

function checkPasswordMatch() {
    if (isLogin) return;
    const pass = document.getElementById('pass-input').value;
    const confirmPass = document.getElementById('confirm-pass-input').value;
    const matchContainer = document.getElementById('match-container');
    const matchLabel = document.getElementById('match-label');
    const t = translations.ar;

    if (!confirmPass) {
        if(matchContainer) matchContainer.classList.add('hidden-view');
        return;
    }
    if(matchContainer) matchContainer.classList.remove('hidden-view');

    if (pass === confirmPass) {
        if(matchLabel) {
            matchLabel.innerText = t.matchSuccess;
            matchLabel.style.color = '#10b981';
        }
    } else {
        if(matchLabel) {
            matchLabel.innerText = t.matchError;
            matchLabel.style.color = '#e53935';
        }
    }
}

// شاشة التحميل الفخمة (Loading Overlay)
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
            animation: fadeIn 0.3s ease;
        `;
        overlay.innerHTML = `
            <div style="width: 55px; height: 55px; border: 5px solid rgba(255,255,255,0.2); border-top: 5px solid #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            <p id="loading-text" style="margin-top: 20px; font-size: 1.15rem; font-weight: 700; letter-spacing: 0.5px;">${message}</p>
        `;
        document.body.appendChild(overlay);

        if (!document.getElementById('spin-anim')) {
            const style = document.createElement('style');
            style.id = 'spin-anim';
            style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
            document.head.appendChild(style);
        }
    } else {
        document.getElementById('loading-text').innerText = message;
        overlay.style.display = 'flex';
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'none';
}

function handleSubmit() {
    const email = document.getElementById('email-input').value.trim();
    const pass = document.getElementById('pass-input').value;
    const t = translations.ar;

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

        // إظهار التحميل والانتقال السلس التلقائي إلى لوحة التحكم بدون ضغط حسناً
        showLoadingOverlay("جاري التحقق من الاعتماد الأكاديمي...");
        
        setTimeout(() => {
            showLoadingOverlay("تم بنجاح! جاري تحويلك لوحة التحكم...");
            localStorage.setItem('it_logged_user', users[email].name);
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 800);
        }, 1000);

    } else {
        const name = document.getElementById('fullname').value.trim();
        const confirmPass = document.getElementById('confirm-pass-input').value;
        if (!name) { alert(t.errName); return; }
        if (pass.length < 6) { alert(t.errPasswordLen); return; }
        if (pass !== confirmPass) { alert(t.errMismatch); return; }

        let users = JSON.parse(localStorage.getItem('it_platform_users') || '{}');
        if (users[email]) {
            alert(t.errAlreadyExists);
            return;
        }

        showLoadingOverlay("جاري إنشاء الحساب الأكاديمي...");
        setTimeout(() => {
            users[email] = { name: name, pass: pass };
            localStorage.setItem('it_platform_users', JSON.stringify(users));
            hideLoadingOverlay();
            alert(t.succSignup);
            toggleMode();
        }, 1200);
    }
}

function startForgotPassword() {
    const authContainer = document.getElementById('auth-form-container');
    const forgotContainer = document.getElementById('forgot-flow-container');
    if(authContainer) authContainer.classList.add('hidden-view');
    if(forgotContainer) forgotContainer.classList.remove('hidden-view');
    
    const stepCaptcha = document.getElementById('step-captcha');
    const stepEmail = document.getElementById('step-email');
    const stepOtp = document.getElementById('step-otp');
    const stepNewpass = document.getElementById('step-newpass');
    
    if(stepCaptcha) stepCaptcha.classList.remove('hidden-view');
    if(stepEmail) stepEmail.classList.add('hidden-view');
    if(stepOtp) stepOtp.classList.add('hidden-view');
    if(stepNewpass) stepNewpass.classList.add('hidden-view');
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
            const stepCaptcha = document.getElementById('step-captcha');
            const stepEmail = document.getElementById('step-email');
            if(stepCaptcha) stepCaptcha.classList.add('hidden-view');
            if(stepEmail) stepEmail.classList.remove('hidden-view');
        }, 500);
    }, 1000);
}

function sendVerificationCode() {
    const emailInput = document.getElementById('recovery-email-input');
    const email = emailInput ? emailInput.value.trim() : '';
    const t = translations.ar;
    let users = JSON.parse(localStorage.getItem('it_platform_users') || '{}');

    if (!email || !users[email]) {
        alert(t.errEmailNotRegistered);
        return;
    }

    showLoadingOverlay("جاري إرسال رمز الـ OTP لبريدك...");
    setTimeout(() => {
        hideLoadingOverlay();
        recoveryTargetEmail = email;
        generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
        alert("رمز التحقق التجريبي الخاص بك هو: " + generatedOtp);
        
        const stepEmail = document.getElementById('step-email');
        const stepOtp = document.getElementById('step-otp');
        if(stepEmail) stepEmail.classList.add('hidden-view');
        if(stepOtp) stepOtp.classList.remove('hidden-view');
    }, 1000);
}

function verifyOtpCode() {
    const otpInput = document.getElementById('otp-input');
    const enteredOtp = otpInput ? otpInput.value.trim() : '';
    const t = translations.ar;

    if (enteredOtp === generatedOtp) {
        const stepOtp = document.getElementById('step-otp');
        const stepNewpass = document.getElementById('step-newpass');
        if(stepOtp) stepOtp.classList.add('hidden-view');
        if(stepNewpass) stepNewpass.classList.remove('hidden-view');
    } else {
        alert(t.errInvalidOtp);
    }
}

function saveNewPassword() {
    const newPassInput = document.getElementById('new-pass-input');
    const confirmNewPassInput = document.getElementById('confirm-new-pass-input');
    const newPass = newPassInput ? newPassInput.value : '';
    const confirmNewPass = confirmNewPassInput ? confirmNewPassInput.value : '';
    const t = translations.ar;

    if (newPass.length < 6) { alert(t.errPasswordLen); return; }
    if (newPass !== confirmNewPass) { alert(t.errMismatch); return; }

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
    const forgotContainer = document.getElementById('forgot-flow-container');
    const authContainer = document.getElementById('auth-form-container');
    if(forgotContainer) forgotContainer.classList.add('hidden-view');
    if(authContainer) authContainer.classList.remove('hidden-view');
    isCaptchaVerified = false;
    const captchaCheck = document.getElementById('captcha-check');
    const realCaptchaBox = document.getElementById('real-captcha-box');
    if(captchaCheck) captchaCheck.style.display = 'none';
    if(realCaptchaBox) realCaptchaBox.style.borderColor = '#c1c1c1';
}
