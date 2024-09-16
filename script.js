document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('surveyForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Zapobiega przeładowaniu strony

        // Pobranie wybranej opcji głosowania
        const votes = {};
        document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
            const column = radio.getAttribute('data-column');
            votes[column] = radio.value;
        });

        // Wczytywanie pliku CSV
        Papa.parse("data/data.csv", {
            download: true,  // Pobieranie pliku CSV z serwera
            delimiter: ";",
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const data = results.data;
                const poslowie = {};
                const glosowania = ["1-31", "1-35", "1-40", "1-56"];
                glosowania.forEach(g => {
                    poslowie[g] = {
                        za: 0,
                        przeciw: 0,
                        wstrzymal: 0,
                        nieobecny: 0,
                        total: 0
                    };
                });

                data.forEach(row => {
                    if (row.Imie_i_nazwisko && row.Klub) {
                        glosowania.forEach(g => {
                            if (row[g] === "ZA") poslowie[g].za++;
                            if (row[g] === "PRZECIW") poslowie[g].przeciw++;
                            if (row[g] === "WSTRZYMAŁ SIĘ") poslowie[g].wstrzymal++;
                            if (row[g] === "NIEOBECNY") poslowie[g].nieobecny++;
                            poslowie[g].total++;
                        });
                    }
                });

                let resultHtml = '<h2>Lista posłów</h2><table><thead><tr><th>Imię i nazwisko</th><th>Klub</th><th>Za</th><th>Przeciw</th><th>Wstrzymał się</th><th>Procent zgodności</th></tr></thead><tbody>';
                
                data.forEach(row => {
                    if (row.Imie_i_nazwisko && row.Klub) {
                        const name = row.Imie_i_nazwisko;
                        const club = row.Klub;
                        let zgodnosc = 0;
                        glosowania.forEach(g => {
                            if (votes[g]) {
                                const vote = votes[g];
                                if (row[g] === vote) {
                                    zgodnosc += 100;
                                }
                            }
                        });
                        zgodnosc = (zgodnosc / glosowania.length).toFixed(2);
                        resultHtml += `<tr><td>${name}</td><td>${club}</td><td>${zgodnosc}%</td></tr>`;
                    }
                });
                resultHtml += '</tbody></table>';

                let summaryHtml = '<h2>Podsumowanie głosowań</h2><table><thead><tr><th>Posiedzenie</th><th>Za</th><th>Przeciw</th><th>Wstrzymał się</th><th>Niebecny</th><th>Dyscyplina</th></tr></thead><tbody>';

                glosowania.forEach(g => {
                    const data = poslowie[g];
                    const dyscyplina = ((data.za + data.przeciw + data.wstrzymal) / data.total * 100).toFixed(2) + '%';
                    summaryHtml += `<tr><td>Posiedzenie nr 1, głosowanie nr ${g}</td><td>${data.za}</td><td>${data.przeciw}</td><td>${data.wstrzymal}</td><td>${data.nieobecny}</td><td>${dyscyplina}</td></tr>`;
                });

                summaryHtml += '</tbody></table>';

                document.getElementById('result').innerHTML = resultHtml;
                document.getElementById('summary').innerHTML = summaryHtml;
            }
        });
    });
});
