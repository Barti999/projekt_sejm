document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('surveyForm');
    const resultDiv = document.getElementById('result');
    
    // URL do pliku CSV (wymaga hostingu pliku CSV)
    const csvUrl = 'data.csv'; // Zaktualizuj ścieżkę do pliku CSV
    
    // Funkcja wczytująca i przetwarzająca plik CSV
    function loadCSV(url, callback) {
        Papa.parse(url, {
            download: true,
            header: true,
            complete: (result) => {
                console.log('CSV Loaded:', result); // Debugowanie: Wyświetla wynik wczytywania CSV
                callback(result);
            },
            error: (error) => {
                console.error('CSV Load Error:', error); // Debugowanie: Wyświetla błędy wczytywania CSV
            }
        });
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const formData = new FormData(form);
        const vote = formData.get('vote');
        
        console.log('User Vote:', vote); // Debugowanie: Wyświetla wybraną opcję

        if (vote) {
            loadCSV(csvUrl, (result) => {
                const data = result.data;
                const headers = result.meta.fields;

                console.log('CSV Headers:', headers); // Debugowanie: Wyświetla nagłówki CSV

                const posiedzenieIndex = headers.indexOf('Posiedzenie');
                const glosowanieIndex = headers.indexOf('Głosowanie');
                const votesStartIndex = headers.indexOf('1-31'); // Przy założeniu, że numery głosowań są w nagłówkach
                
                if (posiedzenieIndex === -1 || glosowanieIndex === -1 || votesStartIndex === -1) {
                    resultDiv.textContent = 'Błąd w danych CSV.';
                    return;
                }
                
                let matchingMPs = [];
                
                data.forEach(row => {
                    if (row[posiedzenieIndex] == 1 && row[glosowanieIndex] == 31) {
                        const voteColumn = row[votesStartIndex + 30]; // Numer kolumny dla głosowania 31
                        if (voteColumn === vote) {
                            matchingMPs.push(`${row['Koło']} ${row['Nazwisko']} ${row['Imię']}`);
                        }
                    }
                });
                
                if (matchingMPs.length > 0) {
                    resultDiv.textContent = `Posłowie, którzy zagłosowali tak samo: ${matchingMPs.join(', ')}`;
                } else {
                    resultDiv.textContent = 'Brak posłów, którzy zagłosowali tak samo.';
                }
            });
        } else {
            resultDiv.textContent = 'Proszę wybrać opcję.';
        }
    });
});
