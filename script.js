document.addEventListener("DOMContentLoaded", function () {
    console.log("Strona załadowana, dodawanie obsługi formularza...");

    document.getElementById('surveyForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Zapobiega przeładowaniu strony

        // Definicja kluczy odpowiedzi dla każdego głosowania (kolumn w CSV)
        const answerKeys = {
            vote1: '1-31',
            vote2: '1-35',
            vote3: '1-40',
            vote4: '1-56',
            vote5: '1-57',
            vote6: '1-64',
            vote7: '1-89',
            vote8: '1-126',
            vote9: '1-139',
            vote10: '1-140'
        };

        // Zbieranie odpowiedzi użytkownika
        const userAnswers = {};
        for (let i = 1; i <= 10; i++) {
            const selectedOption = document.querySelector(`input[name="vote${i}"]:checked`);
            if (selectedOption) {
                userAnswers[`vote${i}`] = selectedOption.value;
            } else {
                userAnswers[`vote${i}`] = null;  // Użytkownik nie odpowiedział
            }
        }
        console.log("Odpowiedzi użytkownika:", userAnswers);

        // Wczytywanie pliku CSV
        Papa.parse("data/data.csv", {
            download: true,  // Pobieranie pliku CSV z serwera
            delimiter: ";",
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                console.log("CSV załadowany:", results.data);

                // Obliczanie zgodności dla każdego posła
                const scores = results.data.map((row) => {
                    let matchingVotes = 0;
                    let totalVotes = 0;

                    for (let i = 1; i <= 10; i++) {
                        const columnKey = answerKeys[`vote${i}`];
                        if (userAnswers[`vote${i}`] !== null && row[columnKey] !== undefined) {
                            totalVotes++;
                            if (row[columnKey] === userAnswers[`vote${i}`]) {
                                matchingVotes++;
                            }
                        }
                    }

                    const matchingPercentage = totalVotes > 0 ? (matchingVotes / totalVotes) * 100 : 0;
                    return {
                        name: `${row["Imię "]} ${row.Nazwisko}`,
                        matchingPercentage: matchingPercentage.toFixed(2) // Procent zgodności
                    };
                });

                // Sortowanie wyników od najwyższej zgodności do najniższej
                scores.sort((a, b) => b.matchingPercentage - a.matchingPercentage);

                // Wyświetlanie wyników
                const resultDiv = document.getElementById('result');
                let htmlContent = "<h2>Procentowa zgodność z poszczególnymi posłami:</h2><ul>";
                scores.forEach(score => {
                    htmlContent += `<li>${score.name}: ${score.matchingPercentage}%</li>`;
                });
                htmlContent += "</ul>";
                resultDiv.innerHTML = htmlContent;
            },
            error: function (error) {
                console.error("Błąd podczas ładowania CSV:", error);
            }
        });
    });

    console.log("Obsługa formularza dodana.");
});
