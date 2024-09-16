document.addEventListener("DOMContentLoaded", function () {
    console.log("Strona załadowana, dodawanie obsługi formularza...");

    let currentQuestion = 0;
    const totalQuestions = document.querySelectorAll('.question').length;
    const answers = {};

    const showQuestion = (index) => {
        const questions = document.querySelectorAll('.question');
        questions.forEach((q, i) => {
            q.style.display = (i === index) ? 'block' : 'none';
        });
        document.getElementById('prevBtn').style.display = (index === 0) ? 'none' : 'inline-block';
        document.getElementById('nextBtn').textContent = (index === totalQuestions - 1) ? 'Zatwierdź' : 'Następne';
    };

    const handleOptionClick = (e) => {
        const questionIndex = currentQuestion + 1;
        answers[`vote${questionIndex}`] = e.target.getAttribute('data-value');
        console.log(`Odpowiedź na pytanie ${questionIndex}: ${answers[`vote${questionIndex}`]}`);
    };

    const validateAnswer = () => {
        return !!answers[`vote${currentQuestion + 1}`];
    };

    document.querySelectorAll('.option').forEach(button => {
        button.addEventListener('click', handleOptionClick);
    });

    document.getElementById('nextBtn').addEventListener('click', function () {
        if (!validateAnswer()) {
            alert("Proszę zaznaczyć odpowiedź przed przejściem dalej.");
            return;
        }
        if (currentQuestion < totalQuestions - 1) {
            currentQuestion++;
            showQuestion(currentQuestion);
        } else {
            // Tutaj obsługa zatwierdzenia i wyświetlenia wyników
            submitAnswers();
        }
    });

    document.getElementById('prevBtn').addEventListener('click', function () {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion(currentQuestion);
        }
    });

    const submitAnswers = () => {
        Papa.parse("data/data.csv", {
            download: true,
            delimiter: ";",
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                console.log("CSV załadowany:", results.data);

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
                const scores = results.data.map((row) => {
                    let matchingVotes = 0;
                    let totalVotes = 0;

                    for (let i = 1; i <= 10; i++) {
                        const columnKey = answerKeys[`vote${i}`];
                        if (answers[`vote${i}`] !== null && row[columnKey] !== undefined) {
                            totalVotes++;
                            if (row[columnKey] === answers[`vote${i}`]) {
                                matchingVotes++;
                            }
                        }
                    }

                    const matchingPercentage = totalVotes > 0 ? (matchingVotes / totalVotes) * 100 : 0;
                    return {
                        name: `${row["Imię "]} ${row.Nazwisko}`,
                        club: row["Klub"],
                        matchingPercentage: matchingPercentage.toFixed(2)
                    };
                });

                scores.sort((a, b) => b.matchingPercentage - a.matchingPercentage);

                const resultDiv = document.getElementById('result');
                let htmlContent = `
                    <h2>Procentowa zgodność z poszczególnymi posłami:</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Poseł</th>
                                <th>Klub</th>
                                <th>Procent zgodności</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                scores.forEach(score => {
                    htmlContent += `
                        <tr>
                            <td>${score.name}</td>
                            <td>${score.club}</td>
                            <td>${score.matchingPercentage}%</td>
                        </tr>
                    `;
                });
                htmlContent += `
                        </tbody>
                    </table>
                `;
                resultDiv.innerHTML = htmlContent;
            }
        });
    };

    showQuestion(currentQuestion);
});
