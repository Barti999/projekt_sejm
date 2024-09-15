document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('surveyForm');
    const resultDiv = document.getElementById('result');
    const resultsDiv = document.getElementById('results');

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
            resultDiv.textContent = `Wybrałeś: ${vote}`;
            analyzeData(vote);
        } else {
            resultDiv.textContent = 'Proszę wybrać opcję.';
        }
    });

    function analyzeData(userVote) {
        resultsDiv.innerHTML = ''; // Clear previous results

        // Example: Analyze how many MPs voted the same as the user
        const matchingVotes = data.filter(row => {
            return Object.values(row).some(value => value === userVote);
        });

        const count = matchingVotes.length;

        const p = document.createElement('p');
        p.textContent = `Liczba posłów, którzy zagłosowali tak samo jak ty: ${count}`;
        resultsDiv.appendChild(p);
    }
});
