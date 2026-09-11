class ShramNexusChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.userRole = this.getUserRole();
        
        // Define Quick Actions based on Role
        this.quickActions = this.getQuickActionsByRole();
        
        this.initUI();
    }

    getUserRole() {
        try {
            const authData = JSON.parse(localStorage.getItem('sharmnexus-auth'));
            return authData && authData.isLoggedIn ? authData.role : 'guest';
        } catch (e) {
            return 'guest';
        }
    }

    getQuickActionsByRole() {
        const commonActions = ["Find a Worker", "Book a Service", "Join a Cooperative"];
        switch (this.userRole) {
            case 'customer':
                return ["Track My Booking", "Find a Cooperative", "Payment Help"];
            case 'worker':
                return ["My Earnings", "Join a Cooperative", "Update Availability"];
            case 'cooperative':
                return ["Add New Worker", "Manage Community Contracts", "Welfare Fund Details"];
            case 'admin':
                return ["Verify Worker", "Platform Analytics", "Manage Disputes"];
            default:
                return commonActions;
        }
    }

    initUI() {
        // Create Container
        this.container = document.createElement('div');
        this.container.id = 'sn-chatbot-container';

        // Inject HTML
        this.container.innerHTML = `
            <div id="sn-chat-window">
                <div id="sn-chat-header">
                    <div class="sn-chat-title">
                        <strong>ShramNexus Assistant</strong>
                        <div class="sn-chat-status"><span class="sn-status-dot"></span> Online</div>
                    </div>
                    <div class="sn-header-actions">
                        <button id="sn-chat-clear" title="Clear Chat">↻</button>
                        <button id="sn-chat-close">✕</button>
                    </div>
                </div>
                <div id="sn-chat-messages"></div>
                <div class="sn-support-link">Need human help? <a href="#">Contact Support</a></div>
                <div id="sn-chat-input-area">
                    <textarea id="sn-chat-input" placeholder="Type your message... (Shift+Enter for new line)"></textarea>
                    <button id="sn-send-btn">➤</button>
                </div>
            </div>
            <button id="sn-chat-btn" title="Open ShramNexus Assistant">💬</button>
        `;

        document.body.appendChild(this.container);

        // Cache Elements
        this.chatWindow = document.getElementById('sn-chat-window');
        this.chatBtn = document.getElementById('sn-chat-btn');
        this.closeBtn = document.getElementById('sn-chat-close');
        this.clearBtn = document.getElementById('sn-chat-clear');
        this.messagesContainer = document.getElementById('sn-chat-messages');
        this.inputField = document.getElementById('sn-chat-input');
        this.sendBtn = document.getElementById('sn-send-btn');

        // Event Listeners
        this.chatBtn.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.toggleChat());
        this.clearBtn.addEventListener('click', () => this.clearChat());
        this.sendBtn.addEventListener('click', () => this.handleSend());
        
        this.inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });

        // Initialize Welcome Message
        this.showWelcomeMessage();
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.chatWindow.classList.add('active');
            this.inputField.focus();
        } else {
            this.chatWindow.classList.remove('active');
        }
    }

    clearChat() {
        this.messagesContainer.innerHTML = '';
        this.showWelcomeMessage();
    }

    formatTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    addMessage(text, sender, isHTML = false) {
        const msgWrapper = document.createElement('div');
        msgWrapper.className = `sn-msg-wrapper ${sender}`;
        
        const content = isHTML ? text : text.replace(/\n/g, '<br>');

        msgWrapper.innerHTML = `
            <div class="sn-msg">${content}</div>
            <div class="sn-msg-time">${this.formatTime()}</div>
        `;
        
        this.messagesContainer.appendChild(msgWrapper);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const msgWrapper = document.createElement('div');
        msgWrapper.className = `sn-msg-wrapper bot`;
        msgWrapper.id = id;
        msgWrapper.innerHTML = `
            <div class="sn-msg sn-typing">
                <div class="sn-dot"></div><div class="sn-dot"></div><div class="sn-dot"></div>
            </div>
        `;
        this.messagesContainer.appendChild(msgWrapper);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        return id;
    }

    removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    showWelcomeMessage() {
        const welcomeText = `👋 Hello! I'm the ShramNexus Assistant. I can help you with workers, services, cooperatives, bookings, and other platform-related questions. How can I help you today?`;
        this.addMessage(welcomeText, 'bot');

        // Add Quick Actions
        const qaContainer = document.createElement('div');
        qaContainer.className = 'sn-quick-actions';
        
        this.quickActions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = 'sn-qa-btn';
            btn.innerText = action;
            btn.onclick = () => {
                this.inputField.value = action;
                this.handleSend();
            };
            qaContainer.appendChild(btn);
        });

        const msgWrapper = document.createElement('div');
        msgWrapper.className = `sn-msg-wrapper bot`;
        msgWrapper.style.marginTop = '-10px';
        msgWrapper.appendChild(qaContainer);
        this.messagesContainer.appendChild(msgWrapper);
    }

    async handleSend() {
        const text = this.inputField.value.trim();
        if (!text) return;

        this.inputField.value = '';
        this.addMessage(text, 'user');

        const typingId = this.showTypingIndicator();

        // ----------------------------------------------------------------------
        // SECURE API INTEGRATION POINT
        // ----------------------------------------------------------------------
        // In production, uncomment the fetch call below to hit your Node.js backend.
        // DO NOT embed OpenAI keys here.
        /*
        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: text, role: this.userRole })
            });
            const data = await response.json();
            this.removeTypingIndicator(typingId);
            this.addMessage(data.reply, 'bot');
        } catch (error) {
            this.removeTypingIndicator(typingId);
            this.addMessage("I'm currently unable to reach the server. Please check your connection or contact support.", 'bot');
        }
        */

        // ----------------------------------------------------------------------
        // FRONTEND DEMO FALLBACK RESPONDER
        // ----------------------------------------------------------------------
        setTimeout(() => {
            this.removeTypingIndicator(typingId);
            let reply = this.getDemoResponse(text.toLowerCase());
            this.addMessage(reply, 'bot', true);
        }, 1200);
    }

    getDemoResponse(query) {
        // Security Rules
        if (query.includes('admin') && query.includes('url') || query.includes('password') || query.includes('key')) {
            return "I cannot provide sensitive system information, credentials, or internal URLs due to security protocols.";
        }
        // Role-based logic & General QA
        if (query.includes('find') && (query.includes('worker') || query.includes('electrician'))) {
            return "Go to the <strong>Services</strong> section. You can browse available individual workers or cooperative societies, compare ratings, and send a booking request.";
        }
        if (query.includes('cooperative instead of') || query.includes('hire a cooperative')) {
            return "Yes! ShramNexus gives you the choice to hire verified Individual Workers directly, or book through a verified Labour Cooperative Society for community contracts and larger jobs.";
        }
        if (query.includes('federation')) {
            return "A federation connects and represents multiple cooperatives, helping them collaborate, coordinate resources, and improve access to opportunities through the ShramNexus ecosystem.";
        }
        if (query.includes('track') || query.includes('booking')) {
            return this.userRole === 'customer' 
                ? "You can view the real-time status of your bookings in the <strong>My Bookings</strong> tab on your dashboard."
                : "Customers can track bookings via their dashboard. As a worker, check your <strong>My Jobs</strong> tab for active assignments.";
        }
        if (query.includes('earnings') || query.includes('payment')) {
            if (this.userRole === 'cooperative') return "View your detailed payment distributions, worker payouts, and Welfare Fund contributions in the <strong>Payments & Dist.</strong> tab of the Cooperative Portal.";
            if (this.userRole === 'worker') return "You can track your completed jobs, earnings, and cooperative dividends in the <strong>Earnings</strong> section of your dashboard.";
            return "All payments are processed securely. You can view payment breakdowns (Worker Share, Cooperative Share, Welfare Fund) on your booking receipt.";
        }
        return "I'm not completely sure about that. Please check the relevant ShramNexus dashboard section or use the <strong>Contact Support</strong> link below for assistance.";
    }
}

// Initialize Chatbot when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.snChatbot = new ShramNexusChatbot();
});