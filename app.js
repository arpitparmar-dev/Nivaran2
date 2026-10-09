let currentAddiction = "";

let appData = JSON.parse(localStorage.getItem("niv_v_final")) || {
    user: { name: "Guest", img: null },
    sm: { day: 1, streak: 0, shields: 0, done: {} },
    sa: { day: 1, streak: 0, shields: 0, done: {} },
    gm: { day: 1, streak: 0, shields: 0, done: {} },
    jf: { day: 1, streak: 0, shields: 0, done: {} },
    gb: { day: 1, streak: 0, shields: 0, done: {} },
    cf: { day: 1, streak: 0, shields: 0, done: {} }
};

// Ensure new progress entries exist for users who already have saved data.
["sm", "sa", "gm", "jf", "gb", "cf"].forEach(key => {
    if (!appData[key]) {
        appData[key] = { day: 1, streak: 0, shields: 0, done: {} };
    }
});

const MILESTONES = [7, 21, 30, 60, 75, 120];

const STAT_MAP = {
    "Mobile & Social Media": "sm",
    "Smoking / Alcohol": "sa",
    "Gaming": "gm",
    "Junk Food": "jf",
    "Gambling / Betting": "gb",
    "Caffeine": "cf"
};

const DAILY_MISSIONS = {
    sm: [
        "Day 1: Uninstall one non-essential social app.",
        "Day 2: Set a 30-minute limit on Instagram/TikTok.",
        "Day 3: Do not check your phone for the first hour of the day.",
        "Day 4: Turn off non-essential notifications.",
        "Day 5: Leave your phone in another room while eating.",
        "Day 6: No phone 1 hour before sleep.",
        "Day 7: Complete a planned social media break."
    ],

    sa: [
        "Day 1: Identify the substances and situations you want to change.",
        "Day 2: Identify your top 3 triggers.",
        "Day 3: Contact a trusted person for support.",
        "Day 4: Plan a healthy activity for a high-risk time.",
        "Day 5: Practise a safe coping strategy when a craving appears.",
        "Day 6: Write down five benefits of recovery.",
        "Day 7: Review your progress and plan next week."
    ],

    gm: [
        "Day 1: Move your console/PC to a different spot.",
        "Day 2: Unsubscribe from one gaming channel.",
        "Day 3: Set a realistic gaming time limit.",
        "Day 4: Clean your desk and gaming area.",
        "Day 5: Try a physical hobby for 30 minutes.",
        "Day 6: Research a skill you want to learn.",
        "Day 7: Take a planned break from your most distracting game."
    ],

    jf: [
        "Day 1: Swap a sugary drink for water.",
        "Day 2: Notice when you eat because of boredom or stress.",
        "Day 3: Include vegetables in two meals.",
        "Day 4: Prepare a balanced snack in advance.",
        "Day 5: Cook a meal at home.",
        "Day 6: Read the nutrition label of a packaged snack.",
        "Day 7: Review your eating patterns without judging yourself."
    ],

    gb: [
        "Day 1: Remove betting apps and saved payment methods.",
        "Day 2: Write down your top 3 gambling triggers.",
        "Day 3: Block gambling websites and avoid betting content.",
        "Day 4: Tell a trusted person about your recovery goal.",
        "Day 5: Delay an urge by 20 minutes and do another activity.",
        "Day 6: Review a financial goal you want to protect.",
        "Day 7: Review your gambling-free progress and plan next week."
    ],

    cf: [
        "Day 1: Record every caffeinated drink you consume.",
        "Day 2: Replace one caffeinated drink with a caffeine-free option.",
        "Day 3: Avoid caffeine late in the day.",
        "Day 4: Drink water before reaching for your usual caffeinated drink.",
        "Day 5: Try a caffeine-free alternative to an energy drink.",
        "Day 6: Follow a consistent sleep schedule.",
        "Day 7: Review your caffeine intake and plan a manageable reduction."
    ]
};

const DAILY_ROUTINES = {
    1: ["Morning Stretch", "Plan the Day", "10 Min Meditation"],
    2: ["Drink Water First", "Read 5 Pages", "Journal Feelings"],
    3: ["No Screen at Breakfast", "Deep Breathing", "Tidy Room"],
    4: ["Relaxation Break", "Positive Affirmation", "Light Exercise"],
    5: ["Healthy Breakfast", "Work/Study Focus", "Early Sleep"],
    6: ["Mindful Walking", "Gratitude List", "Review Triggers"],
    7: ["Reflect on the Week", "Clean Environment", "Plan Next Week"]
};

