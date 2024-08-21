document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedbackForm');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            age: formData.get('age'),
            grade: formData.get('grade'),
            school: formData.get('school'),
            rating: formData.get('rating'),
            extra: formData.get('extra-curricular')
        };

        try {
            const response = await fetch('/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            messageDiv.textContent = result.message;
            form.reset(); // Limpa o formulário após o envio
        } catch (error) {
            console.error('Erro:', error);
            messageDiv.textContent = 'Erro ao enviar formulário.';
        }
    });
});
