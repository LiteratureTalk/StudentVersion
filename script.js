document.addEventListener("DOMContentLoaded", () => {
    // Element References
    const sections = {
        boot: document.querySelector(".loading-screen"),
        login: document.querySelector(".login-screen") || document.createElement("section"),
        start: document.querySelector(".experience-start"),
        character: document.querySelector(".character-selection"),
        transition: document.querySelector(".character-transition"),
        instruction: document.querySelector(".instruction-screen"),
        quotes: document.querySelectorAll(".quote-chamber"),
        tone: document.querySelector(".tone-dissection"),
        reflection: document.querySelector(".tone-reflection"),
        pressure: document.querySelector(".caste-pressure"),
        values: document.querySelector(".value-hierarchy"),
        comparison: document.querySelector(".value-comparison"),
        wellDone: document.querySelector(".well-done"),
        role: document.querySelector(".character-role"),
        congrats: document.querySelector(".congratulations")
    };
    const startBtn = document.querySelector(".start-btn");
    const systemTime = document.querySelector(".system-info");
    const countdownEl = document.querySelector(".countdown");
    const timerEl = document.querySelector(".timer");

    // State Management
    let currentCharacter = null;
    let valueStage = 0;
    let toneChoices = {};
    let valueRankings = { "winston-smith": [], "obrien": [], "user": [] };

    // Transition Utility
    const transitionTo = (from, to, animation = "fadeIn") => {
        if (!from || !to) return console.error(`Transition failed: from=${from}, to=${to}`);
        from.classList.add("animate-out");
        setTimeout(() => {
            from.classList.remove("visible", "animate-out");
            from.classList.add("hidden");
            to.classList.remove("hidden");
            to.classList.add("visible", animation);
            setTimeout(() => to.classList.remove(animation), 600);
        }, 400);
    };

    // Canvas Resize Handler
    const resizeCanvases = () => {
        document.querySelectorAll("canvas").forEach(canvas => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    };
    window.addEventListener("resize", resizeCanvases);

    // Particle Background Setup
    const setupParticles = (canvasId, color, count = 80) => {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return console.warn(`Canvas ${canvasId} not found`);
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const particles = Array(count).fill().map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 8 + 2,
            speedX: Math.random() * 0.15 - 0.075,
            speedY: Math.random() * 0.15 - 0.075,
            opacity: Math.random() * 0.4 + 0.2,
            color
        }));

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
                p.x += p.speedX;
                p.y += p.speedY;
                if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
                if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            });
            ctx.globalAlpha = 1;
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    };

    // System Boot Sequence
    const initBoot = () => {
        console.log("Initialising Room 101 Experience...");
        sections.boot.querySelector(".boot-interface").innerHTML = `
            <h1><i class="fas fa-power-off"></i> Room 101 Initialisation</h1>
            <p>System powering up...</p>
        `;
        sections.boot.classList.add("visible");
        setupParticles("boot-bg", "rgba(59, 130, 246, 0.5)", 100);

        setTimeout(() => {
            console.log("Boot sequence complete, proceeding to login...");
            transitionTo(sections.boot, sections.login);
            initLogin();
        }, 3000);
    };

    // Login Simulation (Terminal Style)
    const initLogin = () => {
        console.log("Loading Party Login Terminal...");
        sections.login.classList.add("login-screen");
        sections.login.innerHTML = `
            <canvas id="login-bg"></canvas>
            <div class="login-interface">
                <header class="login-header">
                    <h1><i class="fas fa-terminal"></i> Party Login Terminal</h1>
                </header>
                <div class="login-terminal">
                    <pre class="terminal-output">
> SYSTEM: PartyOS v1.9.8.4
> AUTH: Verifying credentials...
                    </pre>
                    <div class="login-form">
                        <div class="terminal-field">
                            <span class="prompt">USER:</span> <span class="input">PARTY_MEMBER</span>
                        </div>
                        <div class="terminal-field">
                            <span class="prompt">PASS:</span> <span class="input">****</span>
                        </div>
                        <p class="status">Processing authentication...</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(sections.login);
        sections.login.classList.remove("hidden");
        sections.login.classList.add("visible", "fadeIn");
        setupParticles("login-bg", "rgba(16, 185, 129, 0.4)");

        setTimeout(() => {
            console.log("Access granted, launching experience...");
            transitionTo(sections.login, sections.start);
            startCountdown();
            startGlobalTimer();
        }, 2500);
    };

    // System Time Update
    const updateTime = () => {
        if (systemTime) systemTime.textContent = `System Time: ${new Date().toLocaleTimeString("en-AU")}`;
    };
    updateTime();
    setInterval(updateTime, 1000);

    // Countdown Logic
    let countdown = 10;
    const startCountdown = () => {
        if (!countdownEl) return console.warn("Countdown element not found");
        console.log("Commencing experience countdown...");
        const timer = setInterval(() => {
            countdown--;
            countdownEl.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(timer);
                console.log("Countdown concluded, advancing to character selection...");
                transitionTo(sections.start, sections.character);
                initCharacterSelection();
            }
        }, 1000);
    };

    if (startBtn) {
        startBtn.addEventListener("click", () => {
            console.log("Manual start activated...");
            countdown = 0;
            transitionTo(sections.start, sections.character);
            initCharacterSelection();
        });
    }

    // Global 3:30 Minute Timer
    const startGlobalTimer = () => {
        let timeLeft = 3 * 60 + 30; // 3:30 in seconds
        const timer = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            document.querySelectorAll(".timer").forEach(el => {
                el.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
            });
            if (timeLeft <= 0) {
                clearInterval(timer);
                console.log("3:30 timer elapsed, transitioning to role prep...");
                const currentSection = document.querySelector("section.visible");
                transitionTo(currentSection, sections.instruction);
                showInstruction("role");
            }
        }, 1000);
    };

    // Particle Background Initialisation
    const particleConfigs = [
        ["particle-bg", "rgba(59, 130, 246, 0.5)"],
        ["quote1-bg", "rgba(59, 130, 246, 0.3)"],
        ["quote2-bg", "rgba(59, 130, 246, 0.3)"],
        ["quote3-bg", "rgba(59, 130, 246, 0.3)"],
        ["tone-bg", "rgba(16, 185, 129, 0.3)"],
        ["reflection-bg", "rgba(245, 158, 11, 0.3)"],
        ["caste-bg", "rgba(139, 92, 246, 0.3)"],
        ["value-bg", "rgba(34, 211, 238, 0.3)"],
        ["comparison-bg", "rgba(34, 211, 238, 0.3)"],
        ["discussion-bg", "rgba(59, 130, 246, 0.5)", 120]
    ];
    particleConfigs.forEach(([id, color, count]) => {
        if (document.getElementById(id)) setupParticles(id, color, count);
    });

    // Character Selection
    const initCharacterSelection = () => {
        console.log("Presenting character selection interface...");
        const cards = document.querySelectorAll(".character-card");
        cards.forEach(card => {
            card.addEventListener("click", () => {
                currentCharacter = card.dataset.character;
                console.log(`Character chosen: ${currentCharacter === "winston-smith" ? "Winston Smith" : "O'Brien"}`);
                transitionTo(sections.character, sections.transition);
                initCharacterTransition();
            }, { once: true });
        });
    };

    const initCharacterTransition = () => {
        const h1 = sections.transition.querySelector("h1");
        h1.innerHTML = `<i class="fas fa-user-check"></i> ${currentCharacter === "winston-smith" ? "Winston Smith" : "O'Brien"} Selected`;
        setTimeout(() => {
            console.log("Selection confirmed, proceeding to instructions...");
            transitionTo(sections.transition, sections.instruction);
            showInstruction("quote");
        }, 1500);
    };

    // Instruction Display
    const showInstruction = (type) => {
        console.log(`Displaying instruction for ${type} phase...`);
        const content = sections.instruction.querySelector(".instruction-interface");
        const instructions = {
            quote: ["<i class='fas fa-quote-left'></i> Quote Analysis", "Dive into your subject’s words by examining key quotes from the presentation."],
            tone: ["<i class='fas fa-volume-up'></i> Tone Analysis", "Explore the emotional tones shaping your subject’s words."],
            pressure: ["<i class='fas fa-bars'></i> Pressure Ranking", "Rank the pressures your subject faces, numbered 1 to 3 for clarity."],
            values: ["<i class='fas fa-sitemap'></i> Value Ranking", "Rank the values that define your subject post-presentation, numbered 1 to 3."],
            role: ["<i class='fas fa-user-tie'></i> Role Prep", "Prepare to embody your character for the next challenge ahead."]
        };
        content.innerHTML = `
            <h1>${instructions[type][0]}</h1>
            <p>${instructions[type][1]}</p>
            <button class="action-btn next-btn">Proceed</button>
        `;
        transitionTo(document.querySelector("section.visible"), sections.instruction);
        content.querySelector(".next-btn").addEventListener("click", () => {
            console.log(`Advancing to ${type} activity...`);
            const nextSteps = {
                quote: () => initQuoteChamber(1),
                tone: initToneDissection,
                pressure: initPressure,
                values: () => initValues(currentCharacter),
                role: initRoleConfirmation
            };
            nextSteps[type]();
        }, { once: true });
    };

    // Quote Chamber Logic
    const initQuoteChamber = (num) => {
        console.log(`Entering Quote Chamber ${num}...`);
        const chamber = sections.quotes[num - 1];
        if (!chamber) return console.error(`Quote chamber ${num} not found`);

        const quoteEl = chamber.querySelector(".quote-text");
        const analysisEl = chamber.querySelector(".analysis-interface");
        const wordEl = analysisEl.querySelector(".word-display");
        const sentenceEl = analysisEl.querySelector(".breakdown-sentence");
        const responseEl = chamber.querySelector(".response-interface");
        const nextBtn = responseEl.querySelector(".next-btn");

        const data = {
            "winston-smith": {
                quotes: [
                    "If there is hope, it lies in the proles.",
                    "We are the dead.",
                    "Freedom is the freedom to say that two plus two make four."
                ],
                breakdowns: [
                    { 
                        "hope": "Signifies a fragile possibility of change amidst oppression.", 
                        "proles": "Suggests an untapped strength in numbers, overlooked by power." 
                    },
                    { 
                        "we": "Shared identity bound by despair and resistance.", 
                        "dead": "Sense of inevitable doom under control." 
                    },
                    { 
                        "freedom": "The ultimate liberty to uphold truth against tyranny.", 
                        "say": "Asserting reality in defiance of manipulation." 
                    }
                ]
            },
            "obrien": {
                quotes: [
                    "There are no martyrdoms in this place.",
                    "Power is inflicting pain and humiliation.",
                    "Reality is not external, Winston."
                ],
                breakdowns: [
                    { 
                        "martyrdoms": "Futile heroism crushed by absolute control.", 
                        "place": "Domain where power erases all traces of sacrifice." 
                    },
                    { 
                        "power": "Signifies dominance achieved through relentless cruelty.", 
                        "pain": "Suffering inflicted to break the human spirit." 
                    },
                    { 
                        "reality": "Reflects a constructed perception shaped by authority.", 
                        "external": "Challenges the notion of an objective truth beyond control." 
                    }
                ]
            }
        };

        quoteEl.textContent = data[currentCharacter].quotes[num - 1];
        transitionTo(document.querySelector("section.visible"), chamber);
        quoteEl.parentElement.classList.remove("hidden");

        setTimeout(() => {
            quoteEl.parentElement.classList.add("hidden");
            analysisEl.classList.remove("hidden");

            const words = data[currentCharacter].quotes[num - 1].split(" ");
            const breakdown = data[currentCharacter].breakdowns[num - 1];
            const analysedWords = Object.keys(breakdown);
            let wordIdx = 0;

            const showWord = () => {
                if (wordIdx >= words.length) {
                    analysisEl.classList.add("hidden");
                    responseEl.classList.remove("hidden");
                    console.log(`Quote ${num} analysis complete, awaiting response...`);
                    return;
                }

                const word = words[wordIdx].toLowerCase().replace(/[.,]/g, "");
                wordEl.textContent = word;
                const isAnalysed = analysedWords.includes(word);

                if (isAnalysed) {
                    sentenceEl.textContent = breakdown[word];
                    setTimeout(() => {
                        wordIdx++;
                        showWord();
                    }, 4000); // 4 seconds for analysed words
                } else {
                    sentenceEl.textContent = "";
                    setTimeout(() => {
                        wordIdx++;
                        showWord();
                    }, 1500); // 1.5 seconds for unanalysed words
                }
            };

            showWord();
        }, 4000);

        nextBtn.addEventListener("click", () => {
            console.log(`Quote ${num} response submitted...`);
            responseEl.classList.add("hidden");
            if (num < 3) {
                transitionTo(chamber, sections.quotes[num]);
                initQuoteChamber(num + 1);
            } else {
                transitionTo(chamber, sections.instruction);
                showInstruction("tone");
            }
        }, { once: true });
    };

    // Tone Dissection
    const initToneDissection = () => {
        console.log("Starting tone dissection...");
        const quote = currentCharacter === "winston-smith" 
            ? "Freedom is the freedom..." 
            : "Power is inflicting...";
        sections.tone.querySelector(".tone-quote").textContent = quote;
        const sliders = sections.tone.querySelectorAll(".tone-slider");
        sliders.forEach(s => {
            s.value = 50;
            s.nextElementSibling.textContent = "50%";
            s.oninput = () => s.nextElementSibling.textContent = `${s.value}%`;
        });
        transitionTo(document.querySelector("section.visible"), sections.tone);
        sections.tone.querySelector(".submit-btn").addEventListener("click", () => {
            toneChoices = {
                bitterness: sliders[0].value,
                defiance: sliders[1].value,
                resignation: sliders[2].value
            };
            console.log("Tone dissection submitted...");
            transitionTo(sections.tone, sections.reflection);
            initReflection();
        }, { once: true });
    };

    // Tone Reflection
    const initReflection = () => {
        console.log("Reflecting on tone analysis...");
        sections.reflection.querySelector(".reflection-content").textContent = 
            `Bitterness: ${toneChoices.bitterness}% | Defiance: ${toneChoices.defiance}% | Resignation: ${toneChoices.resignation}%`;
        sections.reflection.querySelector(".submit-btn").addEventListener("click", () => {
            console.log("Tone reflection submitted...");
            transitionTo(sections.reflection, sections.instruction);
            showInstruction("pressure");
        }, { once: true });
    };

    // Caste Pressure
    const initPressure = () => {
        console.log("Initiating pressure ranking...");
        sections.pressure.querySelector(".caste-scenario").textContent = 
            `${currentCharacter === "winston-smith" ? "Winston" : "O'Brien"} under scrutiny.`;
        const items = sections.pressure.querySelectorAll(".pressure-item");
        const slots = sections.pressure.querySelectorAll(".drop-slot");
        items.forEach(i => i.addEventListener("dragstart", e => e.dataTransfer.setData("text", i.textContent)));
        slots.forEach(s => {
            s.addEventListener("dragover", e => e.preventDefault());
            s.addEventListener("drop", e => {
                s.textContent = e.dataTransfer.getData("text");
            });
        });
        transitionTo(document.querySelector("section.visible"), sections.pressure);
        sections.pressure.querySelector(".submit-btn").addEventListener("click", () => {
            console.log("Pressure ranking submitted...");
            transitionTo(sections.pressure, sections.instruction);
            showInstruction("values");
        }, { once: true });
    };

    // Value Hierarchy
    const initValues = (character) => {
        console.log(`Ranking values for ${character}...`);
        sections.values.querySelector(".character-name").textContent = 
            character === "winston-smith" ? "Winston" : character === "obrien" ? "O'Brien" : "You";
        const items = sections.values.querySelectorAll(".value-item");
        const slots = sections.values.querySelectorAll(".drop-slot");
        items.forEach(i => i.addEventListener("dragstart", e => e.dataTransfer.setData("text", i.textContent)));
        slots.forEach(s => {
            s.addEventListener("dragover", e => e.preventDefault());
            s.addEventListener("drop", e => {
                s.textContent = e.dataTransfer.getData("text");
            });
        });
        transitionTo(document.querySelector("section.visible"), sections.values);
        sections.values.querySelector(".submit-btn").addEventListener("click", () => {
            valueRankings[character] = Array.from(slots).map(s => s.textContent);
            console.log(`Values for ${character} ranked and submitted...`);
            transitionTo(sections.values, sections.comparison);
            initComparison(character);
        }, { once: true });
    };

    // Value Comparison
    const initComparison = (character) => {
        console.log("Presenting value comparison...");
        const content = sections.comparison.querySelector(".comparison-content");
        if (valueStage === 0) content.textContent = `Winston: ${valueRankings["winston-smith"].join(", ")}`;
        else if (valueStage === 1) content.textContent = 
            `O'Brien: ${valueRankings["obrien"].join(", ")} | Winston: ${valueRankings["winston-smith"].join(", ")}`;
        else content.textContent = 
            `You: ${valueRankings["user"].join(", ")} | Winston: ${valueRankings["winston-smith"].join(", ")} | O'Brien: ${valueRankings["obrien"].join(", ")}`;
        transitionTo(document.querySelector("section.visible"), sections.comparison);
        sections.comparison.querySelector(".submit-btn").addEventListener("click", () => {
            console.log("Value comparison submitted...");
            if (valueStage === 0) {
                initValues("obrien");
                valueStage = 1;
            } else if (valueStage === 1) {
                initValues("user");
                valueStage = 2;
            } else {
                transitionTo(sections.comparison, sections.instruction);
                showInstruction("role");
            }
        }, { once: true });
    };

    // Character Role Confirmation
    const initRoleConfirmation = () => {
        console.log("Unveiling your character role...");
        transitionTo(document.querySelector("section.visible"), sections.role);
        const roleInterface = sections.role.querySelector(".role-interface");
        roleInterface.innerHTML = `
            <h1><i class="fas fa-user-tie"></i> Your Role: <span class="character-name">${currentCharacter === "winston-smith" ? "Winston Smith" : "O'Brien"}</span></h1>
            <p class="role-message">Well done! Step into the spotlight, you’ll need to embody your character for the next activity.</p>
            <div class="role-score">
                <span class="score-icon"><i class="fas fa-star"></i></span>
                <span class="score-text">100/100</span>
            </div>
        `;
        setTimeout(() => {
            console.log("Role preparation complete, transitioning to congratulations...");
            transitionTo(sections.role, sections.congrats);
        }, 30000); // 30 seconds
    };

    // Congratulations
    sections.congrats.addEventListener("transitionend", () => {
        if (sections.congrats.classList.contains("visible")) {
            console.log("Experience concluded, resetting system...");
            setTimeout(() => location.reload(), 2500);
        }
    });

    // Launch Experience
    initBoot();
});
