lottie.loadAnimation({
    container: document.getElementById('lottie-animation'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'https://assets2.lottiefiles.com/packages/lf20_jcikwtux.json'
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
        succLogin: "تم تسجيل الدخول بنجاح، جاري تحويلك للمنصة..."
    }
};

function changeLanguage() {
    const lang = document.getElementById('lang-select').value;
    const container = document.getElementById('main-container');
    container.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    const t = translations[lang] || translations.ar;
    document.getElementById('form-title').innerText = isLogin ? t.loginTitle : t.signupTitle;
    document.getElementById('form-subtitle').innerText = isLogin ? t.loginSub : t.signupSub;
    document.getElementById('lbl-name').innerText = t.name;
    document.getElementById('lbl-email').innerText = t.email;
    document.getElementById('lbl-password').innerText = t.password;
    document.getElementById('lbl-confirm').innerText = t.confirm;
    document.getElementById('lbl-remember').innerText = t.remember;
    document.getElementById('lnk-forgot').innerText = t.forgot;
    document.getElementById('submit-btn').innerText = isLogin ? t.btnIn : t.btnUp;
    document.getElementById('switch-text').innerText = isLogin ? t.switchInText : t.switchUpText;
    document.getElementById('switch-btn').innerText = isLogin ? t.linkUp : t.linkIn;
    document.getElementById('lbl-robot').innerText = t.robotLabel;
    document.getElementById('btn-send-code').innerText = t.sendCodeBtn;
    document.getElementById('btn-verify-otp').innerText = t.verifyCodeBtn;
    document.getElementById('btn-save-pass').innerText = t.resetBtn;
    document.getElementById('back-to-login').innerText = t.backLogin;
    document.getElementById('lbl-recovery-email').innerText = t.lblRecEmail;
    document.getElementById('lbl-otp').innerText = t.lblOtpText;
    document.getElementById('lbl-new-pass').innerText = t.lblNewPass;
    document.getElementById('lbl-confirm-new-pass').innerText = t.lblConfirmNewPass;
}

function toggleMode() {
    isLogin = !isLogin;
    const nameGroup = document.getElementById('name-group');
    const confirmGroup = document.getElementById('confirm-pass-group');
    const loginExtras = document.getElementById('login-extras');
    const strengthContainer = document.getElementById('strength-container');
    const t = translations.ar;

    if (isLogin) {
        nameGroup.classList.add('hidden-view');
        confirmGroup.classList.add('hidden-view');
        loginExtras.classList.remove('hidden-view');
        strengthContainer.classList.add('hidden-view');
        document.getElementById('form-title').innerText = t.loginTitle;
        document.getElementById('form-subtitle').innerText = t.loginSub;
        document.getElementById('submit-btn').innerText = t.btnIn;
        document.getElementById('switch-text').innerText = t.switchInText;
        document.getElementById('switch-btn').innerText = t.linkUp;
    } else {
        nameGroup.classList.remove('hidden-view');
        confirmGroup.classList.remove('hidden-view');
        loginExtras.classList.add('hidden-view');
        strengthContainer.classList.remove('hidden-view');
        document.getElementById('form-title').innerText = t.signupTitle;
        document.getElementById('form-subtitle').innerText = t.signupSub;
        document.getElementById('submit-btn').innerText = t.btnUp;
        document.getElementById('switch-text').innerText = t.switchUpText;
        document.getElementById('switch-btn').innerText = t.linkIn;
    }
}

function showPassword(inputId, event) {
    event.preventDefault();
    document.getElementById(inputId).type = 'text';
}

function hidePassword(inputId, event) {
    event.preventDefault();
    document.getElementById(inputId).type = 'password';
}

function checkPasswordStrength(password) {
    const strengthContainer = document.getElementById('strength-container');
    const strengthLabel = document.getElementById('strength-label');
    if (!password) {
        strengthContainer.classList.add('hidden-view');
        return;
    }
    strengthContainer.classList.remove('hidden-view');
    
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
        bar.style.background = index < score ? colors[score - 1] : '#e0e0e0';
    });
    strengthLabel.innerText = texts[score - 1] || t.strengthWeak;
    strengthLabel.style.color = colors[score - 1] || '#777';
}

