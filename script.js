document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('surveyForm');
    const resultDiv = document.getElementById('result');
    const csvUrl = 'path/to/your/data.csv'; // Upewnij się, że URL jest poprawny
  
    function loadCSV(url, callback) {
      Papa.parse(url, {
        download: true,
        header: true,
        delimiter: ';', // Ustaw delimiter na średnik
        complete: (result) => {
          console.log('CSV Loaded:', result);
          console.log('CSV Headers:', result.meta.fields); // Dodaj logowanie nagłówków
          callback(result);
        },
        error: (error) => {
          console.error('CSV Load Error:', error);
        }
      });
    }
  
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const vote = formData.get('vote');
  
      if (vote) {
        loadCSV(csvUrl, (result) => {
          const data = result.data;
          console.log('Parsed Data:', data);
  
          const headers = result.meta.fields;
          console.log('Headers:', headers);
  
          if (!headers) {
            resultDiv.textContent = 'Błąd: Nagłówki nie są dostępne w pliku CSV.';
            return;
          }
  
          // Wyszukaj indeksy kolumn
          const posiedzenieIndex = headers.indexOf('1-31'); // Przykładowy indeks dla "1-31"
          const glosowanieIndex = headers.indexOf('1-35'); // Przykładowy indeks dla "1-35"
          
          // Przykładowe kolumny do wyszukiwania
          const votesStartIndex = headers.indexOf('1-31');
  
          if (posiedzenieIndex === -1 || glosowanieIndex === -1 || votesStartIndex === -1) {
            resultDiv.textContent = 'Błąd w danych CSV: Nie znaleziono wymaganych nagłówków.';
            return;
          }
  
          let matchingMPs = [];
          data.forEach(row => {
            if (row[posiedzenieIndex] == 1 && row[glosowanieIndex] == 31) {
              const voteColumn = row[votesStartIndex];
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
  