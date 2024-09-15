document.addEventListener("DOMContentLoaded", function () {
    console.log("Strona załadowana, dodawanie obsługi formularza...");

    document.getElementById('surveyForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Zapobiega przeładowaniu strony

        // Pobranie wybranej opcji głosowania
        const selectedOption = document.querySelector('input[name="vote"]:checked').value;
        console.log("Wybrana opcja głosowania:", selectedOption);

        // Wczytywanie pliku CSV
        Papa.parse("data/data.csv", {
            download: true,  // Pobieranie pliku CSV z serwera
            delimiter: ";",
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                console.log("CSV załadowany:", results);
                console.log("CSV Meta:", results.meta);
                console.log("Dane CSV:", results.data);

                // Filtracja danych na podstawie wybranej opcji
                const columnKey = '1-31'; // Kolumna do filtrowania
                const filteredData = results.data.filter(row => row[columnKey] === selectedOption);

                console.log("Dane do filtrowania:", results.data);
                console.log("Sprawdzam wiersz:", results.data[0]);

                // Przekształcenie danych do HTML
                const resultDiv = document.getElementById('result');
                if (filteredData.length > 0) {
                    let htmlContent = "<h2>Wyniki dla wybranej opcji:</h2><ul>";

                    filteredData.forEach(row => {
                        htmlContent += `<li>${row.Nazwisko} ${row["Imię "]}</li>`;
                    });

                    htmlContent += "</ul>";
                    resultDiv.innerHTML = htmlContent;
                } else {
                    resultDiv.innerHTML = "Brak wyników dla wybranej opcji.";
                }
            },
            error: function (error) {
                console.error("Błąd podczas ładowania CSV:", error);
            }
        });
    });

    console.log("Obsługa formularza dodana.");
});