const MEALS = {
    sm: {
        breakfast: [
            "Oatmeal with nuts and banana",
            "Vegetable omelette and whole wheat toast",
            "Curd with fruit and seeds",
            "Peanut butter toast and apple"
        ],
        lunch: [
            "Brown rice, dal and mixed vegetables",
            "Quinoa with tofu and salad",
            "Roti with paneer curry",
            "Chole with rice"
        ],
        dinner: [
            "Vegetable soup and paneer",
            "Stir-fried vegetables with tofu",
            "Palak soup and salad",
            "Light khichdi"
        ]
    },

    sa: {
        breakfast: [
            "Orange or amla with oatmeal",
            "Spinach and apple smoothie",
            "Eggs and whole wheat toast",
            "Curd with flax seeds"
        ],
        lunch: [
            "Brown rice, dal and beetroot",
            "Tofu with steamed vegetables",
            "Rajma with rice",
            "Quinoa with vegetable curry"
        ],
        dinner: [
            "Vegetable soup",
            "Clear chicken or vegetable soup",
            "Palak with whole wheat roti",
            "Light khichdi with curd"
        ]
    },

    gm: {
        breakfast: [
            "Oatmeal, peanut butter and banana",
            "Egg omelette and whole wheat toast",
            "Banana smoothie",
            "Sprouts salad"
        ],
        lunch: [
            "Brown rice, protein and salad",
            "Sweet potato and dal",
            "Roti with paneer",
            "Chole with quinoa"
        ],
        dinner: [
            "Grilled tofu and vegetables",
            "Mixed salad bowl",
            "Lentil soup and roti",
            "Vegetable curry and quinoa"
        ]
    },

    jf: {
        breakfast: [
            "Vegetable omelette and fruit",
            "Sprouts salad and nuts",
            "Oatmeal with chia seeds",
            "Curd and apple"
        ],
        lunch: [
            "Brown rice, dal and salad",
            "Tofu with steamed vegetables",
            "Roti with vegetable curry",
            "Khichdi with curd"
        ],
        dinner: [
            "Vegetable soup and salad",
            "Stir-fried vegetables with tofu",
            "Spinach soup",
            "Dal and whole wheat roti"
        ]
    },

    gb: {
        breakfast: [
            "Oatmeal, banana and nuts",
            "Eggs and whole wheat toast",
            "Curd with seeds and fruit",
            "Poha with vegetables"
        ],
        lunch: [
            "Dal, brown rice and vegetables",
            "Roti with paneer or tofu",
            "Rajma, rice and cucumber salad",
            "Chickpea curry and roti"
        ],
        dinner: [
            "Vegetable soup and dal",
            "Khichdi with curd",
            "Tofu or paneer with vegetables",
            "Dal, roti and salad"
        ]
    },

    cf: {
        breakfast: [
            "Oatmeal, banana and nuts",
            "Egg omelette and whole wheat toast",
            "Poha with vegetables and fruit",
            "Curd, oats and seeds"
        ],
        lunch: [
            "Brown rice, dal and vegetables",
            "Roti with paneer or tofu",
            "Rajma, brown rice and vegetables",
            "Khichdi with curd"
        ],
        dinner: [
            "Vegetable soup and roti",
            "Dal, rice and vegetables",
            "Tofu or paneer with salad",
            "Light khichdi with vegetables"
        ]
    }
};

function getPhase(day) {
    if (day <= 7) return 1;
    if (day <= 21) return 2;
    if (day <= 30) return 3;
    if (day <= 60) return 4;
    if (day <= 75) return 5;
    return 6;
}

