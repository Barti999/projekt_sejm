document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('surveyForm');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const vote = formData.get('vote');

        if (vote) {
            resultDiv.textContent = `Wybrałeś: ${vote}`;
        } else {
            resultDiv.textContent = 'Proszę wybrać opcję.';
        }
    });
});
