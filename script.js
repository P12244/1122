// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for fixed header
                behavior: 'smooth'
            });
            
            // Update active link
            document.querySelectorAll('.nav-links li a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// Scroll Highlighting Logic (Optional Improvement)
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links li a');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').substring(1) === current) {
            item.classList.add('active');
        }
    });
});

/* ===== Course Modal: populate and control =====
   - Reads data-* attributes from .curriculum-card
   - Opens accessible modal with fade/slide animation
   - Closes on backdrop click, close button, Esc key, or focus loss
*/

// Utility: select modal elements
const courseModal = document.getElementById('course-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalCloseBtn = document.getElementById('modal-close');
const modalTitle = document.getElementById('course-modal-title');
const modalImg = document.querySelector('.modal-img'); // image element inside modal
const modalDesc = document.querySelector('.modal-desc');
const modalSkills = document.querySelector('.modal-skills');
const modalCareer = document.querySelector('.modal-career');

// Open modal and populate content
function openCourseModal(data) {
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.description;
    modalSkills.textContent = data.skills;
    modalCareer.textContent = data.career;

    // Populate modal image if provided (use alt text for accessibility)
    if (data.img) {
        modalImg.src = data.img;
        modalImg.alt = data.imgAlt || data.title;
        modalImg.style.display = '';
    } else {
        modalImg.src = '';
        modalImg.alt = '';
        modalImg.style.display = 'none';
    }

    courseModal.setAttribute('aria-hidden', 'false');
    // trap focus to close button initially for simplicity
    modalCloseBtn.focus();
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeCourseModal() {
    courseModal.setAttribute('aria-hidden', 'true');
    // clear image to avoid stale content
    if (modalImg) {
        modalImg.src = '';
        modalImg.alt = '';
    }
    document.body.style.overflow = '';
}

// Build data object from card element
function cardToData(card) {
    return {
        title: card.getAttribute('data-title') || card.querySelector('h3')?.textContent || '',
        description: card.getAttribute('data-description') || '',
        skills: card.getAttribute('data-skills') || '',
        career: card.getAttribute('data-career') || '',
        img: card.getAttribute('data-img') || '',
        imgAlt: card.getAttribute('data-img-alt') || ''
    };
}

// Attach events to each curriculum card
document.querySelectorAll('.curriculum-card').forEach(card => {
    // Click opens modal
    card.addEventListener('click', () => openCourseModal(cardToData(card)));
    // Keyboard accessible: Enter / Space
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openCourseModal(cardToData(card));
        }
    });
});

// Close interactions
modalCloseBtn.addEventListener('click', closeCourseModal);
modalBackdrop.addEventListener('click', closeCourseModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && courseModal.getAttribute('aria-hidden') === 'false') {
        closeCourseModal();
    }
});

// Prevent clicks inside panel from closing
document.querySelectorAll('.modal-panel').forEach(panel => {
    panel.addEventListener('click', (e) => e.stopPropagation());
});

console.log("IT Department Khon Kaen Technical College Website Loaded.");

/* ===== Project Modal: populate and control =====
   - Reads data-* attributes from .project-item
   - Opens accessible modal with fade/slide animation
   - Closes on backdrop click, close button, Esc key, or Enter/Space keyboard activation
*/

// Select project modal elements
const projectModal = document.getElementById('project-modal');
const projectBackdrop = document.getElementById('project-modal-backdrop');
const projectCloseBtn = document.getElementById('project-modal-close');
const projectTitle = document.getElementById('project-modal-title');
const projectImg = document.querySelector('.project-modal-img');
const projectShort = document.querySelector('.project-modal-short');
const projectDesc = document.querySelector('.project-modal-desc');
const projectTech = document.querySelector('.project-modal-tech');

// Open project modal with data object
function openProjectModal(data) {
    projectTitle.textContent = data.title || '';
    projectShort.textContent = data.short || '';
    projectDesc.textContent = data.desc || '';
    projectTech.textContent = data.tech || '';

    if (data.img) {
        projectImg.src = data.img;
        projectImg.alt = data.imgAlt || data.title;
        projectImg.style.display = '';
    } else {
        projectImg.src = '';
        projectImg.alt = '';
        projectImg.style.display = 'none';
    }

    projectModal.setAttribute('aria-hidden', 'false');
    projectCloseBtn.focus();
    document.body.style.overflow = 'hidden';
}

// Close project modal
function closeProjectModal() {
    projectModal.setAttribute('aria-hidden', 'true');
    // clear content
    projectImg.src = '';
    projectImg.alt = '';
    document.body.style.overflow = '';
}

// Helper to build data from element
function projectElementToData(el) {
    return {
        title: el.getAttribute('data-title') || el.querySelector('h4')?.textContent || '',
        short: el.getAttribute('data-short') || '',
        desc: el.getAttribute('data-desc') || '',
        tech: el.getAttribute('data-tech') || '',
        img: el.getAttribute('data-img') || (el.querySelector('img')?.src || ''),
        imgAlt: el.getAttribute('data-img-alt') || el.querySelector('img')?.alt || ''
    };
}

// Attach events to project items
document.querySelectorAll('.project-item').forEach(item => {
    item.addEventListener('click', () => openProjectModal(projectElementToData(item)));
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openProjectModal(projectElementToData(item));
        }
    });
});

// Close interactions
projectCloseBtn.addEventListener('click', closeProjectModal);
projectBackdrop.addEventListener('click', closeProjectModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.getAttribute('aria-hidden') === 'false') {
        closeProjectModal();
    }
});

// Prevent clicks inside panel from closing
document.querySelectorAll('.project-modal-panel').forEach(panel => {
    panel.addEventListener('click', (e) => e.stopPropagation());
});