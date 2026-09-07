class PremiumAuth {
    constructor() {
        this.currentUser = null;
        this.selectedRole = 'customer';
        this.init();
    }

    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupPasswordStrengthChecker();
    }

    cacheElements() {
        this.loginContainer = document.getElementById('loginContainer');
        this.signupContainer = document.getElementById('signupContainer');
        this.loginForm = document.getElementById('loginForm');
        this.signupForm = document.getElementById('signupForm');
        this.loginEmail = document.getElementById('loginEmail');
        this.loginPassword = document.getElementById('loginPassword');
        this.loginBtn = document.getElementById('loginBtn');
        this.loginRoleText = document.getElementById('loginRoleText');
        
        // General Signup
        this.fullName = document.getElementById('fullName');
        this.signupEmail = document.getElementById('signupEmail');
        this.signupPassword = document.getElementById('signupPassword');
        this.confirmPassword = document.getElementById('confirmPassword');
        
        // Worker Fields
        this.workerExtraFields = document.getElementById('workerExtraFields');
        this.aadharNumber = document.getElementById('aadharNumber');
        this.panNumber = document.getElementById('panNumber');
        this.workerSkill = document.getElementById('workerSkill');
        this.workerPhone = document.getElementById('workerPhone');
        this.workerCity = document.getElementById('workerCity');
        this.workerExp = document.getElementById('workerExp');

        // Cooperative Fields
        this.coopExtraFields = document.getElementById('coopExtraFields');
        this.coopName = document.getElementById('coopName');
        this.coopRegNum = document.getElementById('coopRegNum');
        this.coopPhone = document.getElementById('coopPhone');
        this.coopState = document.getElementById('coopState');
        this.coopDistrict = document.getElementById('coopDistrict');
        this.coopMembers = document.getElementById('coopMembers');

        this.signupBtn = document.getElementById('signupBtn');
        this.signupRoleText = document.getElementById('signupRoleText');
        
        this.successModal = document.getElementById('successModal');
        this.successTitle = document.getElementById('successTitle');
        this.successMessage = document.getElementById('successMessage');
    }

    setupEventListeners() {
        this.loginForm?.addEventListener('submit', (e) => this.handleLoginSubmit(e));
        this.signupForm?.addEventListener('submit', (e) => this.handleSignupSubmit(e));

        document.querySelectorAll('.role-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setRole(e.currentTarget.dataset.role));
        });

        document.getElementById('switchToSignup')?.addEventListener('click', (e) => { e.preventDefault(); this.switchForms('signup'); });
        document.getElementById('switchToLogin')?.addEventListener('click', (e) => { e.preventDefault(); this.switchForms('login'); });

        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', (e) => this.togglePasswordVisibility(e));
        });
    }

    setupPasswordStrengthChecker() {
        this.signupPassword?.addEventListener('input', () => this.updatePasswordStrength(this.signupPassword.value));
    }

    setRole(role) {
        this.selectedRole = role;
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

        // Update Pill Background Color Logic
        document.querySelectorAll('.role-selector').forEach(selector => {
            selector.classList.remove('worker-selected', 'coop-selected');
            if (role === 'worker') selector.classList.add('worker-selected');
            if (role === 'cooperative') selector.classList.add('coop-selected');
        });

        // Update Active Button Text Color
        document.querySelectorAll('.role-btn').forEach(btn => {
            btn.dataset.role === role ? btn.classList.add('active') : btn.classList.remove('active');
        });

        // Update Button Labels
        if (this.loginRoleText) this.loginRoleText.textContent = formattedRole;
        if (this.signupRoleText) this.signupRoleText.textContent = formattedRole;
        
        // Dynamic Label for "Full Name"
        const nameLabel = document.querySelector('label[for="fullName"]');
        if (nameLabel) {
            nameLabel.innerText = role === 'cooperative' ? 'Authorized Representative Name' : 'Full Name';
        }
        
        // Show/Hide Fields
        if (this.workerExtraFields) this.workerExtraFields.style.display = (role === 'worker') ? 'block' : 'none';
        if (this.coopExtraFields) this.coopExtraFields.style.display = (role === 'cooperative') ? 'block' : 'none';
    }

    switchForms(targetForm) {
        const currentActive = this.loginContainer?.classList.contains('active') ? this.loginContainer : this.signupContainer;
        const targetContainer = targetForm === 'signup' ? this.signupContainer : this.loginContainer;
        if (!currentActive || !targetContainer) return;
        currentActive.classList.add('exit');
        setTimeout(() => {
            currentActive.classList.remove('active', 'exit');
            targetContainer.classList.add('active');
        }, 300);
    }

    calculatePasswordStrength(password) {
        if (!password) return 'empty';
        let str = 0;
        if (password.length >= 8) str++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) str++;
        if (/\d/.test(password)) str++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) str++;
        return str <= 2 ? 'weak' : str === 3 ? 'medium' : 'strong';
    }

    updatePasswordStrength(password) {
        const str = this.calculatePasswordStrength(password);
        const bars = document.querySelectorAll('.strength-bar');
        const text = document.getElementById('strengthText');
        bars.forEach(bar => bar.classList.remove('weak', 'medium', 'strong'));
        
        if (!text) return;
        if (password.length === 0) { text.textContent = 'Enter password'; text.className = 'strength-text'; return; }
        
        if (str === 'weak') { bars[0]?.classList.add('weak'); text.textContent = 'Weak password'; text.className = 'strength-text weak'; }
        else if (str === 'medium') { bars[0]?.classList.add('medium'); bars[1]?.classList.add('medium'); text.textContent = 'Medium password'; text.className = 'strength-text medium'; }
        else { bars.forEach(b => b.classList.add('strong')); text.textContent = 'Strong password'; text.className = 'strength-text strong'; }
    }

    togglePasswordVisibility(e) {
        e.preventDefault();
        const btn = e.currentTarget;
        const field = document.getElementById(btn.dataset.target);
        if (!field) return;

        if (field.type === 'password') {
            field.type = 'text';
            btn.innerHTML = `<svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
        } else {
            field.type = 'password';
            btn.innerHTML = `<svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
        }
    }

    validateField(field, condition, message) {
        if (!field) return false;
        if (!condition) {
            field.classList.add('error');
            const err = field.closest('.input-wrapper')?.querySelector('.error-message');
            if (err) err.textContent = message;
            return false;
        }
        field.classList.remove('error');
        const err = field.closest('.input-wrapper')?.querySelector('.error-message');
        if (err) err.textContent = '';
        return true;
    }

    async handleLoginSubmit(e) {
        e.preventDefault();
        const email = this.loginEmail.value.trim();
        const password = this.loginPassword.value;

        // 🚨 MAGIC ADMIN BYPASS 🚨
        if (email === 'admin@sharmnexus.com' && password === 'admin123') {
            this.setButtonLoading(this.loginBtn, true);
            await new Promise(r => setTimeout(r, 800));
            localStorage.setItem('sharmnexus-admin-auth', 'true');
            window.location.href = 'admin-dashboard.html';
            return; 
        }

        const emailValid = this.validateField(this.loginEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Enter valid email');
        const passValid = this.validateField(this.loginPassword, password.length >= 8, 'Min 8 characters');
        if (!emailValid || !passValid) return;

        this.setButtonLoading(this.loginBtn, true);
        await new Promise(r => setTimeout(r, 1200));

        this.currentUser = { email: email, role: this.selectedRole };
        this.showSuccessAnimation('Login Successful!', `Welcome back (${this.selectedRole})!`);
        setTimeout(() => this.handleAuthenticationSuccess(), 1800);
    }

    async handleSignupSubmit(e) {
        e.preventDefault();
        const nameValid = this.validateField(this.fullName, this.fullName.value.trim().length >= 2, 'Required field');
        const emailValid = this.validateField(this.signupEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.signupEmail.value.trim()), 'Enter valid email');
        const passValid = this.validateField(this.signupPassword, this.signupPassword.value.length >= 8, 'Min 8 characters');
        const matchValid = this.validateField(this.confirmPassword, this.confirmPassword.value === this.signupPassword.value, 'Passwords do not match');
        
        let extraValid = true;
        if (this.selectedRole === 'worker') {
            const aadhaarValid = this.validateField(this.aadharNumber, this.aadharNumber.value.trim() !== '', 'Required');
            const panValid = this.validateField(this.panNumber, this.panNumber.value.trim() !== '', 'Required');
            extraValid = aadhaarValid && panValid;
        } else if (this.selectedRole === 'cooperative') {
            const cNameValid = this.validateField(this.coopName, this.coopName.value.trim() !== '', 'Required');
            const cRegValid = this.validateField(this.coopRegNum, this.coopRegNum.value.trim() !== '', 'Required');
            extraValid = cNameValid && cRegValid;
        }

        if (!nameValid || !emailValid || !passValid || !matchValid || !extraValid) return;

        this.setButtonLoading(this.signupBtn, true);
        await new Promise(r => setTimeout(r, 1200));

        this.currentUser = { 
            fullName: this.fullName.value, 
            role: this.selectedRole,
            email: this.signupEmail.value
        };

        // Capture extra data based on role
        if(this.selectedRole === 'worker') {
            this.currentUser.skill = this.workerSkill?.value;
        } else if (this.selectedRole === 'cooperative') {
            this.currentUser.coopName = this.coopName?.value;
            this.currentUser.coopMembers = this.coopMembers?.value;
        }
        
        this.showSuccessAnimation('Account Created!', `Welcome to SharmNexus as a ${this.selectedRole}!`);
        setTimeout(() => this.handleAuthenticationSuccess(), 1800);
    }

    showSuccessAnimation(title, message) {
        if (this.successTitle) this.successTitle.textContent = title;
        if (this.successMessage) this.successMessage.textContent = message;
        this.successModal?.classList.add('active');
    }

    setButtonLoading(btn, isLoading) {
        if (!btn) return;
        btn.classList.toggle('loading', isLoading);
        btn.disabled = isLoading;
    }

    handleAuthenticationSuccess() {
        this.successModal?.classList.remove('active');
        
        const sessionData = {
            isLoggedIn: true,
            role: this.selectedRole,
            name: this.currentUser?.fullName || this.currentUser?.email || "User",
            id: this.selectedRole + Math.floor(Math.random() * 900) + 100,
        };
        
        if (this.selectedRole === 'worker') {
            sessionData.skills = [this.currentUser?.skill || "General"];
            sessionData.available = true;
        } else if (this.selectedRole === 'cooperative') {
            sessionData.coopName = this.currentUser?.coopName || "Registered Society";
        }

        localStorage.setItem('sharmnexus-auth', JSON.stringify(sessionData));
        
        // --- 3-WAY ROUTING LOGIC ---
        if (this.selectedRole === 'worker') {
            window.location.href = 'worker-dashboard.html';
        } else if (this.selectedRole === 'cooperative') {
            window.location.href = 'cooperative-portal.html';
        } else {
            window.location.href = 'sharmnexus-landing-updated.html'; 
        }
    }
}

document.addEventListener('DOMContentLoaded', () => window.auth = new PremiumAuth());