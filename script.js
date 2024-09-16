document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('surveyForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Zapobiega przeładowaniu strony

        // Pobranie odpowiedzi z formularza
        const answers = Array.from(document.querySelectorAll('input[type="radio"]:checked'))
            .map(input => ({
                column: input.dataset.column,
                vote: input.value
            }));

        // Wczytywanie pliku CSV
        Papa.parse("data/data.csv", {
            download: true,
            delimiter: ";",
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const data = results.data;
                const columnKeys = answers.map(a => a.column);
                const filteredData = data.filter(row => columnKeys.includes(row['column']));

                // Obliczanie zgodności
                const compatibility = {};
                const voteCounts = {};

                filteredData.forEach(row => {
                    columnKeys.forEach(columnKey => {
                        if (!compatibility[row.Nazwisko]) {
                            compatibility[row.Nazwisko] = { ZA: 0, PRZECIW: 0, WSTRZYMAŁ: 0, total: 0 };
                        }

                        if (row[columnKey] === 'ZA') compatibility[row.Nazwisko].ZA++;
                        else if (row[columnKey] === 'PRZECIW') compatibility[row.Nazwisko].PRZECIW++;
                        else if (row[columnKey] === 'WSTRZYMAŁ SIĘ') compatibility[row.Nazwisko].WSTRZYMAŁ++;

                        compatibility[row.Nazwisko].total++;
                    });
                });

                // Obliczanie procentowej zgodności
                const resultsTable = [];
                for (const [name, votes] of Object.entries(compatibility)) {
                    const totalVotes = votes.total;
                    const correctVotes = votes.ZA + votes.PRZECIW + votes.WSTRZYMAŁ;
                    const percentage = ((correctVotes / totalVotes) * 100).toFixed(2);

                    resultsTable.push({
                        name,
                        percentage,
                        votes
                    });
                }

                // Sortowanie wyników od najbardziej zgodnych do najmniej zgodnych
                resultsTable.sort((a, b) => b.percentage - a.percentage);

                // Generowanie tabeli wyników
                const resultDiv = document.getElementById('result');
                resultDiv.innerHTML = "<h2>Wyniki porównań:</h2>";

                let htmlContent = "<table><thead><tr><th>Imię i nazwisko</th><th>Klub</th><th>Za</th><th>Przeciw</th><th>Wstrzymał się</th><th>Procent zgodności</th></tr></thead><tbody>";
                
                resultsTable.forEach(row => {
                    htmlContent += `<tr>
                        <td>${row.name}</td>
                        <td>${data.find(d => d.Nazwisko === row.name).Klub}</td>
                        <td>${row.votes.ZA}</td>
                        <td>${row.votes.PRZECIW}</td>
                        <td>${row.votes.WSTRZYMAŁ}</td>
                        <td>${row.percentage}%</td>
                    </tr>`;
                });

                htmlContent += "</tbody></table>";
                resultDiv.innerHTML = htmlContent;

                // Generowanie podsumowania
                const summaryDiv = document.getElementById('summary');
                summaryDiv.innerHTML = "<h3>Podsumowanie głosowań:</h3>";

                const summaries = {
                    "1-31": { ZA: 0, PRZECIW: 0, WSTRZYMAŁ: 0, NIEOBECNY: 0 },
                    "1-35": { ZA: 0, PRZECIW: 0, WSTRZYMAŁ: 0, NIEOBECNY: 0 },
                    "1-40": { ZA: 0, PRZECIW: 0, WSTRZYMAŁ: 0, NIEOBECNY: 0 },
                    "1-56": { ZA: 0, PRZECIW: 0, WSTRZYMAŁ: 0, NIEOBECNY: 0 }
                };

                filteredData.forEach(row => {
                    columnKeys.forEach(columnKey => {
                        if (summaries[columnKey]) {
                            summaries[columnKey].ZA += parseInt(row.ZA || 0);
                            summaries[columnKey].PRZECIW += parseInt(row.PRZECIW || 0);
                            summaries[columnKey].WSTRZYMAŁ += parseInt(row.WSTRZYMAŁ || 0);
                            summaries[columnKey].NIEOBECNY += parseInt(row.NIEOBECNY || 0);
                        }
                    });
                });

                let summaryHtml = "<table><thead><tr><th>Głosowanie</th><th>ZA</th><th>Przeciw</th><th>Wstrzymał się</th><th>Nieobecny</th><th>Dyscyplina</th></tr></thead><tbody>";

                Object.keys(summaries).forEach(key => {
                    const totalVotes = summaries[key].ZA + summaries[key].PRZECIW + summaries[key].WSTRZYMAŁ + summaries[key].NIEOBECNY;
                    const discipline = totalVotes ? ((summaries[key].ZA + summaries[key].PRZECIW) / totalVotes * 100).toFixed(2) + "%" : "Brak danych";
                    
                    summaryHtml += `<tr>
                        <td>Posiedzenie nr 1, głosowanie nr ${key}</td>
                        <td>${summaries[key].ZA}</td>
                        <td>${summaries[key].PRZECIW}</td>
                        <td>${summaries[key].WSTRZYMAŁ}</td>
                        <td>${summaries[key].NIEOBECNY}</td>
                        <td>${discipline}</td>
                    </tr>`;
                });

                summaryHtml += "</tbody></table>";
                summaryDiv.innerHTML = summaryHtml;
            }
        });
    });
});