function checkPasswordMatch() {
    if (isLogin) return;
    const pass = document.getElementById('pass-input').value;
    const confirmPass = document.getElementById('confirm-pass-input').value;
    const matchContainer = document.getElementById('match-container');
    const matchLabel = document.getElementById('match-label');
    const t = translations.ar;

    if (!confirmPass) {
        matchContainer.classList.add('hidden-view');
        return;
    }
    matchContainer.classList.remove('hidden-view');

    if (pass === confirmPass) {
        matchLabel.innerText = t.matchSuccess;
        matchLabel.style.color = '#10b981';
    } else {
        matchLabel.innerText = t.matchError;
        matchLabel.style.color = '#e53935';
    }
}

// عرض شاشة الـ Loading الاحترافية بتصميم متطور
function showLoadingOverlay(message) {
    let overlay = document.getElementById('loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15, 44, 89, 0.85); backdrop-filter: blur(8px);
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            z-index: 9999; color: white; font-family: 'Cairo', sans-serif;
            animation: fadeIn 0.3s ease;
        `;
        overlay.innerHTML = `
            <div style="width: 50px; height: 50px; border: 5px solid rgba(255,255,255,0.2); border-top: 5px solid #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            <p id="loading-text" style="margin-top: 20px; font-size: 1.1rem; font-weight: 700; letter-spacing: 0.5px;">${message}</p>
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

        // تشغيل شاشة التحميل الفخمة والانتقال السلس بدون ضغط "حسناً"
        showLoadingOverlay("جاري التحقق من الاعتماد الأكاديمي...");
        
        setTimeout(() => {
            showLoadingOverlay("تم بنجاح! جاري تحويلك للمنصة...");
            localStorage.setItem('it_logged_user', users[email].name);
            setTimeout(() => {
                window.location.href = 'index.html';
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

        showLoadingOverlay("جاري إنشاء الحساب في النظام...");
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
    document.getElementById('auth-form-container').classList.add('hidden-view');
    document.getElementById('forgot-flow-container').classList.remove('hidden-view');
    document.getElementById('step-captcha').classList.remove('hidden-view');
    document.getElementById('step-email').classList.add('hidden-view');
    document.getElementById('step-otp').classList.add('hidden-view');
    document.getElementById('step-newpass').classList.add('hidden-view');
}

function triggerRealCaptcha() {
    const spinner = document.getElementById('captcha-spinner');
    const check = document.getElementById('captcha-check');
    spinner.style.display = 'block';
    setTimeout(() => {
        spinner.style.display = 'none';
        check.style.display = 'block';
        isCaptchaVerified = true;
        setTimeout(() => {
            document.getElementById('step-captcha').classList.add('hidden-view');
            document.getElementById('step-email').classList.remove('hidden-view');
        }, 500);
    }, 1000);
}

function sendVerificationCode() {
    const email = document.getElementById('recovery-email-input').value.trim();
    const t = translations.ar;
    let users = JSON.parse(localStorage.getItem('it_platform_users') || '{}');

    if (!email || !users[email]) {
        alert(t.errEmailNotRegistered);
        return;
    }

    showLoadingOverlay("جاري إرسال رمز الـ OTP لبريدك الجامعي...");
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
    const t = translations.ar;

    if (enteredOtp === generatedOtp) {
        document.getElementById('step-otp').classList.add('hidden-view');
        document.getElementById('step-newpass').classList.remove('hidden-view');
    } else {
        alert(t.errInvalidOtp);
    }
}

function saveNewPassword() {
    const newPass = document.getElementById('new-pass-input').value;
    const confirmNewPass = document.getElementById('confirm-new-pass-input').value;
    const t = translations.ar;

    if (newPass.length < 6) { alert(t.errPasswordLen); return; }
    if (newPass !== confirmNewPass) { alert(t.errMismatch); return; }

    showLoadingOverlay("جاري تحديث كلمة المرور في النظام...");
    setTimeout(() => {
        let users = JSON.parse(localStorage.getItem('it_platform_users') || '{}');
        if (users[recoveryTargetEmail]) {
            users[recoveryTargetEmail].pass = newPass;
            localStorage.setItem('it_platform_users', JSON.stringify(users));
            hideLoadingOverlay();
            alert(t.succPassReset);
            backToLogin();
        }
    }, 1000);
}

function backToLogin() {
    document.getElementById('forgot-flow-container').classList.add('hidden-view');
    document.getElementById('auth-form-container').classList.remove('hidden-view');
    isCaptchaVerified = false;
    document.getElementById('captcha-check').style.display = 'none';
    document.getElementById('real-captcha-box').style.borderColor = '#c1c1c1';
}
