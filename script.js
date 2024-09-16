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

                // Sortowanie posłów według procentu zgodności
                const sortedResults = Array.from(resultsMap.entries()).map(([name, data]) => ({
                    name,
                    party: data.party,
                    percentage: (data.matches / data.total) * 100
                })).sort((a, b) => b.percentage - a.percentage);

                // Wyświetlanie wyników w tabeli
                let htmlContent = `
                    <h2>Wyniki:</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Klub</th>
                                <th>Poseł</th>
                                <th>Procent zgodności</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                sortedResults.forEach(result => {
                    htmlContent += `
                        <tr>
                            <td>${result.party}</td>
                            <td>${result.name}</td>
                            <td>${result.percentage.toFixed(2)}%</td>
                        </tr>
                    `;
                });

                htmlContent += `
                        </tbody>
                    </table>
                `;
                document.getElementById('result').innerHTML = htmlContent;
            },
            error: function (error) {
                console.error("Błąd podczas ładowania CSV:", error);
            }
        });
    });

    console.log("Obsługa formularza dodana.");
});
