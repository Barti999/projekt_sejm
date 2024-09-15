// Funkcja do ładowania i parsowania pliku CSV
function loadCSV(callback) {
    Papa.parse("data.csv", {
        delimiter: ";", // Separator w pliku CSV
        download: true,
        header: true, // Traktuje pierwszy wiersz jako nagłówki kolumn
        complete: function(results) {
            console.log("CSV Loaded:", results);
            callback(results.data); // Przekazujemy dane do callbacka
        },
        error: function(error) {
            console.error("Error parsing CSV:", error);
        }
    });
}

// Funkcja do wyświetlania wyników na stronie
function displayResults(filteredData) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Czyści poprzednie wyniki

    if (filteredData.length === 0) {
        resultDiv.innerHTML = 'Brak wyników dla wybranej opcji.';
        return;
    }

    const list = document.createElement('ul');
    filteredData.forEach(row => {
        const listItem = document.createElement('li');
        listItem.textContent = `${row['Nazwisko']} ${row['Imię']}`;
        list.appendChild(listItem);
    });
    resultDiv.appendChild(list);
}

// Funkcja do obsługi wysłania formularza
function handleFormSubmit(event) {
    event.preventDefault(); // Zapobiega wysłaniu formularza

    const selectedVote = document.querySelector('input[name="vote"]:checked').value;

    loadCSV(function(data) {
        // Filtrujemy dane według wybranej opcji głosowania
        const filteredData = data.filter(row => row['1-35'] === selectedVote);
        displayResults(filteredData);
    });
}

// Wywołanie funkcji po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    const surveyForm = document.getElementById('surveyForm');
    surveyForm.addEventListener('submit', handleFormSubmit);
});
