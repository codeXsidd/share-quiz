let currentQuizData = [
            {
                question: "Which language runs in a web browser?",
                a: "Java",
                b: "C", 
                c: "Python",
                d: "JavaScript",
                correct: "d"
            },
            {
                question: "What does CSS stand for?",
                a: "Central Style Sheets",
                b: "Cascading Style Sheets",
                c: "Cascading Simple Sheets", 
                d: "Cars SUVs Sailboats",
                correct: "b"
            },
            {
                question: "What does HTML stand for?",
                a: "Hypertext Markup Language",
                b: "Hypertext Markdown Language",
                c: "Hyperloop Machine Language",
                d: "Helicopters Terminals Motorboats Lamborginis", 
                correct: "a"
            },
            {
                question: "What year was JavaScript launched?",
                a: "1996",
                b: "1995", 
                c: "1994",
                d: "none of the above",
                correct: "b"
            }
        ];

        let currentQuizTitle = "Sample Quiz";
        let currentQuestionIndex = 0;
        let score = 0;
        let userAnswers = [];

        // Tab switching functionality
        function switchTab(tabName) {
            // Remove active class from all tabs
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to selected tab
            document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
            
            if (tabName === 'quiz') {
                loadQuizForTaking();
            }
        }

        // Quiz Editor Functions
        function addQuestion() {
            const container = document.getElementById('questions-container');
            const questionCount = container.children.length + 1;
            
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-item';
            questionDiv.innerHTML = `
                <div class="question-header">
                    <span class="question-number">Question ${questionCount}</span>
                    <button class="delete-question" onclick="deleteQuestion(this)">Delete</button>
                </div>
                <input type="text" class="question-input" placeholder="Enter your question..." value="">
                <div class="answers-grid">
                    <div class="answer-option">
                        <input type="radio" name="correct-${questionCount}" value="a">
                        <input type="text" class="answer-input" placeholder="Option A" data-option="a">
                    </div>
                    <div class="answer-option">
                        <input type="radio" name="correct-${questionCount}" value="b">
                        <input type="text" class="answer-input" placeholder="Option B" data-option="b">
                    </div>
                    <div class="answer-option">
                        <input type="radio" name="correct-${questionCount}" value="c">
                        <input type="text" class="answer-input" placeholder="Option C" data-option="c">
                    </div>
                    <div class="answer-option">
                        <input type="radio" name="correct-${questionCount}" value="d">
                        <input type="text" class="answer-input" placeholder="Option D" data-option="d">
                    </div>
                </div>
            `;
            
            container.appendChild(questionDiv);
            updateQuestionNumbers();
        }

        function deleteQuestion(button) {
            button.closest('.question-item').remove();
            updateQuestionNumbers();
        }

        function updateQuestionNumbers() {
            const questions = document.querySelectorAll('.question-item');
            questions.forEach((question, index) => {
                const questionNumber = question.querySelector('.question-number');
                questionNumber.textContent = `Question ${index + 1}`;
                
                // Update radio button names to ensure uniqueness
                const radioButtons = question.querySelectorAll('input[type="radio"]');
                radioButtons.forEach(radio => {
                    radio.name = `correct-${index + 1}`;
                });
            });
        }

        function saveQuiz() {
            const title = document.getElementById('quiz-title').value.trim();
            const questionItems = document.querySelectorAll('.question-item');
            
            if (!title) {
                showMessage('Please enter a quiz title.', 'error');
                return;
            }
            
            if (questionItems.length === 0) {
                showMessage('Please add at least one question.', 'error');
                return;
            }
            
            const quizData = [];
            let hasError = false;
            
            questionItems.forEach((item, index) => {
                const questionText = item.querySelector('.question-input').value.trim();
                const answerInputs = item.querySelectorAll('.answer-input');
                const correctRadio = item.querySelector('input[type="radio"]:checked');
                
                if (!questionText) {
                    showMessage(`Question ${index + 1} is missing question text.`, 'error');
                    hasError = true;
                    return;
                }
                
                if (!correctRadio) {
                    showMessage(`Question ${index + 1} is missing correct answer selection.`, 'error');
                    hasError = true;
                    return;
                }
                
                const answers = {};
                let emptyAnswers = 0;
                
                answerInputs.forEach(input => {
                    const option = input.getAttribute('data-option');
                    const value = input.value.trim();
                    if (!value) emptyAnswers++;
                    answers[option] = value;
                });
                
                if (emptyAnswers > 0) {
                    showMessage(`Question ${index + 1} has empty answer options.`, 'error');
                    hasError = true;
                    return;
                }
                
                quizData.push({
                    question: questionText,
                    a: answers.a,
                    b: answers.b,
                    c: answers.c,
                    d: answers.d,
                    correct: correctRadio.value
                });
            });
            
            if (hasError) return;
            
            currentQuizData = quizData;
            currentQuizTitle = title;
            
            showMessage('Quiz saved successfully!', 'success');
        }

        function generateShareableLink() {
            saveQuiz(); // Save first
            
            if (currentQuizData.length === 0) return;
            
            // Create a shareable data object
            const shareData = {
                title: currentQuizTitle,
                questions: currentQuizData,
                mode: 'view'
            };
            
            // Encode the data
            const encodedData = btoa(JSON.stringify(shareData));
            const shareableLink = `${window.location.origin}${window.location.pathname}?quiz=${encodedData}`;
            
            document.getElementById('share-link').value = shareableLink;
            document.getElementById('share-section').classList.remove('hidden');
            
            showMessage('Shareable link generated! Others can use this link to take your quiz.', 'success');
        }

        function copyLink() {
            const linkInput = document.getElementById('share-link');
            linkInput.select();
            linkInput.setSelectionRange(0, 99999);
            
            try {
                document.execCommand('copy');
                showMessage('Link copied to clipboard!', 'success');
            } catch (err) {
                console.error('Failed to copy link:', err);
                showMessage('Failed to copy link. Please copy manually.', 'error');
            }
        }

        function showMessage(text, type) {
            const container = document.getElementById('message-container');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            messageDiv.textContent = text;
            
            container.innerHTML = '';
            container.appendChild(messageDiv);
            
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }

        // Quiz Taking Functions
        function loadQuizForTaking() {
            currentQuestionIndex = 0;
            score = 0;
            userAnswers = [];
            
            document.getElementById('quiz-title-display').textContent = currentQuizTitle;
            document.getElementById('total-questions').textContent = currentQuizData.length;
            document.getElementById('quiz-container').classList.remove('hidden');
            document.getElementById('results-container').classList.add('hidden');
            
            displayQuestion();
        }

        function displayQuestion() {
            if (currentQuestionIndex >= currentQuizData.length) {
                showResults();
                return;
            }
            
            const question = currentQuizData[currentQuestionIndex];
            document.getElementById('current-question').textContent = currentQuestionIndex + 1;
            document.getElementById('question-text').textContent = question.question;
            document.getElementById('answer-a').textContent = question.a;
            document.getElementById('answer-b').textContent = question.b;
            document.getElementById('answer-c').textContent = question.c;
            document.getElementById('answer-d').textContent = question.d;
            
            // Clear previous selection
            document.querySelectorAll('input[name="answer"]').forEach(radio => radio.checked = false);
            
            // Update button text
            const submitButton = document.querySelector('.submit-button');
            submitButton.textContent = (currentQuestionIndex === currentQuizData.length - 1) ? 'Finish Quiz' : 'Next Question';
        }

        function submitAnswer() {
            const selectedAnswer = document.querySelector('input[name="answer"]:checked');
            
            if (!selectedAnswer) {
                alert('Please select an answer before proceeding.');
                return;
            }
            
            const userAnswer = selectedAnswer.value;
            const correctAnswer = currentQuizData[currentQuestionIndex].correct;
            
            userAnswers.push(userAnswer);
            
            if (userAnswer === correctAnswer) {
                score++;
            }
            
            currentQuestionIndex++;
            displayQuestion();
        }

        function showResults() {
            document.getElementById('quiz-container').classList.add('hidden');
            document.getElementById('results-container').classList.remove('hidden');
            
            const percentage = Math.round((score / currentQuizData.length) * 100);
            document.getElementById('final-score').textContent = `${score}/${currentQuizData.length}`;
            
            let resultText = '';
            if (percentage === 100) {
                resultText = 'Perfect! Outstanding performance!';
            } else if (percentage >= 80) {
                resultText = 'Excellent work! Great job!';
            } else if (percentage >= 60) {
                resultText = 'Good job! Keep it up!';
            } else {
                resultText = 'Keep practicing! You can do better!';
            }
            
            document.querySelector('.score-text').textContent = resultText;
        }

        function restartQuiz() {
            loadQuizForTaking();
        }

        // Load quiz from URL parameter on page load
        function loadQuizFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            const quizParam = urlParams.get('quiz');
            
            if (quizParam) {
                try {
                    const shareData = JSON.parse(atob(quizParam));
                    if (shareData.mode === 'view' && shareData.questions && shareData.title) {
                        currentQuizData = shareData.questions;
                        currentQuizTitle = shareData.title;
                        
                        // Switch to quiz tab and hide editor
                        switchTab('quiz');
                        document.querySelector('[onclick="switchTab(\'editor\')"]').style.display = 'none';
                        
                        showMessage('Loaded shared quiz! You can now take the quiz.', 'success');
                    }
                } catch (e) {
                    console.error('Failed to load quiz from URL:', e);
                }
            }
        }

        // Initialize the app
        function initializeApp() {
            // Load default questions in editor
            currentQuizData.forEach(() => addQuestion());
            
            const questionItems = document.querySelectorAll('.question-item');
            questionItems.forEach((item, index) => {
                const data = currentQuizData[index];
                item.querySelector('.question-input').value = data.question;
                item.querySelector(`[data-option="a"]`).value = data.a;
                item.querySelector(`[data-option="b"]`).value = data.b;
                item.querySelector(`[data-option="c"]`).value = data.c;
                item.querySelector(`[data-option="d"]`).value = data.d;
                item.querySelector(`input[value="${data.correct}"]`).checked = true;
            });
            
            // Load quiz from URL if present
            loadQuizFromURL();
        }

        // Start the app when page loads
        window.addEventListener('load', initializeApp);