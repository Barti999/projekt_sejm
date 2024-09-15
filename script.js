// Funkcja do ładowania i parsowania pliku CSV
function loadCSV(callback) {
    console.log("Rozpoczynam ładowanie CSV...");
    Papa.parse("data.csv", {
        delimiter: ";", // Separator w pliku CSV
        download: true,
        header: true, // Traktuje pierwszy wiersz jako nagłówki kolumn
        complete: function(results) {
            console.log("CSV załadowany:", results);
            console.log("CSV Meta:", results.meta);
            console.log("Dane CSV:", results.data); // Wyświetl dane CSV
            callback(results.data); // Przekazujemy dane do callbacka
        },
        error: function(error) {
            console.error("Błąd podczas parsowania CSV:", error);
        }
    });
}

// Funkcja do wyświetlania wyników na stronie
function displayResults(filteredData) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Czyści poprzednie wyniki

    if (filteredData.length === 0) {
        resultDiv.innerHTML = 'Brak wyników dla wybranej opcji.';
        console.log("Brak wyników dla wybranej opcji.");
        return;
    }

    const list = document.createElement('ul');
    filteredData.forEach(row => {
        const listItem = document.createElement('li');
        listItem.textContent = `${row['Nazwisko']} ${row['Imię ']}`; // Użyj 'Imię ' z dodatkową spacją
        list.appendChild(listItem);
    });
    resultDiv.appendChild(list);
    console.log("Wyświetlane wyniki:", filteredData);
}

// Funkcja do obsługi wysłania formularza
function handleFormSubmit(event) {
    event.preventDefault(); // Zapobiega wysłaniu formularza

    const selectedVote = document.querySelector('input[name="vote"]:checked').value;
    console.log("Wybrana opcja głosowania:", selectedVote);

    loadCSV(function(data) {
        console.log("Dane do filtrowania:", data); // Wyświetl dane przed filtrowaniem

        // Filtrujemy dane według wybranej opcji głosowania
        const filteredData = data.filter(row => {
            console.log("Sprawdzam wiersz:", row); // Wyświetl każdy wiersz przed filtrowaniem
            return row['1-35'] === selectedVote;
        });

        console.log("Dane po filtrowaniu:", filteredData);
        displayResults(filteredData);
    });
}

// Wywołanie funkcji po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    console.log("Strona załadowana, dodawanie obsługi formularza...");
    const surveyForm = document.getElementById('surveyForm');
    if (surveyForm) {
        surveyForm.addEventListener('submit', handleFormSubmit);
        console.log("Obsługa formularza dodana.");
    } else {
        console.error("Nie znaleziono formularza z identyfikatorem 'surveyForm'.");
    }
});
