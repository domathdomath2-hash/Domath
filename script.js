// ==========================================
// نظام حفظ النقاط في المتصفح (LocalStorage)
// ==========================================
let savedScore = localStorage.getItem('domath_score');

if (!savedScore) {
    savedScore = 0;
    localStorage.setItem('domath_score', savedScore);
} else {
    savedScore = parseInt(savedScore);
}

document.addEventListener('DOMContentLoaded', () => {
    const scoreDisplay = document.getElementById('global-score');
    if (scoreDisplay) {
        scoreDisplay.innerText = savedScore;
    }
    
    // تشغيل التحدي اليومي إذا كنا في الصفحة الرئيسية
    setupDailyChallenge();
});

window.addPoints = function(pointsToAdd) {
    savedScore += pointsToAdd;
    localStorage.setItem('domath_score', savedScore);
    
    const scoreDisplay = document.getElementById('global-score');
    if (scoreDisplay) {
        scoreDisplay.innerText = savedScore;
    }
};

// ==========================================
// كود التحدي اليومي المتجدد في الصفحة الرئيسية
// ==========================================

// بنك أسئلة التحدي السريع (معادلات رياضية بمستوى تفكير عالي)
const dailyEquations = [
    { expr: "3س + 5 = 20", options: ["س = 3", "س = 5", "س = 15"], correct: 1 },
    { expr: "2س - 4 = 10", options: ["س = 7", "س = 6", "س = 14"], correct: 0 },
    { expr: "4س = 24", options: ["س = 5", "س = 6", "س = 8"], correct: 1 },
    { expr: "س / 2 + 3 = 8", options: ["س = 10", "س = 5", "س = 16"], correct: 0 },
    { expr: "5س - 5 = 20", options: ["س = 4", "س = 5", "س = 25"], correct: 1 },
    { expr: "10 + 2س = 22", options: ["س = 6", "س = 12", "س = 5"], correct: 0 },
    { expr: "3س = 27", options: ["س = 8", "س = 9", "س = 10"], correct: 1 }
];

let homeAnswered = false;

function setupDailyChallenge() {
    const questionText = document.getElementById('daily-question-text');
    const optionsContainer = document.getElementById('daily-options');
    
    // إذا ما لقينا هذي العناصر، يعني إحنا مو في الصفحة الرئيسية، فنوقف الكود هنا
    if (!questionText || !optionsContainer) return;

    const today = new Date();
    // يختار معادلة مختلفة كل يوم بناءً على تاريخ اليوم
    const questionIndex = today.getDate() % dailyEquations.length;
    const currentChallenge = dailyEquations[questionIndex];

    // طباعة المعادلة في الصفحة بنفس التصميم الحلو
    questionText.innerHTML = `ما هو ناتج حل المعادلة: <span class="math-expr">${currentChallenge.expr}</span> ؟`;

    // طباعة الأزرار الثلاثة
    let optionsHtml = "";
    currentChallenge.options.forEach((opt, index) => {
        let isCorrect = (index === currentChallenge.correct) ? "true" : "false";
        optionsHtml += `<button class="option-btn" onclick="checkAnswer(this, ${isCorrect})">${opt}</button>`;
    });
    optionsContainer.innerHTML = optionsHtml;

    // التحقق إذا كان الطالب قد حل معادلة اليوم مسبقاً عشان ما يغش
    const lastSolved = localStorage.getItem('domath_daily_solved');
    if (lastSolved === today.toDateString()) {
        homeAnswered = true;
        const feedback = document.getElementById('feedback');
        feedback.innerText = "🎉 لقد قمت بحل تحدي اليوم بنجاح مسبقاً! عد غداً لمعادلة جديدة.";
        feedback.style.color = '#2ed573';
        disableHomeOptions();
    }
}

window.checkAnswer = function(buttonElement, isCorrect) {
    if (homeAnswered) return;

    const feedback = document.getElementById('feedback');
    const today = new Date();

    if (isCorrect) {
        buttonElement.style.backgroundColor = '#2ed573';
        buttonElement.style.borderColor = '#2ed573';
        buttonElement.style.color = '#ffffff';
        
        feedback.innerText = '🎉 إجابة رائعة وصحيحة! تم إضافة 50 نقطة لحسابك.';
        feedback.style.color = '#2ed573';
        
        addPoints(50);
        
        // حفظ تاريخ الحل عشان ما يقدر يعيد التحدي في نفس اليوم
        localStorage.setItem('domath_daily_solved', today.toDateString());
    } else {
        buttonElement.style.backgroundColor = '#ff4757';
        buttonElement.style.borderColor = '#ff4757';
        buttonElement.style.color = '#ffffff';
        
        feedback.innerText = '❌ إجابة خاطئة، حاول بتركيز أكبر في تحدي الغد!';
        feedback.style.color = '#ff4757';
    }

    homeAnswered = true;
    disableHomeOptions();
};

// دالة لتعطيل الأزرار وتوضيح الإجابة الصحيحة للطالب
function disableHomeOptions() {
    const allButtons = document.querySelectorAll('#daily-options .option-btn');
    allButtons.forEach(btn => {
        btn.style.cursor = 'not-allowed';
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes('true')) {
             btn.style.border = '2px solid #2ed573';
             btn.style.color = '#2ed573';
        }
    });
}