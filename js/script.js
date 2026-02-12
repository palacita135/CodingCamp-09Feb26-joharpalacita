document.addEventListener('DOMContentLoaded', function() {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
        updateWelcomeName(storedName);
    } else {
        promptForName();
    }

    initializeHamburgerMenu();
});

function updateWelcomeName(name) {
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = name;
    }
}

function promptForName() {
    const userNameElement = document.getElementById('userName');
    if (userNameElement && userNameElement.textContent === 'Guest') {
        let userName = null;
        let isValid = false;
        
        while (!isValid) {
            userName = prompt('Please input your name so we can Welcome You');
            
            if (userName === null) {
                // User clicked Cancel, show the same message again
                continue;
            }
            
            if (userName.trim() !== '') {
                isValid = true;
                const trimmedName = userName.trim();
                localStorage.setItem('userName', trimmedName);
                updateWelcomeName(trimmedName);
            }
            // If empty, loop continues and shows prompt again
        }
    }
}

function initializeHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(event) {
    event.preventDefault();

    clearAllErrors();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value.trim();

    let isValid = true;

    if (!name) {
        showError('name', 'Name is required');
        isValid = false;
    } else if (name.length < 3) {
        showError('name', 'Name must be at least 3 characters');
        isValid = false;
    } else if (!isValidName(name)) {
        showError('name', 'Name can only contain letters and spaces');
        isValid = false;
    }

    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    if (!phone) {
        showError('phone', 'Phone number is required');
        isValid = false;
    } else if (!isValidPhone(phone)) {
        showError('phone', 'Please enter a valid phone number (only numbers and hyphens)');
        isValid = false;
    }

    if (isValid) {
        processFormSubmission(name, email, phone, subject);
    }
}

function isValidName(name) {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[0-9\-\s()]+$/;
    const digitsOnly = phone.replace(/\D/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 7;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');

    if (field && errorElement) {
        field.classList.add('error');
        errorElement.textContent = message;
    }
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-text');
    const inputElements = document.querySelectorAll('.form-group input');

    errorElements.forEach(element => {
        element.textContent = '';
    });

    inputElements.forEach(element => {
        element.classList.remove('error');
    });
}

function processFormSubmission(name, email, phone, subject) {
    localStorage.setItem('userName', name);
    updateWelcomeName(name);

    const resultSection = document.getElementById('resultSection');
    const resultContent = document.getElementById('resultContent');

    if (resultSection && resultContent) {
        const resultHTML = `
            <div class="result-content-item">
                <strong>Name:</strong>
                <span>${escapeHtml(name)}</span>
            </div>
            <div class="result-content-item">
                <strong>Email:</strong>
                <span>${escapeHtml(email)}</span>
            </div>
            <div class="result-content-item">
                <strong>Phone:</strong>
                <span>${escapeHtml(phone)}</span>
            </div>
            ${subject ? `
            <div class="result-content-item">
                <strong>Subject:</strong>
                <span>${escapeHtml(subject)}</span>
            </div>
            ` : ''}
            <p style="text-align: center; margin-top: 20px; color: var(--success-color); font-weight: 600;">
                ✓ Your message has been received successfully
            </p>
        `;

        resultContent.innerHTML = resultHTML;
        resultSection.style.display = 'block';

        resultSection.scrollIntoView({ behavior: 'smooth' });

        document.getElementById('contactForm').reset();

        setTimeout(function() {
            resultSection.style.display = 'none';
        }, 5000);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

if (nameInput) {
    nameInput.addEventListener('blur', function() {
        clearError('name');
        if (this.value.trim()) {
            if (!isValidName(this.value.trim())) {
                showError('name', 'Name can only contain letters and spaces');
            } else if (this.value.trim().length < 3) {
                showError('name', 'Name must be at least 3 characters');
            }
        }
    });
}

if (emailInput) {
    emailInput.addEventListener('blur', function() {
        clearError('email');
        if (this.value.trim() && !isValidEmail(this.value.trim())) {
            showError('email', 'Please enter a valid email address');
        }
    });
}

if (phoneInput) {
    phoneInput.addEventListener('blur', function() {
        clearError('phone');
        if (this.value.trim() && !isValidPhone(this.value.trim())) {
            showError('phone', 'Please enter a valid phone number (only numbers and hyphens)');
        }
    });
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');

    if (field && errorElement) {
        field.classList.remove('error');
        errorElement.textContent = '';
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.animation = 'slideDown 0.6s ease-out';
        }
    });
}, observerOptions);

document.querySelectorAll(
    '.location-card, .stat-item, .vm-card, .value-card, .contact-item'
).forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

const formInputs = document.querySelectorAll('.form-group input');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
    });

    input.addEventListener('blur', function() {
        if (!this.classList.contains('error')) {
            this.style.boxShadow = 'none';
        }
    });
});

if (contactForm) {
    let isSubmitting = false;

    contactForm.addEventListener('submit', function(e) {
        if (isSubmitting) {
            e.preventDefault();
            return;
        }
        isSubmitting = true;

        setTimeout(() => {
            isSubmitting = false;
        }, 2000);
    });
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
    });
}

console.log('✓ MyWebsite - JavaScript loaded successfully');
