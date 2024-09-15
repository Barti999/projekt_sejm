document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('surveyForm');
    const resultDiv = document.getElementById('result');

    let data = [];

    // Load and parse CSV data
    Papa.parse('data/data.csv', {
        download: true,
        header: true,
        complete: function(results) {
            data = results.data;
            console.log('Dane załadowane:', data);
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const vote = formData.get('vote');

        if (vote) {
            resultDiv.textContent = `Wybrałeś: ${formatVote(vote)}`;
            analyzeData(vote);
        } else {
            resultDiv.textContent = 'Proszę wybrać opcję.';
        }
    });

    function analyzeData(userVote) {
        // Clear previous results
        resultDiv.innerHTML = '';

        // Example: Analyze how many MPs voted the same as the user
        const matchingVotes = data.filter(row => {
            // Example condition - adjust based on your data format
            return Object.values(row).includes(userVote);
        });

        const count = matchingVotes.length;

        const p = document.createElement('p');
        p.textContent = `Liczba posłów, którzy zagłosowali tak samo jak ty: ${count}`;
        resultDiv.appendChild(p);
    }

    function formatVote(vote) {
        switch (vote) {
            case 'against': return 'ZA';
            case 'for': return 'PRZECIW';
            case 'abstain': return 'WSTRZYMAŁBYM SIĘ';
            default: return 'Nieznana opcja';
        }
    }
});
