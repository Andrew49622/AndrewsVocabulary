import {scrollend} from 'https://cdn.jsdelivr.net/gh/argyleink/scrollyfills@latest/dist/scrollyfills.modern.js'

// GRADIENT BACKGROUND

// Create particle effect
const particlesContainer = document.getElementById('particles-container');
const particleCount = 80;

// Create particles
for (let i = 0; i < particleCount; i++) {
    createParticle();
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size (small)
    const size = Math.random() * 3 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Initial position
    resetParticle(particle);
    
    particlesContainer.appendChild(particle);
    
    // Animate
    animateParticle(particle);
}

function resetParticle(particle) {
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.opacity = '0';
    
    return {
        x: posX,
        y: posY
    };
}

function animateParticle(particle) {
    // Initial position
    const pos = resetParticle(particle);
    
    // Random animation properties
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    
    // Animate with GSAP-like timing
    setTimeout(() => {
        particle.style.transition = `all ${duration}s linear`;
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        
        // Move in a slight direction
        const moveX = pos.x + (Math.random() * 20 - 10);
        const moveY = pos.y - Math.random() * 30; // Move upwards
        
        particle.style.left = `${moveX}%`;
        particle.style.top = `${moveY}%`;
        
        // Reset after animation completes
        setTimeout(() => {
            animateParticle(particle);
        }, duration * 1000);
    }, delay * 1000);
}

