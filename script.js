document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('surveyForm');
    const resultDiv = document.getElementById('result');
    
    // URL do pliku CSV
    const csvUrl = 'data.csv'; // Upewnij się, że ścieżka jest poprawna
    
    // Funkcja wczytująca i przetwarzająca plik CSV
    function loadCSV(url, callback) {
        Papa.parse(url, {
            download: true,
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

                // Indeksowanie kolumn
                const posiedzenieIndex = headers.indexOf('Posiedzenie');
                const glosowanieIndex = headers.indexOf('Głosowanie');
                
                // Mapowanie indeksów kolumn
                const voteColumns = headers.slice(3); // Zakłada, że pierwsze 3 kolumny to nagłówki dla posiedzeń i głosowań

                console.log('Vote Columns:', voteColumns); // Debugowanie: Wyświetla kolumny głosowań

                if (posiedzenieIndex === -1 || glosowanieIndex === -1) {
                    resultDiv.textContent = 'Błąd w danych CSV.';
                    return;
                }
                
                let matchingMPs = [];
                
                data.forEach(row => {
                    // Sprawdzanie głosowania
                    if (row[posiedzenieIndex] && row[glosowanieIndex] && voteColumns.includes(row[glosowanieIndex])) {
                        const voteColumnIndex = voteColumns.indexOf(row[glosowanieIndex]);
                        if (voteColumnIndex !== -1 && row[voteColumnIndex] === vote) {
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
