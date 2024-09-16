document.addEventListener("DOMContentLoaded", function () {
    console.log("Strona załadowana, dodawanie obsługi formularza...");
    
    document.getElementById('surveyForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Zapobiega przeładowaniu strony

        // Pobranie wybranych opcji głosowania
        const responses = {};
        document.querySelectorAll('input[type=radio]:checked').forEach(input => {
            const question = input.name.split('_')[1]; // Wyciąganie numeru pytania
            const column = input.getAttribute('data-column');
            responses[column] = input.value;
        });
        console.log("Wybrane opcje głosowania:", responses);

        // Wczytywanie pliku CSV
        console.log("Rozpoczynam ładowanie CSV...");
        Papa.parse("data/data.csv", {
            download: true,
            delimiter: ";",
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                console.log("CSV załadowany:", results);
                console.log("CSV Meta:", results.meta);
                console.log("Dane CSV:", results.data);

                // Obliczanie procentu zgodności
                const totalQuestions = Object.keys(responses).length;
                let matchingVotes = 0;

                results.data.forEach(row => {
                    let match = true;
                    for (let column in responses) {
                        if (row[column] !== responses[column]) {
                            match = false;
                            break;
                        }
                    }
                    if (match) matchingVotes++;
                });

                const percentage = (matchingVotes / results.data.length) * 100;
                document.getElementById('result').innerHTML = `<h2>Wyniki:</h2><p>Twoja zgodność z posłami: ${percentage.toFixed(2)}%</p>`;
            },
            error: function (error) {
                console.error("Błąd podczas ładowania CSV:", error);
            }
        });
    });

    console.log("Obsługa formularza dodana.");
});
