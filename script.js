document.addEventListener("DOMContentLoaded", function () {
    console.log("Strona załadowana, dodawanie obsługi formularza...");
    
    document.getElementById('surveyForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Zapobiega przeładowaniu strony

        // Pobranie wszystkich wybranych opcji głosowania
        const selectedVotes = {};
        document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
            const name = radio.name;
            const value = radio.value;
            selectedVotes[name] = value;
        });

        // Wczytywanie pliku CSV
        Papa.parse("data/data.csv", {
            download: true,  // Pobieranie pliku CSV z serwera
            delimiter: ";",
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                console.log("CSV załadowany:", results);
                
                if (!results || !results.data || results.data.length === 0) {
                    console.error("Brak danych w pliku CSV.");
                    return;
                }

                const resultsElement = document.getElementById('result');
                if (!resultsElement) {
                    console.error("Element o id 'result' nie został znaleziony.");
                    return;
                }

                const questions = [
                    { column: '1-31', label: 'Posiedzenia nr 1, głosowania nr 31' },
                    { column: '1-35', label: 'Posiedzenia nr 1, głosowania nr 35' },
                    { column: '1-40', label: 'Posiedzenia nr 1, głosowania nr 40' },
                    { column: '1-56', label: 'Posiedzenia nr 1, głosowania nr 56' }
                ];

                let htmlContent = '<h2>Wyniki:</h2>';

                questions.forEach(question => {
                    const columnKey = question.column;
                    const selectedOption = selectedVotes[`vote_${columnKey}`];
                    const filteredData = results.data.filter(row => row[columnKey] === selectedOption);
                    
                    htmlContent += `<h3>Głosowanie: ${question.label}</h3>`;
                    htmlContent += `<p>Wybrana opcja: ${selectedOption}</p>`;

                    if (filteredData.length > 0) {
                        htmlContent += "<ul>";
                        filteredData.forEach(row => {
                            htmlContent += `<li>${row.Nazwisko} ${row["Imię "]}</li>`;
                        });
                        htmlContent += "</ul>";
                    } else {
                        htmlContent += "<p>Brak wyników dla wybranej opcji.</p>";
                    }
                });

                // Dodanie podsumowania dla posłów
                const summaryTable = generateSummaryTable(results.data);
                htmlContent += '<h2>Podsumowanie głosowań:</h2>';
                htmlContent += summaryTable;

                resultsElement.innerHTML = htmlContent;
            },
            error: function (error) {
                console.error("Błąd podczas ładowania CSV:", error);
            }
        });
    });

    console.log("Obsługa formularza dodana.");
});

// Funkcja generująca tabelę podsumowującą dla posłów
function generateSummaryTable(data) {
    // Zbierz dane dla podsumowania
    const clubs = {};
    data.forEach(row => {
        const club = row.Klub;
        if (!clubs[club]) {
            clubs[club] = { ZA: 0, PRZECIW: 0, WSTRZYMAŁ_SIĘ: 0, NIEOBECNY: 0, DYSK: 0, TOTAL: 0 };
        }

        // Zliczanie głosów w zależności od kolumn
        Object.keys(clubs[club]).forEach(voteType => {
            if (row[voteType]) {
                clubs[club][voteType] += parseInt(row[voteType], 10) || 0;
            }
        });

        clubs[club].TOTAL++;
    });

    // Generowanie HTML dla tabeli
    let tableHtml = '<table><caption>Podsumowanie głosowań</caption><thead><tr><th>KLUB</th><th>ZA</th><th>PRZECIW</th><th>WSTRZYMAŁ SIĘ</th><th>NIEOBECNY</th><th>DYSK</th></tr></thead><tbody>';

    Object.keys(clubs).forEach(club => {
        const { ZA, PRZECIW, WSTRZYMAŁ_SIĘ, NIEOBECNY, DYSK, TOTAL } = clubs[club];
        const totalVotes = ZA + PRZECIW + WSTRZYMAŁ_SIĘ + NIEOBECNY;
        const percentDiscipline = ((DYSK / TOTAL) * 100).toFixed(2) + '%';

        tableHtml += `<tr>
            <td>${club}</td>
            <td>${ZA}</td>
            <td>${PRZECIW}</td>
            <td>${WSTRZYMAŁ_SIĘ}</td>
            <td>${NIEOBECNY}</td>
            <td>${percentDiscipline}</td>
        </tr>`;
    });

    tableHtml += '</tbody></table>';
    return tableHtml;
}
