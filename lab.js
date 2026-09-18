document.addEventListener('DOMContentLoaded', () => {
    const loggedUser = localStorage.getItem('it_logged_user');
    if (loggedUser && window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
    }
    const savedTheme = localStorage.getItem('it_theme') || 'light';
    const savedLang = localStorage.getItem('it_lang') || 'ar';
    document.body.setAttribute('data-theme', savedTheme);
    const themeBtn = document.getElementById('theme-toggle');
    if(themeBtn) themeBtn.innerText = savedTheme === 'dark' ? '☀️' : '🌙';
    
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
        succSignup: "تم إنشاء الحساب الأكاديمي بنجاح!",
        loadLogin: "جاري التحقق من الاعتماد الأكاديمي...",
        loadRedirect: "تم بنجاح! جاري تحويلك لوحة التحكم...",
        loadSignup: "جاري إنشاء الحساب الأكاديمي..."
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
        succSignup: "Account created successfully!",
        loadLogin: "Verifying academic credentials...",
        loadRedirect: "Success! Redirecting to dashboard...",
        loadSignup: "Creating academic account..."
    }
};

function changeLanguage() {
    const lang = document.getElementById('lang-select').value;
    localStorage.setItem('it_lang', lang);
    const container = document.getElementById('main-container');
    if(container) container.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    const t = translationsLogin[lang] || translationsLogin.ar;
    
    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setTxt('uni-mini-title', t.miniTitle);
    setTxt('uni-mini-sub', t.miniSub);
    setTxt('nav-home', t.home);
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
    const lang = localStorage.getItem('it_lang') || 'ar';
    const t = translationsLogin[lang] || translationsLogin.ar;

    signupFields.forEach(field => {
        if (isLogin) {
            field.classList.add('hidden-view');
        } else {
            field.classList.remove('hidden-view');
        }
    });

    if (isLogin) {
        if(loginExtras) loginExtras.classList.remove('hidden-view');
        document.getElementById('form-title').innerText = t.loginTitle;
        document.getElementById('form-subtitle').innerText = t.loginSub;
        document.getElementById('submit-btn').innerText = t.btnIn;
        document.getElementById('switch-text').innerText = t.switchInText;
        document.getElementById('switch-btn').innerText = t.linkUp;
    } else {
        if(loginExtras) loginExtras.classList.add('hidden-view');
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
            animation: fadeIn 0.3s ease;
        `;
        overlay.innerHTML = `
            <div style="width: 50px; height: 50px; border: 5px solid rgba(255,255,255,0.2); border-top: 5px solid #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            <p id="loading-text" style="margin-top: 15px; font-size: 1.05rem; font-weight: 700;">${message}</p>
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

function handleSubmit() {
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
        
        if (!name) { alert(t.errFields); return; }

        let users = JSON.parse(localStorage.getItem('it_platform_users') || '{}');
        if (users[email]) {
            alert(t.errAlreadyExists);
            return;
        }

        showLoadingOverlay(t.loadSignup);
        setTimeout(() => {
            users[email] = { name: name, studentId: studentId, semester: semester, pass: pass };
            localStorage.setItem('it_platform_users', JSON.stringify(users));
            const overlay = document.getElementById('loading-overlay');
            if(overlay) overlay.style.display = 'none';
            alert(t.succSignup);
            toggleMode();
        }, 1000);
    }
}

// دالة نسيت كلمة المرور المحدثة والمنظمة بدقة
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
        
        const stepEmail = document.getElementById('step-email');
        const stepOtp = document.getElementById('step-otp');
        if(stepEmail) stepEmail.classList.add('hidden-view');
        if(stepOtp) stepOtp.classList.remove('hidden-view');
    }, 1000);
}

function verifyOtpCode() {
    const otpInput = document.getElementById('otp-input');
    const enteredOtp = otpInput ? otpInput.value.trim() : '';

    if (enteredOtp === generatedOtp) {
        const stepOtp = document.getElementById('step-otp');
        const stepNewpass = document.getElementById('step-newpass');
        if(stepOtp) stepOtp.classList.add('hidden-view');
        if(stepNewpass) stepNewpass.classList.remove('hidden-view');
    } else {
        alert("رمز التحقق غير صحيح!");
    }
}

function saveNewPassword() {
    const newPassInput = document.getElementById('new-pass-input');
    const confirmNewPassInput = document.getElementById('confirm-new-pass-input');
    const newPass = newPassInput ? newPassInput.value : '';
    const confirmNewPass = confirmNewPassInput ? confirmNewPassInput.value : '';

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
    const forgotContainer = document.getElementById('forgot-flow-container');
    const authContainer = document.getElementById('auth-form-container');
    if(forgotContainer) forgotContainer.classList.add('hidden-view');
    if(authContainer) authContainer.classList.remove('hidden-view');
    isCaptchaVerified = false;
    const captchaCheck = document.getElementById('captcha-check');
    if(captchaCheck) captchaCheck.style.display = 'none';
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('it_theme', newTheme);
    const themeBtn = document.getElementById('theme-toggle');
    if(themeBtn) themeBtn.innerText = newTheme === 'dark' ? '☀️' : '🌙';
}
