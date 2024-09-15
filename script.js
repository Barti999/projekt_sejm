document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('surveyForm');
    const resultDiv = document.getElementById('result');

    // Wczytaj i przetwórz dane CSV
    Papa.parse('data/data.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            processCSVData(results.data);
        }
    });

    function processCSVData(data) {
        // Find the headers in the CSV data
        const headers = data[0];
        const posiedzeniaIdx = headers.findIndex(header => header === 'Posiedzenie');
        const glosowanieIdx = headers.findIndex(header => header === 'Głosowanie');
        const votes = headers.slice(3); // Skipping first three columns: Koło, Nazwisko, Imię

        const formattedData = data.slice(1).map(row => {
            return {
                klub: row['Koło'],
                nazwisko: row['Nazwisko'],
                imie: row['Imię'],
                votes: votes.reduce((acc, vote, index) => {
                    acc[vote] = row[vote] || '';
                    return acc;
                }, {})
            };
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(form);
            const userVote = formData.get('vote');
            const posiedzenie = 1; // Numer posiedzenia (zmień na odpowiedni numer)
            const glosowanie = 31; // Numer głosowania (zmień na odpowiedni numer)
            const key = `${posiedzenie}-${glosowanie}`;

            if (userVote) {
                resultDiv.innerHTML = ''; // Wyczyść poprzednie wyniki

                // Znajdź posłów, którzy zagłosowali tak samo jak użytkownik
                const matchingVotes = formattedData.filter(row => 
                    row.votes[key] === userVote
                );

                if (matchingVotes.length > 0) {
                    const ul = document.createElement('ul');
                    matchingVotes.forEach(row => {
                        const li = document.createElement('li');
                        li.textContent = `${row.klub} - ${row.nazwisko} ${row.imie}`;
                        ul.appendChild(li);
                    });
                    resultDiv.appendChild(ul);
                } else {
                    resultDiv.textContent = 'Brak posłów, którzy zagłosowali tak samo jak Ty.';
                }
            } else {
                resultDiv.textContent = 'Proszę wybrać opcję.';
            }
        });
    }
});
