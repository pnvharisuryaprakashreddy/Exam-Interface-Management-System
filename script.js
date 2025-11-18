function submitExam() {
    let correct = 0;
    const total = 3;

    const answers = {
        q1: "correct",
        q2: "correct",
        q3: "correct"
    };

    // Check answer selection
    for (let key in answers) {
        let selected = document.querySelector(`input[name="${key}"]:checked`);
        if (!selected) {
            alert("Please answer all questions before submitting.");
            return;
        }
        if (selected.value === answers[key]) {
            correct++;
        }
    }

    // Show score with animation
    let result = document.getElementById("result");
    result.style.color = correct === total ? "green" : "red";

    let score = 0;
    let animation = setInterval(() => {
        if (score <= correct) {
            result.innerHTML = `You scored ${score}/${total}!`;
            score++;
        } else {
            clearInterval(animation);
        }
    }, 150);
}
