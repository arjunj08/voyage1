// This script contains all the logic for the Voyage Travel App.
// It is loaded deferentially to improve page load performance.

document.addEventListener('DOMContentLoaded', function () {
    // Wait for the DOM to be fully loaded before running any scripts.
    
    // Initialize Lucide icons
    // We check if lucide is available before calling it.
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- GLOBAL STATE & HELPERS ---
    
    // A variable to keep track of the last screen before showing a full-screen view like a map or payment screen.
    window.lastScreen = 'home-screen';

    /**
     * Closes the main modal dialog.
     */
    function closeModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.add('hidden');
            document.getElementById('modal-content').innerHTML = '';
        }
    }
    
    /**
     * Shows the main modal with the provided HTML content.
     * @param {string} content - The HTML string to inject into the modal.
     */
    function showModal(content) {
        document.getElementById('modal-content').innerHTML = content;
        document.getElementById('modal').classList.remove('hidden');
        // Re-initialize icons if any were added to the modal
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Navigates to a specific screen within the app.
     * @param {string} screenId - The ID of the screen div to show.
     */
    function navigateToScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        // Show the target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            window.lastScreen = screenId; // Update the last screen
        }

        // Update the active state of bottom navigation items
        document.querySelectorAll('.nav-item').forEach(nav => {
            const indicator = nav.querySelector('.absolute');
            if (nav.dataset.screen === screenId) {
                nav.classList.add('active');
                if (indicator) indicator.classList.remove('hidden');
            } else {
                nav.classList.remove('active');
                if (indicator) indicator.classList.add('hidden');
            }
        });
    }

    // --- EVENT LISTENERS ---

    // Handle bottom navigation clicks
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            navigateToScreen(item.dataset.screen);
        });
    });

    // Handle booking tab switching on the home screen
    document.querySelectorAll('.booking-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Update tab active state
            document.querySelectorAll('.booking-tab').forEach(t => t.classList.remove('active', 'text-sky-500', 'border-sky-500'));
            tab.classList.add('active', 'text-sky-500', 'border-sky-500');
            
            // Show the corresponding form
            const tabName = tab.dataset.tab;
            document.querySelectorAll('#booking-forms > div').forEach(form => {
                form.id === `${tabName}-form` ? form.classList.remove('hidden') : form.classList.add('hidden');
            });

            // Update search button text
            const searchBtn = document.getElementById('search-btn');
            const capitalizedTabName = tabName.charAt(0).toUpperCase() + tabName.slice(1);
            searchBtn.innerHTML = `<i data-lucide="search" class="mr-2 h-5 w-5"></i>Search ${capitalizedTabName}`;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });

    // Handle date input focus/blur to switch type
    document.querySelectorAll('.date-input').forEach(input => {
        input.addEventListener('focus', () => {
            input.type = 'date';
        });
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.type = 'text';
            }
        });
    });

    // Handle search button click
    document.getElementById('search-btn').addEventListener('click', () => {
        showModal(`<div class="flex justify-center items-center mb-4"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div></div><p class="font-semibold text-slate-700">Searching for the best deals...</p>`);
        setTimeout(() => {
            closeModal();
            const activeTab = document.querySelector('.booking-tab.active').dataset.tab;
            switch (activeTab) {
                case 'flights': navigateToScreen('flight-results-screen'); break;
                case 'hotels': navigateToScreen('hotel-results-screen'); break;
                case 'cars': navigateToScreen('car-results-screen'); break;
            }
        }, 1500); // Reduced timeout for faster feel
    });

    // Add more event listeners for other buttons and interactions...
    // e.g., document.getElementById('back-to-home-flight').addEventListener('click', () => navigateToScreen('home-screen'));
    
    // Generic modal close button listener
    document.body.addEventListener('click', function(event) {
        if (event.target.dataset.modalAction === 'close') {
            closeModal();
        }
    });
});
 