function generateRecoveryPlan(key, day) {
    const phase = getPhase(day);
    const workout = 15 + (day * 0.5);
    const meditation = 5 + (day * 0.2);
    const sunlight = 10 + Math.floor(day / 5);
    const meals = MEALS[key];

    const breakfast = meals.breakfast[day % meals.breakfast.length];
    const lunch = meals.lunch[(day * 2) % meals.lunch.length];
    const dinner = meals.dinner[(day * 3) % meals.dinner.length];

    const detailedDietContent =
        `🥣 BREAKFAST:\n• ${breakfast}\n\n` +
        `🍛 LUNCH:\n• ${lunch}\n\n` +
        `🍲 DINNER:\n• ${dinner}\n\n` +
        `💧 HYDRATION:\n• Drink water regularly according to your needs.\n\n` +
        `Note: These are general meal ideas. Adapt them to your dietary needs.`;

    const plans = {
        sm: {
            shortDiet: "Balanced meals and a planned screen routine",
            physical: `${workout.toFixed(0)} mins brisk walking and posture exercises.`,
            mental: `${meditation.toFixed(0)} mins meditation and a focused activity.`,
            music: phase < 3 ? "Lo-fi / ambient focus" : "Focus instrumentals",
            lifestyle: `${sunlight} mins outdoors and a fixed screen schedule.`
        },

        sa: {
            shortDiet: "Regular balanced meals and hydration",
            physical: `${workout.toFixed(0)} mins gentle exercise, as appropriate.`,
            mental: `${meditation.toFixed(0)} mins relaxation and craving awareness.`,
            music: phase < 3 ? "Calm instrumental music" : "Motivational instrumentals",
            lifestyle: `${sunlight} mins outdoors and a plan to avoid triggers.`
        },

        gm: {
            shortDiet: "Balanced meals for steady energy",
            physical: `${workout.toFixed(0)} mins walking or strength exercises.`,
            mental: `${meditation.toFixed(0)} mins focus training.`,
            music: phase < 3 ? "Focus lo-fi" : "Workout or focus music",
            lifestyle: `${sunlight} mins outdoors and planned gaming hours.`
        },

        jf: {
            shortDiet: "Balanced meals and mindful eating",
            physical: `${workout.toFixed(0)} mins enjoyable physical activity.`,
            mental: `${meditation.toFixed(0)} mins mindful eating practice.`,
            music: phase < 3 ? "Calm music" : "Focused training music",
            lifestyle: `${sunlight} mins walking and regular meal times.`
        },

        gb: {
            shortDiet: "Balanced meals and a stable daily routine",
            physical: `${workout.toFixed(0)} mins walking or another enjoyable activity.`,
            mental: `${meditation.toFixed(0)} mins urge surfing and trigger journaling.`,
            music: phase < 3 ? "Calm focus instrumentals" : "Confidence-building music",
            lifestyle: `${sunlight} mins outdoors. Block betting access and avoid gambling triggers.`
        },

        cf: {
            shortDiet: "Regular meals and hydration for steady energy",
            physical: `${workout.toFixed(0)} mins light-to-moderate exercise.`,
            mental: `${meditation.toFixed(0)} mins relaxation and fatigue awareness.`,
            music: phase < 3 ? "Calm morning instrumentals" : "Focus lo-fi",
            lifestyle: `${sunlight} mins morning daylight and a consistent sleep schedule.`
        }
    };

    return {
        ...plans[key],
        detailedDiet: detailedDietContent
    };
}

function initApp() {
    const savedName = localStorage.getItem("user_name");

    if (savedName) {
        appData.user.name = savedName;
    }

    const nameElement = document.getElementById("currentUserName");
    if (nameElement) {
        nameElement.innerText = appData.user.name;
    }

    if (appData.user.img) {
        applyAvatar(appData.user.img);
    }

    updateSidebarBars();
}

function updateSidebarBars() {
    ["sm", "sa", "gm", "jf", "gb", "cf"].forEach(key => {
        const day = appData[key].day;
        const currentM = MILESTONES.find(m => day <= m) || 120;
        const prevM = MILESTONES[MILESTONES.indexOf(currentM) - 1] || 0;
        const pct = Math.max(
            0,
            Math.min(100, Math.floor(((day - 1 - prevM) / (currentM - prevM)) * 100))
        );

        const label = document.getElementById(`pct-${key}`);
        const bar = document.getElementById(`bar-${key}`);

        if (label) label.innerText = pct + "%";
        if (bar) bar.style.width = pct + "%";
    });
}