// Mouse interaction
document.addEventListener('mousemove', (e) => {
    // Create particles at mouse position
    const mouseX = (e.clientX / window.innerWidth) * 100;
    const mouseY = (e.clientY / window.innerHeight) * 100;
    
    // Create temporary particle
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Small size
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Position at mouse
    particle.style.left = `${mouseX}%`;
    particle.style.top = `${mouseY}%`;
    particle.style.opacity = '0.6';
    
    particlesContainer.appendChild(particle);
    
    // Animate outward
    setTimeout(() => {
        particle.style.transition = 'all 2s ease-out';
        particle.style.left = `${mouseX + (Math.random() * 10 - 5)}%`;
        particle.style.top = `${mouseY + (Math.random() * 10 - 5)}%`;
        particle.style.opacity = '0';
        
        // Remove after animation
        setTimeout(() => {
            particle.remove();
        }, 2000);
    }, 10);
    
    // Subtle movement of gradient spheres
    const spheres = document.querySelectorAll('.gradient-sphere');
    const moveX = (e.clientX / window.innerWidth - 0.5) * 5;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 5;
    
    spheres.forEach(sphere => {
        const currentTransform = getComputedStyle(sphere).transform;
        sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});




// FORCE SCROLL REFRESH

const ptr_scrollport = document.querySelector('html')
const ptr = document.querySelector('#refresh')
const main = document.querySelector('#refresh-main')

const determinePTR = event => {
  if (event.target.scrollTop <= 0) {
    // fetch()
    ptr.querySelector('span').textContent = 'Santificating...'
    ptr.setAttribute('loading-state', 'loading')
    
    // sim response
    setTimeout(() => {
      ptr.querySelector('span').textContent = 'done!'
      
      setTimeout(() => {
        ptr.removeAttribute('loading-state')
        main.scrollIntoView({ behavior: 'smooth' })

        window.addEventListener('scrollend', e => {
          ptr.querySelector('span').textContent = 'pull to Santificate'
        }, {once: true})
      }, 500)
    }, 2000)
  }
}

window.addEventListener('scrollend', e => {
  determinePTR({target: ptr_scrollport})
})

// TOGGLE BUTTON

const options = document.querySelectorAll('.toggle-option');
        const slider = document.getElementById('slider');
        const contentText = document.getElementById('contentText');
        
        let currentMode = 'translation';

        function updateSlider(element) {
            const width = element.offsetWidth;
            const left = element.offsetLeft;    // where the slider stops after changing position
            
            slider.style.width = width + 'px';
            slider.style.left = left + 'px';
        }

        function setActiveOption(selectedOption) {
            options.forEach(opt => opt.classList.remove('active'));
            selectedOption.classList.add('active');
            updateSlider(selectedOption);
            
            currentMode = selectedOption.dataset.mode;
            
            if (currentMode === 'translation') {
                contentText.textContent = 'Translation mode selected';
            } else {
                contentText.textContent = 'Definition mode selected';
            }
        }

        options.forEach(option => {
            option.addEventListener('click', function() {
                setActiveOption(this);
            });
        });

        // Initialize slider position
        updateSlider(document.querySelector('.toggle-option.active'));

        // Handle window resize
        window.addEventListener('resize', () => {
            updateSlider(document.querySelector('.toggle-option.active'));
        });

// FETCH DATA FROM DATABASE
let wordsData = [];
let showingDefinition = false;

/* Fetches the words data from the server and renders the table with the words data from the server and the client script (index.html)
    using the DOM API (document.querySelector, document.createElement, document.appendChild, document.innerHTML, etc.)
    to manipulate the DOM elements to display the words data in the table.
*/
fetch('data/words.json')
    .then(res => res.json())
    .then(data => {
        wordsData = data;
        console.log('Loaded words:', wordsData);
        renderTable();
    })
    .catch(err => console.error('Error loading words:', err));

/*  Renders the table with the words data from the server and the client script (index.html)
    using the DOM API (document.querySelector, document.createElement, document.appendChild, document.innerHTML, etc.)
    to manipulate the DOM elements to display the words data in the table.
*/
function renderTable() {
    const tbody = document.querySelector('#words-table tbody'); // gets the tbody
    tbody.innerHTML = ''; // clears the tbody

    wordsData.forEach(row => {  // iterates over the words data
        const tr = document.createElement('tr');
        
        const contentToShow = showingDefinition  // shows the definition or the translation depending on the showingDefinition variable
            ? (row.definition || 'No definition') 
            : (row.translation || 'No translation');
        
        const wordCell = document.createElement('td');
        wordCell.innerHTML = `<strong>${row.word}</strong>`;
        
        const contentCell = document.createElement('td');
        contentCell.textContent = contentToShow;
        
        const notesCell = document.createElement('td');
        if (row.notes) {  // if the notes are not empty
            const notesIcon = document.createElement('img');
            notesIcon.className = 'notes-icon';                                           // adds the class notes-icon to the button
            notesIcon.src = 'images/notes_icon.jpg';
            notesIcon.alt = 'Icon';
            notesIcon.addEventListener('mouseenter', (e) => showTooltip(e, row.notes));  // adds an event listener to the button to show the tooltip when the mouse enters the button
            notesIcon.addEventListener('mouseleave', hideTooltip);                       // adds an event listener to the button to hide the tooltip when the mouse leaves the button
            notesCell.appendChild(notesIcon);                                            // appends the button to the notes cell
        }
        
        tr.appendChild(wordCell);
        tr.appendChild(contentCell);
        tr.appendChild(notesCell);
        tbody.appendChild(tr);
    });
}

//  Toggles the column between the definition and the translation.
function toggleColumn() {
    showingDefinition = !showingDefinition;
    const label = document.getElementById('column-label');
    const btn = document.getElementById('toggle-btn');
    
    if (showingDefinition) {
        label.textContent = 'Definition';
        btn.textContent = 'Show Translation';
    } else {
        label.textContent = 'Translation';
        btn.textContent = 'Show Definition';
    }
    
    renderTable();
}

// Adds an event listener to the toggle button to toggle the column between the definition and the translation.
document.getElementById('toggle-btn').addEventListener('click', toggleColumn);

// Shows the tooltip with the notes when the mouse enters the notes button.
function showTooltip(event, text) {
    hideTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.id = 'tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.bottom + 5) + 'px';
}

/* Hides the tooltip with the notes when the mouse leaves the notes button.
    The tooltip is then removed using the remove function.
*/
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}