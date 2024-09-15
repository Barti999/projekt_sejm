document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('surveyForm');
    const resultDiv = document.getElementById('result');

    // Wczytaj i przetwórz dane CSV
    Papa.parse('data/data.csv', {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            console.log('Dane CSV:', results.data); // Debugging line
            processCSVData(results.data);
        },
        error: function(error) {
            console.error('Błąd podczas wczytywania CSV:', error); // Debugging line
        }
    });

    function processCSVData(data) {
        console.log('Przetworzone dane:', data); // Debugging line

        const headers = data[0];
        const posiedzeniaIdx = headers.findIndex(header => header === 'Posiedzenie');
        const glosowanieIdx = headers.findIndex(header => header === 'Głosowanie');
        const votes = headers.slice(3);

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

            console.log('Wybrana opcja:', userVote); // Debugging line
            console.log('Posiedzenie i głosowanie:', key); // Debugging line

            if (userVote) {
                resultDiv.innerHTML = '';

                const matchingVotes = formattedData.filter(row => 
                    row.votes[key] === userVote
                );

                console.log('Pasujące głosowania:', matchingVotes); // Debugging line

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
