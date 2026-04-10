document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const emailInput = document.getElementById('emailInput');
    const searchBtn = document.getElementById('searchBtn');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    const errorMsg = document.getElementById('errorMsg');
    
    // Result sections
    const searchSection = document.querySelector('.search-section');
    const resultCard = document.getElementById('resultCard');
    const resetBtn = document.getElementById('resetBtn');

    // Result DOM Elements
    const resName = document.getElementById('resName');
    const resMemberId = document.getElementById('resMemberId');
    const resBatch = document.getElementById('resBatch');
    const resRoll = document.getElementById('resRoll');
    const resRegistration = document.getElementById('resRegistration');
    const resDept = document.getElementById('resDept');
    const resPhone = document.getElementById('resPhone');
    const resJoined = document.getElementById('resJoined');

    const setLoading = (isLoading) => {
        if (isLoading) {
            searchBtn.disabled = true;
            btnText.style.display = 'none';
            btnSpinner.style.display = 'block';
            errorMsg.classList.remove('visible');
        } else {
            searchBtn.disabled = false;
            btnText.style.display = 'block';
            btnSpinner.style.display = 'none';
        }
    };

    const showError = (msg) => {
        errorMsg.textContent = msg;
        errorMsg.classList.add('visible');
    };

    const displayResult = (data) => {
        // Sanitize & Fill Data
        resName.textContent = data.Member_Name || 'N/A';
        resMemberId.textContent = data.Member_ID || 'Pending/Not Found';
        resBatch.textContent = data.Batch || 'N/A';
        resRoll.textContent = data.Roll_No || 'N/A';
        resRegistration.textContent = data.Registration || 'N/A';
        resDept.textContent = data.Department || 'N/A';
        resPhone.textContent = data.Mobile_No || 'N/A';
        resJoined.textContent = data.Joined || 'N/A';

        // Animate Out Search UI
        searchSection.classList.add('hidden');
        
        // Ensure result card resets animation if used before
        resultCard.classList.remove('hidden');
        resultCard.style.animation = 'none';
        resultCard.offsetHeight; /* trigger reflow */
        resultCard.style.animation = null; 
    };

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        if(!email) return;

        setLoading(true);

        try {
            const response = await fetch(`/api/member?email=${encodeURIComponent(email)}`);
            const json = await response.json();

            if (json.success && json.data) {
                displayResult(json.data);
            } else {
                showError(json.error || "No member found with that email.");
            }
        } catch (err) {
            showError("Network error. Please try again.");
            console.error("API Error", err);
        } finally {
            setLoading(false);
        }
    });

    resetBtn.addEventListener('click', () => {
        emailInput.value = '';
        resultCard.classList.add('hidden');
        searchSection.classList.remove('hidden');
        emailInput.focus();
    });
});
