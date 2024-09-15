// Funkcja do ładowania i parsowania pliku CSV
function loadCSV() {
    Papa.parse("data.csv", {
        delimiter: ";", // Separator w pliku CSV
        download: true,
        header: true, // Traktuje pierwszy wiersz jako nagłówki kolumn
        complete: function(results) {
            console.log("CSV Loaded:", results);

            // Sprawdzenie i wyświetlenie nagłówków
            var headers = results.meta.fields;
            console.log("CSV Headers:", headers);

            if (headers) {
                // Przykład: Sprawdzenie indeksu konkretnego nagłówka
                var headerName = "Nazwisko"; // Zmień na interesujący Cię nagłówek
                var index = headers.indexOf(headerName);
                console.log("Index of '" + headerName + "':", index);

                if (index !== -1) {
                    // Przykładowe przetwarzanie danych
                    results.data.forEach(row => {
                        console.log("Data:", row[headerName]);
                    });
                } else {
                    console.error("Header '" + headerName + "' not found.");
                }
            } else {
                console.error("No headers found in the CSV.");
            }
        },
        error: function(error) {
            console.error("Error parsing CSV:", error);
        }
    });
}

// Wywołanie funkcji po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    loadCSV();
});