function openAddiction(type) {
    const key = STAT_MAP[type];
    if (!key) return;

    currentAddiction = type;
    const currentDay = appData[key].day;

    document.getElementById("dashboard").style.display = "none";
    document.getElementById("addictionPage").style.display = "block";

    document.getElementById("widgetDay").innerText = currentDay;
    document.getElementById("widgetStreak").innerText = appData[key].streak;

    const missionIndex = (currentDay - 1) % 7;
    const mission = DAILY_MISSIONS[key][missionIndex] || "Keep going!";
    const recovery = generateRecoveryPlan(key, currentDay);

    document.getElementById("specialTaskBox").innerHTML = `
        <div class="card special-mission">
            <h4 style="margin:0 0 5px;color:var(--secondary)">⭐ Special Mission</h4>
            <p style="margin:0;font-weight:bold">${mission}</p>
        </div>

        <div class="card" style="margin-top:15px">
            <h4 style="color:var(--secondary)">💪 Recovery Boost Plan</h4>

            <details style="margin-bottom:10px">
                <summary><b>🥗 Diet:</b> ${recovery.shortDiet}</summary>
                <div style="white-space:pre-line;padding-top:10px">${recovery.detailedDiet}</div>
            </details>

            <details style="margin-bottom:10px">
                <summary><b>🏃 Physical:</b> ${recovery.physical}</summary>
                <p>Choose a safe activity that suits your fitness and ability.</p>
            </details>

            <details style="margin-bottom:10px">
                <summary><b>🧠 Mental:</b> ${recovery.mental}</summary>
                <p>Notice the urge, name the trigger, breathe slowly, and choose your next action deliberately.</p>
            </details>

            <details style="margin-bottom:10px">
                <summary><b>🎵 Music:</b> ${recovery.music}</summary>
                <p>Try calming music during breaks or when you need a change of activity.</p>
            </details>

            <details style="margin-bottom:10px">
                <summary><b>🌞 Lifestyle:</b> ${recovery.lifestyle}</summary>
                <p>Small, repeatable routines can make healthier choices easier.</p>
            </details>
        </div>
    `;

    const routineIndex = ((currentDay - 1) % 7) + 1;
    const routine = DAILY_ROUTINES[routineIndex];

    document.getElementById("routineHeading").innerText =
        `Day ${currentDay} Routine`;

    document.getElementById("taskList").innerHTML = routine.map(task => `
        <div class="task-row">
            <span>${task}</span>
            <input type="checkbox" style="width:20px;height:20px">
        </div>
    `).join("");

    document.getElementById("taskContent").style.display = "block";
    document.getElementById("successCard").style.display = "none";

    updateTrophyUI();
}

function showWhyModal() {
    const key = STAT_MAP[currentAddiction];

    const explanations = {
        sm: `
            <b>📱 Mobile / Social Media</b><br><br>
            Identifying triggers and setting boundaries can help reduce automatic checking.
            Physical activity and mindfulness offer alternative ways to manage boredom and stress.
        `,

        sa: `
            <b>🚬 Smoking / Alcohol</b><br><br>
            Support, trigger awareness and coping strategies can help recovery.
            Alcohol or certain drug withdrawals can be dangerous, so seek medical advice before stopping if dependence is possible.
        `,

        gm: `
            <b>🎮 Gaming</b><br><br>
            Planned gaming hours, alternative activities and regular breaks can help create a healthier balance.
            Reviewing triggers can help you regain control of your time.
        `,

        jf: `
            <b>🍔 Junk Food Habits</b><br><br>
            Regular balanced meals and mindful eating can help you notice hunger, cravings and emotional triggers without relying on restrictive rules.
        `,

        gb: `
            <b>🎰 Gambling / Betting Recovery</b><br><br>
            Removing betting apps, blocking gambling websites and limiting access to gambling funds can reduce opportunities for impulsive betting.<br><br>
            Identifying emotional triggers and contacting a trusted person can help you respond to urges differently.<br><br>
            If gambling is causing financial or emotional harm, consider professional support.
        `,

        cf: `
            <b>☕ Caffeine Reduction</b><br><br>
            Tracking caffeine intake can help you recognize how much you consume and when you rely on it.<br><br>
            Consistent sleep, regular meals and hydration support healthier energy routines.<br><br>
            If you consume a lot of caffeine, reducing it gradually may help limit withdrawal headaches and fatigue.
        `
    };

    document.getElementById("whyContent").innerHTML =
        explanations[key] || "Keep building healthy habits.";

    document.getElementById("whyModal").style.display = "flex";
}

function closeWhyModal() {
    document.getElementById("whyModal").style.display = "none";
}

