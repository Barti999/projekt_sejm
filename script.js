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

                // Obliczanie procentu zgodności dla każdego posła
                const resultsData = results.data;
                const resultsMap = new Map();

                resultsData.forEach(row => {
                    const posName = `${row.Nazwisko} ${row["Imię "]}`;
                    if (!resultsMap.has(posName)) {
                        resultsMap.set(posName, { total: 0, matches: 0, party: row.Koło });
                    }

                    // Sprawdzanie zgodności dla każdego głosowania
                    for (let column in responses) {
                        if (row[column] === responses[column]) {
                            resultsMap.get(posName).matches++;
                        }
                        resultsMap.get(posName).total++;
                    }
                });

                // Wyświetlanie wyników
                let htmlContent = "<h2>Wyniki:</h2><ul>";
                resultsMap.forEach((data, posName) => {
                    const percentage = (data.matches / data.total) * 100;
                    htmlContent += `<li>${data.party} - ${posName} - Zgodność: ${percentage.toFixed(2)}%</li>`;
                });
                htmlContent += "</ul>";
                document.getElementById('result').innerHTML = htmlContent;
            },
            error: function (error) {
                console.error("Błąd podczas ładowania CSV:", error);
            }
        });
    });

    console.log("Obsługa formularza dodana.");
});
