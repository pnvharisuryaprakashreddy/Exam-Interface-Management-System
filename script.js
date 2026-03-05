const ANSWERS = {
    q1: "correct",
    q2: "correct",
    q3: "correct",
    q4: "correct",
    q5: "correct"
};

const TOTAL_QUESTIONS = Object.keys(ANSWERS).length;
const TIMER_DURATION_SECONDS = 60;

let timerInterval = null;
let examSubmitted = false;

document.addEventListener("DOMContentLoaded", () => {
    loadScores();
    startTimer();
});

function startTimer() {
    const timerElement = document.getElementById("timer");
    let remaining = TIMER_DURATION_SECONDS;
    updateTimerDisplay(timerElement, remaining);

    timerInterval = setInterval(() => {
        remaining--;
        updateTimerDisplay(timerElement, remaining);

        if (remaining <= 0) {
            clearInterval(timerInterval);
            if (!examSubmitted) {
                submitExam(true);
            }
        }
    }, 1000);
}

function updateTimerDisplay(element, seconds) {
    const safeSeconds = Math.max(seconds, 0);
    const mins = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
    const secs = String(safeSeconds % 60).padStart(2, "0");
    element.textContent = `Time left: ${mins}:${secs}`;
}

function submitExam(auto = false) {
    if (examSubmitted) {
        return;
    }

    let correct = 0;

    // Reset previous visual feedback
    document.querySelectorAll(".question").forEach(q => q.classList.remove("unanswered"));
    document.querySelectorAll(".question label").forEach(label => {
        label.classList.remove("correct-answer", "wrong-answer");
    });

    // Check answer selection
    for (let key in ANSWERS) {
        const options = document.querySelectorAll(`input[name="${key}"]`);
        let selectedOption = null;

        options.forEach(option => {
            if (option.checked) {
                selectedOption = option;
            }
        });

        // If not auto-submission and something is unanswered, ask user to complete
        if (!auto && !selectedOption) {
            const questionContainer = options[0]?.closest(".question");
            if (questionContainer) {
                questionContainer.classList.add("unanswered");
            }
            alert("Please answer all questions before submitting.");
            return;
        }

        // Highlight correct option
        options.forEach(option => {
            const label = option.parentElement;
            if (option.value === ANSWERS[key]) {
                label.classList.add("correct-answer");
            }
        });

        // Count and highlight wrong selections
        if (selectedOption) {
            if (selectedOption.value === ANSWERS[key]) {
                correct++;
            } else {
                selectedOption.parentElement.classList.add("wrong-answer");
            }
        }
    }

    examSubmitted = true;
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    // Disable all inputs and submit button
    document.querySelectorAll("#examForm input[type='radio']").forEach(input => {
        input.disabled = true;
    });
    const submitButton = document.querySelector(".btn");
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Exam Submitted";
    }

    // Show score with animation
    const result = document.getElementById("result");
    result.style.color = correct === TOTAL_QUESTIONS ? "green" : "red";

    let score = 0;
    const animation = setInterval(() => {
        if (score <= correct) {
            result.innerHTML = `You scored ${score}/${TOTAL_QUESTIONS}!`;
            score++;
        } else {
            clearInterval(animation);
        }
    }, 150);

    saveScores(correct, TOTAL_QUESTIONS);
}

function saveScores(correct, total) {
    const currentScore = `${correct}/${total}`;
    localStorage.setItem("examLastScore", currentScore);

    const previousBest = localStorage.getItem("examBestScore");
    const currentRatio = correct / total;
    let bestToSave = currentScore;

    if (previousBest) {
        const [prevCorrect, prevTotal] = previousBest.split("/").map(Number);
        if (!isNaN(prevCorrect) && !isNaN(prevTotal) && prevTotal > 0) {
            const prevRatio = prevCorrect / prevTotal;
            if (prevRatio >= currentRatio) {
                bestToSave = previousBest;
            }
        }
    }

    localStorage.setItem("examBestScore", bestToSave);
    loadScores();
}

function loadScores() {
    const lastScoreElement = document.getElementById("lastScore");
    const bestScoreElement = document.getElementById("bestScore");

    const lastScore = localStorage.getItem("examLastScore");
    const bestScore = localStorage.getItem("examBestScore");

    if (lastScoreElement) {
        lastScoreElement.textContent = lastScore ? `Last score: ${lastScore}` : "Last score: -";
    }

    if (bestScoreElement) {
        bestScoreElement.textContent = bestScore ? `Best score: ${bestScore}` : "Best score: -";
    }
}