function markDone() {
    const key = STAT_MAP[currentAddiction];
    if (!key) return;

    const checks = document.querySelectorAll(
        '#taskList input[type="checkbox"]'
    );

    if (!Array.from(checks).every(check => check.checked)) {
        showWarning();
        return;
    }

    // Prevent accidental duplicate completion of the same day.
    if (appData[key].done[appData[key].day]) {
        document.getElementById("taskContent").style.display = "none";
        document.getElementById("successCard").style.display = "block";
        return;
    }

    appData[key].streak++;
    if (appData[key].streak % 3 === 0) {
        appData[key].shields++;
    }

    appData[key].done[appData[key].day] = true;
    localStorage.setItem("niv_v_final", JSON.stringify(appData));

    if (typeof confetti === "function") {
        confetti({ particleCount: 150, spread: 70 });
    }

    document.getElementById("taskContent").style.display = "none";
    document.getElementById("successCard").style.display = "block";

    document.getElementById("successTitle").innerText =
        appData[key].streak % 3 === 0
            ? "🛡️ SHIELD EARNED!"
            : "🌟 DAY COMPLETE";

    document.getElementById("widgetStreak").innerText =
        appData[key].streak;

    updateSidebarBars();
    updateTrophyUI();
}

function advanceToNextDay() {
    const key = STAT_MAP[currentAddiction];
    if (!key) return;

    // Only advance after the current day was completed.
    if (!appData[key].done[appData[key].day]) return;

    appData[key].day++;
    localStorage.setItem("niv_v_final", JSON.stringify(appData));

    openAddiction(currentAddiction);
    updateSidebarBars();
}

function updateTrophyUI() {
    const key = STAT_MAP[currentAddiction];
    if (!key || !appData[key]) return;

    const day = appData[key].day;
    const currentM = MILESTONES.find(m => day <= m) || 120;
    const prevM = MILESTONES[MILESTONES.indexOf(currentM) - 1] || 0;

    const progress = Math.max(
        0,
        Math.min(1, (day - prevM) / (currentM - prevM))
    );

    const shieldCount = document.getElementById("shieldCount");
    const trophy = document.getElementById("trophyPath");
    const label = document.getElementById("milestoneLabel");

    if (shieldCount) {
        shieldCount.innerText = appData[key].shields;
    }

    if (trophy) {
        if (day <= 7) trophy.style.stroke = "#d1ccbc";
        else if (day <= 21) trophy.style.stroke = "url(#bronze)";
        else if (day <= 75) trophy.style.stroke = "url(#silver)";
        else trophy.style.stroke = "url(#gold)";

        trophy.style.strokeDashoffset = 260 - (260 * progress);
    }

    if (label) {
        label.innerText = `Goal: Day ${currentM}`;
    }
}

function toggleSection(sectionId, arrowId) {
    const box = document.getElementById(sectionId);
    const arrow = document.getElementById(arrowId);

    if (!box) return;

    if (box.style.display === "none") {
        box.style.display = "block";
        if (arrow) arrow.style.transform = "rotate(90deg)";
    } else {
        box.style.display = "none";
        if (arrow) arrow.style.transform = "rotate(0deg)";
    }
}

function goBack() {
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("addictionPage").style.display = "none";
    updateSidebarBars();
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    if (!sidebar || !overlay) return;

    const open = sidebar.classList.toggle("open");
    overlay.style.display = open ? "block" : "none";
}

function showWarning() {
    document.getElementById("warningModal").style.display = "flex";
}

function hideWarning() {
    document.getElementById("warningModal").style.display = "none";
}

function showResetModal() {
    document.getElementById("resetModal").style.display = "flex";
}

function hideResetModal() {
    document.getElementById("resetModal").style.display = "none";
}

function confirmReset() {
    localStorage.clear();
    location.reload();
}

function showEditProfile() {
    document.getElementById("profileDisplay").style.display = "none";
    document.getElementById("profileEdit").style.display = "block";
}

function saveProfile() {
    const input = document.getElementById("userNameInput");
    const name = input ? input.value.trim() : "";

    if (name) appData.user.name = name;

    localStorage.setItem("niv_v_final", JSON.stringify(appData));
    location.reload();
}

function previewImg(input) {
    if (!input.files || !input.files[0]) return;

    const reader = new FileReader();

    reader.onload = event => {
        appData.user.img = event.target.result;
        applyAvatar(event.target.result);
        localStorage.setItem("niv_v_final", JSON.stringify(appData));
    };

    reader.readAsDataURL(input.files[0]);
}

function applyAvatar(src) {
    const avatar = document.getElementById("userAvatar");
    if (!avatar) return;

    avatar.innerHTML = "";

    const image = document.createElement("img");
    image.src = src;
    image.alt = "Profile photo";
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "cover";

    avatar.appendChild(image);
}
